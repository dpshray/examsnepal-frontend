// Server-side fetch + display helpers for the public platform stats
// (backend App\Services\PublicStats). Every number is real and aggregate;
// display values are rounded *down* so the site never overstates them.

export interface SiteStats {
    students: number;
    questions: number;
    tests_completed: number;
    answers_submitted: number;
    tests_last_30_days: number;
    exam_guides: number;
    generated_at: string;
}

export interface SubjectAccuracy {
    name: string;
    accuracy_pct: number;
    answers: number;
}

export interface ExamStats {
    students_preparing: number;
    questions: number;
    tests_completed: number;
    average_score_pct: number;
    median_score_pct: number;
    top_10_percent_score_pct: number;
    answer_accuracy_pct: number | null;
    hardest_subjects: SubjectAccuracy[];
    easiest_subjects: SubjectAccuracy[];
    generated_at: string;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export async function getSiteStats(): Promise<SiteStats | null> {
    try {
        // The backend caches these for hours, so a 1h revalidate here costs
        // nothing in freshness and keeps the fetch out of the request path.
        const res = await fetch(`${API_URL}/free/stats`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const json = await res.json();
        return (json.data as SiteStats) ?? null;
    } catch {
        return null;
    }
}

/** 1,051,307 -> "1.05 million+", 194,348 -> "194,000+", 12,745 -> "12,700+", 842 -> "842". */
export function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(Math.floor(n / 10_000) / 100).toLocaleString('en-US')} million+`;
    if (n >= 10_000) return `${(Math.floor(n / 1000) * 1000).toLocaleString('en-US')}+`;
    if (n >= 1000) return `${(Math.floor(n / 100) * 100).toLocaleString('en-US')}+`;
    return n.toLocaleString('en-US');
}

/** "194K+" style, for tight spaces. */
export function formatCountShort(n: number): string {
    if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`;
    if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
    return n.toLocaleString('en-US');
}

export function formatStatsDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kathmandu',
    });
}
