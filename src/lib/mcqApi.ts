// Server-side fetch helpers shared by the /find-mcq and /mcq/[slug] pages.
// Plain fetch (not the axios-based McqService) since these run in Server
// Components and benefit from Next's fetch data cache / ISR revalidation.

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

export const MCQ_REVALIDATE_SECONDS = 3600;

export async function getExamCategories(): Promise<ExamCategory[]> {
    try {
        const res = await fetch(`${API_URL}/free/exam-categories`, {
            next: { revalidate: MCQ_REVALIDATE_SECONDS },
        });

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
        { next: { revalidate: MCQ_REVALIDATE_SECONDS } }
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
    const res = await fetch(
        `${API_URL}/free/search-questions?page=${page}&keyword=${encodeURIComponent(query)}`,
        { next: { revalidate: MCQ_REVALIDATE_SECONDS } }
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
