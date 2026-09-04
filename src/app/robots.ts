import type { MetadataRoute } from 'next';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://examsnepal.com').replace(/\/+$/, '');

export default async function robots(): Promise<MetadataRoute.Robots> {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/student/', '/payment/', '/exam/', '/login', '/register', '/forgot-password'],
            },
        ],
        // Sitemap index at /sitemap.xml (src/app/sitemap.xml/route.ts) fans out
        // to the sharded /sitemap/{n}.xml files - see that route's comment for why
        // a plain index was needed on top of generateSitemaps().
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
