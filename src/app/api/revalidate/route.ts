import { revalidateTag } from 'next/cache';
import { PUBLIC_DATA_TAG } from '@/lib/publicDataCache';

// Flush cached backend data so edited content shows up without waiting out the
// (deliberately long) cache lifetimes. The backend's `frontend:flush-cache`
// calls this after content edits; it can also be called by hand:
//
//   curl -X POST https://www.examsnepal.com/api/revalidate -H "x-revalidate-secret: $REVALIDATE_SECRET"
//   curl -X POST ... -H 'content-type: application/json' -d '{"tags":["notices","mcq:some-question-slug"]}'
//
// With no body, flushes "public-data" (menus, categories, guides, blog lists).
const ALLOWED_TAG = /^(public-data|notices|mcq|mcq:[A-Za-z0-9_-]{1,255})$/;
const MAX_TAGS = 100;

export async function POST(request: Request) {
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
        return Response.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const tags: unknown = body?.tags ?? [PUBLIC_DATA_TAG];

    if (!Array.isArray(tags) || tags.length === 0 || tags.length > MAX_TAGS
        || !tags.every((tag) => typeof tag === 'string' && ALLOWED_TAG.test(tag))) {
        return Response.json({ revalidated: false, message: 'Invalid tags' }, { status: 422 });
    }

    // 'max': serve the stale entry while the fresh one is fetched in the background.
    for (const tag of tags as string[]) {
        revalidateTag(tag, 'max');
    }

    return Response.json({ revalidated: true, tags });
}
