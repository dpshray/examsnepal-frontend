// Cache policy for public, read-only backend data (exam guides, MCQ
// categories). These used to be fetched with `cache: 'no-store'` after stale
// Data Cache entries outlived the Sep 2026 taxonomy migration - but no-store
// made every public page render dynamically (~1.5s TTFB) and voided each
// page's ISR `revalidate`. Instead: a short TTL bounds staleness, and the
// tag lets /api/revalidate flush everything at once after a migration/deploy.
export const PUBLIC_DATA_TAG = 'public-data';

export const PUBLIC_DATA_REVALIDATE_SECONDS = 300;

export const publicDataFetchOptions: RequestInit = {
    next: { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS, tags: [PUBLIC_DATA_TAG] },
};
