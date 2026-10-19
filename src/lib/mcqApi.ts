// Server-side fetch helpers shared by the /find-mcq and /mcq/[slug] pages.
// Plain fetch (not the axios-based McqService) since these run in Server
// Components and benefit from Next's fetch data cache / ISR revalidation.

import { publicDataFetchOptions } from '@/lib/publicDataCache';

export interface McqOption {
    option: string;
    value: number;
}

export interface Mcq {
    id: number;
    slug?: string;
    question: string;
    options: McqOption[];
}

export interface ExamCategory {
    id: number;
    slug: string;
    name: string;
    question_count: number;
}

export interface PaginatedMcqs {
    data: Mcq[];
    last_page: number;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export async function getExamCategories(): Promise<ExamCategory[]> {
    try {
        // Short TTL + tag instead of no-store - this list is in the sidebar
        // of every /mcq page, so no-store made all ~94k of them dynamic.
        // See publicDataCache.ts.
        const res = await fetch(`${API_URL}/free/exam-categories`, publicDataFetchOptions);

        if (!res.ok) {
            return [];
        }

        const json = await res.json();
        return (json.data as ExamCategory[]) || [];
    } catch {
        return [];
    }
}

export async function getCategoryQuestions(categorySlug: string, page: number): Promise<PaginatedMcqs> {
    const res = await fetch(
        `${API_URL}/free/exam-categories/${categorySlug}/questions?page=${page}`,
        publicDataFetchOptions
    );

    if (res.status === 404) {
        return { data: [], last_page: 1 };
    }

    if (!res.ok) {
        throw new Error(`Failed to load category questions (status ${res.status})`);
    }

    const json = await res.json();
    return { data: json.data?.data || [], last_page: json.data?.last_page || 1 };
}

export async function searchQuestions(query: string, page: number): Promise<PaginatedMcqs> {
    // cache: 'no-store' - arbitrary search terms, not worth caching.
    const res = await fetch(
        `${API_URL}/free/search-questions?page=${page}&keyword=${encodeURIComponent(query)}`,
        { cache: 'no-store' }
    );

    if (res.status === 404) {
        return { data: [], last_page: 1 };
    }

    if (!res.ok) {
        throw new Error(`Failed to search questions (status ${res.status})`);
    }

    const json = await res.json();
    return { data: json.data?.data || [], last_page: json.data?.last_page || 1 };
}

// ---- Topic pages (/find-mcq/{category}/{subject}): one exam category + one
// subject, built by the backend from indexable questions only (McqTopics).

export interface McqTopicSummary {
    category_slug: string;
    category_name: string;
    subject_slug: string;
    subject_name: string;
    question_count: number;
    answers: number;
    accuracy_pct: number | null;
}

export interface McqTopicQuestion {
    id: number;
    slug: string;
    question: string;
    explanation: string | null;
    image_url: string | null;
    options: { option: string; is_correct: boolean }[];
}

export interface McqTopicPage {
    topic: McqTopicSummary;
    questions: McqTopicQuestion[];
    current_page: number;
    last_page: number;
    related: Pick<McqTopicSummary, 'subject_slug' | 'subject_name' | 'question_count'>[];
    guides: { name: string; url: string }[];
}

export async function getMcqTopics(): Promise<McqTopicSummary[]> {
    try {
        const res = await fetch(`${API_URL}/free/mcq-topics`, publicDataFetchOptions);
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data as McqTopicSummary[]) || [];
    } catch {
        return [];
    }
}

/** null for an unknown topic or a page past the end (both 404 on the backend). */
export async function getMcqTopic(categorySlug: string, subjectSlug: string, page: number): Promise<McqTopicPage | null> {
    const res = await fetch(
        `${API_URL}/free/mcq-topics/${categorySlug}/${subjectSlug}?page=${page}`,
        publicDataFetchOptions,
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load MCQ topic (status ${res.status})`);
    const json = await res.json();
    return json.data as McqTopicPage;
}

export function mcqTopicPath(categorySlug: string, subjectSlug: string, page = 1): string {
    return `/find-mcq/${categorySlug}/${subjectSlug}${page > 1 ? `/${page}` : ''}`;
}
