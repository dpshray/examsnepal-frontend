import type { MetadataRoute } from 'next';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

export default async function robots(): Promise<MetadataRoute.Robots> {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/student/', '/payment/', '/exam/', '/login', '/register', '/forgot-password',
                    // MCQ search and ?page= listings render on every request (query
                    // strings can't be cached). Their pages canonicalize to the base
                    // URL, and every question is reachable via topic pages and the
                    // sitemap, so crawlers don't need them.
                    '/find-mcq?', '/find-mcq/*?',
                ],
            },
            {
                // SEO-tool crawlers: heavy crawl volume, no search traffic in return.
                userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'PetalBot', 'BLEXBot', 'DataForSeoBot'],
                disallow: '/',
            },
        ],
        // Sitemap index at /sitemap.xml (src/app/sitemap.xml/route.ts) fans out
        // to the sharded /sitemap/{n}.xml files - see that route's comment for why
        // a plain index was needed on top of generateSitemaps().
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
