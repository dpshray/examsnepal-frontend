// Server-side fetch helpers for the /exams hub-and-spoke SEO pages.

export interface ExamGuideCategorySummary {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    guide_count: number;
}

export type ExamGuideType = 'license' | 'loksewa' | 'entrance' | 'job';

export interface ExamGuideSummary {
    id: number;
    name: string;
    slug: string;
    type: ExamGuideType;
    meta_description: string | null;
}

export interface ExamGuideCategoryDetail {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    guides: ExamGuideSummary[];
}

export interface ExamGuideFaq {
    question: string;
    answer: string;
}

export interface ExamGuideDetail {
    id: number;
    name: string;
    slug: string;
    type: ExamGuideType;
    meta_title: string | null;
    meta_description: string | null;
    intro: string | null;
    conducting_body: string | null;
    official_source: string | null;
    eligibility: string | null;
    exam_pattern: string | null;
    passing_marks: string | null;
    application_period: string | null;
    syllabus: string | null;
    faqs: ExamGuideFaq[];
    mock_test_url: string | null;
    question_count_label: string | null;
    last_verified_at: string | null;
    category: { name: string; slug: string };
    related_guides: { name: string; slug: string }[];
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export const EXAM_GUIDE_REVALIDATE_SECONDS = 3600;

export async function getExamGuideCategories(): Promise<ExamGuideCategorySummary[]> {
    try {
        const res = await fetch(`${API_URL}/free/exam-guides/categories`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data as ExamGuideCategorySummary[]) || [];
    } catch {
        return [];
    }
}

export async function getExamGuideCategory(categorySlug: string): Promise<ExamGuideCategoryDetail | null> {
    const res = await fetch(`${API_URL}/free/exam-guides/categories/${categorySlug}`, {
        cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load exam category (status ${res.status})`);
    const json = await res.json();
    return json.data as ExamGuideCategoryDetail;
}

export async function getExamGuide(categorySlug: string, examSlug: string): Promise<ExamGuideDetail | null> {
    const res = await fetch(`${API_URL}/free/exam-guides/${categorySlug}/${examSlug}`, {
        next: { revalidate: 3600 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load exam guide (status ${res.status})`);
    const json = await res.json();
    return json.data as ExamGuideDetail;
}
