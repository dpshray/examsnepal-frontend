import type { MetadataRoute } from 'next';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://examsnepal.com').replace(/\/+$/, '');
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

// Next's generateSitemaps() convention doesn't produce a single /sitemap.xml
// index when split into multiple files - each chunk (/sitemap/0.xml,
// /sitemap/1.xml, ...) must be listed individually here instead.
async function getSitemapUrls(): Promise<string[]> {
    const urls = [`${SITE_URL}/sitemap/0.xml`];

    try {
        const res = await fetch(`${API_URL}/sitemap/mcq-meta`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const json = await res.json();
            const chunks: number = json?.data?.chunks ?? 0;
            for (let i = 1; i <= chunks; i++) {
                urls.push(`${SITE_URL}/sitemap/${i}.xml`);
            }
        }
    } catch {
        // fall back to just the static-pages sitemap
    }

    return urls;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/student/', '/payment/', '/exam/', '/login', '/register', '/forgot-password'],
            },
        ],
        sitemap: await getSitemapUrls(),
    };
}
