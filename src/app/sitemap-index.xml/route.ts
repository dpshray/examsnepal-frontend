import { NextResponse } from 'next/server';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

// Next's generateSitemaps() convention (see src/app/sitemap.ts) shards the
// site's ~194k MCQ pages across /sitemap/0.xml.. /sitemap/{n}.xml (a single
// file is capped at 50,000 URLs by the sitemap protocol) but deliberately
// does not expose a literal /sitemap.xml for a sharded sitemap - see the
// comment in robots.ts. That leaves /sitemap.xml 404ing, which breaks every
// SEO tool / GSC check that defaults to it and is what actually gets
// submitted as "the sitemap".
//
// This route fills that gap with a standard sitemap *index* file (part of
// the sitemap protocol itself: https://www.sitemaps.org/protocol.html#index)
// that just points at the existing shards - no change to how those are
// generated.
//
// It lives at /sitemap-index.xml, not literally /sitemap.xml: a route
// directory named "sitemap.xml" collides with Next's own internal routing
// for the sitemap.ts/generateSitemaps() convention (both start with
// "sitemap") and broke `next build` entirely with
// "Cannot find module for page: /sitemap/[__metadata_id__]". The
// next.config.ts rewrite maps the public /sitemap.xml URL to this route, so
// crawlers/tools still see /sitemap.xml - only the internal file path differs.
async function getShardCount(): Promise<number> {
    try {
        const res = await fetch(`${API_URL}/sitemap/mcq-meta`, { next: { revalidate: 3600 } });
        if (!res.ok) return 0;
        const json = await res.json();
        return json?.data?.chunks ?? 0;
    } catch {
        return 0;
    }
}

export const revalidate = 3600;

export async function GET() {
    const chunks = await getShardCount();
    const shardUrls = [`${SITE_URL}/sitemap/0.xml`, ...Array.from({ length: chunks }, (_, i) => `${SITE_URL}/sitemap/${i + 1}.xml`)];

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...shardUrls.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`),
        '</sitemapindex>',
    ].join('\n');

    return new NextResponse(body, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
