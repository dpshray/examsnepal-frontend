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
//
// Returns null only for a 404. Any other failure (5xx, network, bad JSON) is
// retried once and then thrown, so the page renders its error boundary with a
// 5xx status - not a 404 or an empty list that search engines would index as
// "this notice / these notices no longer exist".
async function request<T>(path: string, attempt = 1): Promise<T | null> {
    try {
        const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return (json?.data as T) ?? null;
    } catch (error) {
        if (attempt < 2) return request<T>(path, attempt + 1);
        throw new Error(`Notice API GET ${path} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/** For optional page parts (filter options, home sections): render without them on failure. */
async function optional<T>(path: string): Promise<T | null> {
    try {
        return await request<T>(path);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getNotices(filters: NoticeFilters, perPage = 20): Promise<NoticePage> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    params.set('per_page', String(perPage));
    return (await request<NoticePage>(`/free/notices?${params}`)) ?? { data: [], current_page: 1, last_page: 1, total: 0 };
}

export function getNoticeHome(category?: NoticeCategory): Promise<NoticeHome | null> {
    return optional(`/free/notices/home${category ? `?category=${category}` : ''}`);
}

export function getNoticeMeta(): Promise<NoticeMeta | null> {
    return optional('/free/notices/meta');
}

/** null means the notice does not exist (404); API failures throw. */
export function getNotice(slug: string): Promise<NoticeDetail | null> {
    // Not cached by Next: every hit counts a view on the backend, and the
    // backend caches the payload itself.
    return request(`/free/notices/${encodeURIComponent(slug)}`);
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
