import { getNoticeFeed } from '@/lib/noticeApi';
import { categoryInfo } from '@/lib/noticeFormat';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

export const revalidate = 600;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
    const items = (await getNoticeFeed(50)).filter((n) => n.published_at);

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        '<channel>',
        '<title>ExamsNepal - Latest Exam &amp; Vacancy Notices</title>',
        `<link>${SITE_URL}/notices</link>`,
        `<atom:link href="${SITE_URL}/notices/feed.xml" rel="self" type="application/rss+xml" />`,
        '<description>Official Lok Sewa, entrance and license exam notices in Nepal.</description>',
        '<language>en</language>',
        ...items.map((n) =>
            [
                '<item>',
                `<title>${esc(n.title)}</title>`,
                `<link>${SITE_URL}/notices/${n.slug}</link>`,
                `<guid isPermaLink="true">${SITE_URL}/notices/${n.slug}</guid>`,
                `<category>${esc(categoryInfo(n.category)?.label ?? n.category)}</category>`,
                `<description>${esc(`${n.organization}${n.summary ? ` - ${n.summary}` : ''}`)}</description>`,
                `<pubDate>${new Date(n.published_at!).toUTCString()}</pubDate>`,
                '</item>',
            ].join(''),
        ),
        '</channel>',
        '</rss>',
    ].join('\n');

    return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
