// Cache policy for public, read-only backend data (exam guides, MCQ
// categories). These used to be fetched with `cache: 'no-store'` after stale
// Data Cache entries outlived the Sep 2026 taxonomy migration - but no-store
// made every public page render dynamically (~1.5s TTFB) and voided each
// page's ISR `revalidate`.
//
// The TTL is long on purpose. A route revalidates as often as its shortest
// fetch, and the public layout's menu uses these options, so a 5-minute TTL
// made every public page - including ~194k MCQ pages - re-render on Vercel
// whenever a crawler hit it more than 5 minutes after the last render. Content
// edits flush the tag instead: the backend's `frontend:flush-cache` calls
// /api/revalidate within about a minute of an admin change.
export const PUBLIC_DATA_TAG = 'public-data';

export const PUBLIC_DATA_REVALIDATE_SECONDS = 604800; // 7 days

export const publicDataFetchOptions: RequestInit = {
    next: { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS, tags: [PUBLIC_DATA_TAG] },
};
