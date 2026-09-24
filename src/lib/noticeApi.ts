// Server-side fetch helpers for the /notices pages (official Loksewa,
// entrance and license notices collected by the backend pipeline).

export type NoticeCategory = 'loksewa' | 'entrance' | 'license';

export interface NoticeSummary {
    id: number;
    slug: string;
    title_en: string | null;
    title_ne: string | null;
    title_original: string;
    category: NoticeCategory;
    sub_category: string | null;
    notice_type: string;
    organization: string;
    province: string | null;
    published_date_bs: string | null;
    published_date_ad: string | null;
    application_deadline_ad: string | null;
    exam_date_ad: string | null;
    exam_date_bs: string | null;
    is_featured: boolean;
    is_archived: boolean;
    published_at: string | null;
    updated_at: string | null;
}

export interface NoticePost {
    name: string;
    service_group: string | null;
    level: string | null;
    seats: number | null;
    qualification: string | null;
}

export interface NoticeExamLink {
    tag: string;
    label: string;
    guide_url: string | null;
    mock_test_url: string | null;
}

export interface NoticeDetail extends NoticeSummary {
    summary_en: string | null;
    summary_ne: string | null;
    source_url: string;
    attachment_urls: { url: string; name?: string | null }[];
    application_start_ad: string | null;
    application_start_bs: string | null;
    application_deadline_bs: string | null;
    double_fee_deadline_ad: string | null;
    double_fee_deadline_bs: string | null;
    posts: NoticePost[];
    fees: { label: string; amount: string }[];
    eligibility: string[];
    exam_centers: string[];
    exam_tags: string[];
    exam_links: NoticeExamLink[];
    is_ai_summary: boolean;
    related: NoticeSummary[];
}

export interface NoticePage {
    data: NoticeSummary[];
    current_page: number;
    last_page: number;
    total: number;
}

export interface NoticeHome {
    closing_soon: NoticeSummary[];
    upcoming_exams: NoticeSummary[];
    latest: NoticeSummary[];
    counts: Partial<Record<NoticeCategory, number>>;
}

export interface NoticeMeta {
    categories: NoticeCategory[];
    /** Only types/provinces that at least one published notice has. */
    types: string[];
    provinces: string[];
    has_deadlines: boolean;
    sub_categories: Record<NoticeCategory, string[]>;
    organizations: Partial<Record<NoticeCategory, string[]>>;
    exam_tags: Record<string, string>;
}

export interface NoticeFilters {
    category?: NoticeCategory;
    type?: string;
    province?: string;
    org?: string;
    q?: string;
    closing?: string;
    page?: number;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

// cache: 'no-store' - the backend caches these responses for 10 minutes and
// invalidates them the moment a notice is published, so a second (Next Data
// Cache) layer only adds staleness: it can pin an empty/failed response for
// its whole revalidate window and survives redeploys on Vercel (the same
// problem documented in examGuideApi.ts / sitemap.ts).
async function get<T>(path: string, fallback: T): Promise<T> {
    try {
        const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
        if (!res.ok) return fallback;
        const json = await res.json();
        return (json?.data as T) ?? fallback;
    } catch {
        return fallback;
    }
}

export function getNotices(filters: NoticeFilters, perPage = 20): Promise<NoticePage> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    params.set('per_page', String(perPage));
    return get(`/free/notices?${params}`, { data: [], current_page: 1, last_page: 1, total: 0 });
}

export function getNoticeHome(category?: NoticeCategory): Promise<NoticeHome | null> {
    return get(`/free/notices/home${category ? `?category=${category}` : ''}`, null);
}

export function getNoticeMeta(): Promise<NoticeMeta | null> {
    return get('/free/notices/meta', null);
}

export async function getNotice(slug: string): Promise<NoticeDetail | null> {
    // Not cached by Next: every hit counts a view on the backend, and the
    // backend caches the payload itself.
    try {
        const res = await fetch(`${API_URL}/free/notices/${encodeURIComponent(slug)}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.data as NoticeDetail) ?? null;
    } catch {
        return null;
    }
}

export interface NoticeFeedItem {
    slug: string;
    title: string;
    summary: string | null;
    organization: string;
    category: NoticeCategory;
    published_at: string | null;
    lastmod: string | null;
}

export async function getNoticeFeed(limit = 5000): Promise<NoticeFeedItem[]> {
    try {
        // cache: 'no-store' - see the comment in sitemap.ts about Vercel's
        // Data Cache persisting stale results across deployments.
        const res = await fetch(`${API_URL}/free/notices/sitemap?limit=${limit}`, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        return (json?.data as NoticeFeedItem[]) ?? [];
    } catch {
        return [];
    }
}
