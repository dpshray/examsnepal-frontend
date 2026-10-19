import { revalidateTag } from 'next/cache';
import { PUBLIC_DATA_TAG } from '@/lib/publicDataCache';

// Flush cached public backend data (exam guides, MCQ categories, menu) right
// away instead of waiting out the 5-minute TTL - e.g. after renaming exam
// categories or deploying a backend schema change.
//
//   curl -X POST https://www.examsnepal.com/api/revalidate -H "x-revalidate-secret: $REVALIDATE_SECRET"
export async function POST(request: Request) {
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
        return Response.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
    }

    // 'max': serve the stale entry while the fresh one is fetched in the background.
    revalidateTag(PUBLIC_DATA_TAG, 'max');

    return Response.json({ revalidated: true, tag: PUBLIC_DATA_TAG });
}
