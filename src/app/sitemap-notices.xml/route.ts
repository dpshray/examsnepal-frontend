import { NextResponse } from 'next/server';
import { getNoticeFeed } from '@/lib/noticeApi';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

// Separate sitemap for /notices so it can refresh far more often than the
// MCQ shards (notices are published throughout the day). Listed in the
// /sitemap.xml index (sitemap-index.xml/route.ts).
export const revalidate = 900;

export async function GET() {
    const notices = await getNoticeFeed(45000);
    const now = new Date().toISOString();

    const urls = [
        { loc: `${SITE_URL}/notices`, lastmod: notices[0]?.lastmod ?? now, freq: 'hourly', priority: '0.8' },
        ...['loksewa', 'entrance', 'license'].map((c) => ({
            loc: `${SITE_URL}/notices/${c}`,
            lastmod: notices.find((n) => n.category === c)?.lastmod ?? now,
            freq: 'hourly',
            priority: '0.8',
        })),
        ...notices.map((n) => ({ loc: `${SITE_URL}/notices/${n.slug}`, lastmod: n.lastmod ?? now, freq: 'weekly', priority: '0.6' })),
    ];

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`),
        '</urlset>',
    ].join('\n');

    return new NextResponse(body, { headers: { 'Content-Type': 'application/xml' } });
}
