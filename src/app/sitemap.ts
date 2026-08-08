import type { MetadataRoute } from 'next';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://examsnepal.com').replace(/\/+$/, '');
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

const STATIC_ROUTES: {
    path: string;
    priority: number;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
}[] = [
    { path: '', priority: 1, changeFrequency: 'daily' },
    { path: '/find-mcq', priority: 0.9, changeFrequency: 'daily' },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' },
    { path: '/lok-sewa-notices', priority: 0.7, changeFrequency: 'daily' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact-us', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/terms-and-conditions', priority: 0.2, changeFrequency: 'yearly' },
];

// id 0 is the static-pages entry; ids 1..N map to 0-indexed MCQ slug chunks
// fetched from the backend (see FrontendController::sitemapMcqMeta/sitemapMcqs).
export async function generateSitemaps() {
    try {
        const res = await fetch(`${API_URL}/sitemap/mcq-meta`, { next: { revalidate: 3600 } });
        if (!res.ok) return [{ id: 0 }];

        const json = await res.json();
        const chunks: number = json?.data?.chunks ?? 0;

        return [{ id: 0 }, ...Array.from({ length: chunks }, (_, i) => ({ id: i + 1 }))];
    } catch (err) {
        console.error('generateSitemaps: failed to fetch mcq-meta', err);
        return [{ id: 0 }];
    }
}

async function getCategoryRoutes(): Promise<MetadataRoute.Sitemap> {
    try {
        // cache: 'no-store' - Vercel's Data Cache persists across deployments,
        // so a `next: {revalidate}` fetch here can keep baking a stale/bad
        // result (e.g. slug: null from a backend outage) into every generated
        // sitemap for up to the revalidate window, even after a redeploy.
        const res = await fetch(`${API_URL}/free/exam-categories`, { cache: 'no-store' });
        if (!res.ok) return [];

        const json = await res.json();
        const categories: { slug: string }[] = json?.data ?? [];

        return categories.map(({ slug }) => ({
            url: `${SITE_URL}/find-mcq/${slug}`,
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));
    } catch {
        return [];
    }
}

// /exams hub-and-spoke pages (published guides only - the backend already
// filters draft ones out of these list endpoints).
async function getExamGuideRoutes(): Promise<MetadataRoute.Sitemap> {
    try {
        // cache: 'no-store' - same Data Cache persistence risk as getCategoryRoutes above.
        const res = await fetch(`${API_URL}/free/exam-guides/categories`, { cache: 'no-store' });
        if (!res.ok) return [];

        const json = await res.json();
        const categories: { slug: string }[] = json?.data ?? [];

        const routes: MetadataRoute.Sitemap = [
            { url: `${SITE_URL}/exams`, changeFrequency: 'weekly', priority: 0.8 },
        ];

        for (const category of categories) {
            routes.push({
                url: `${SITE_URL}/exams/${category.slug}`,
                changeFrequency: 'weekly',
                priority: 0.7,
            });

            // cache: 'no-store' - a `next: {revalidate}` fetch here collided
            // with the /exams hub page's identical-shaped requests to this
            // same endpoint pattern (see examGuideApi.ts), silently returning
            // the wrong category's guide list for 2 of 3 categories.
            const detailRes = await fetch(`${API_URL}/free/exam-guides/categories/${category.slug}`, {
                cache: 'no-store',
            });
            if (!detailRes.ok) continue;

            const detailJson = await detailRes.json();
            const guides: { slug: string }[] = detailJson?.data?.guides ?? [];

            guides.forEach((guide) => {
                routes.push({
                    url: `${SITE_URL}/exams/${category.slug}/${guide.slug}`,
                    changeFrequency: 'weekly',
                    priority: 0.9,
                });
            });
        }

        return routes;
    } catch {
        return [];
    }
}

export default async function sitemap({ id }: { id: Promise<string> | number }): Promise<MetadataRoute.Sitemap> {
    const numericId = Number(await id);

    if (numericId === 0) {
        const staticRoutes = STATIC_ROUTES.map((route) => ({
            url: `${SITE_URL}${route.path}`,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        }));
        const categoryRoutes = await getCategoryRoutes();
        const examGuideRoutes = await getExamGuideRoutes();

        return [...staticRoutes, ...categoryRoutes, ...examGuideRoutes];
    }

    const page = numericId - 1;

    try {
        const res = await fetch(`${API_URL}/sitemap/mcqs?page=${page}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];

        const json = await res.json();
        const slugs: { slug: string }[] = json?.data ?? [];

        return slugs.map(({ slug }) => ({
            url: `${SITE_URL}/mcq/${slug}`,
            changeFrequency: 'monthly',
            priority: 0.5,
        }));
    } catch {
        return [];
    }
}
