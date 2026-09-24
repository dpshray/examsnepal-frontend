import type { Metadata } from 'next';
import NoticesListing, { listingMetadata, readFilters, type NoticeSearchParams } from '@/components/notices/NoticesListing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: NoticeSearchParams }): Promise<Metadata> {
    return listingMetadata('loksewa', readFilters(await searchParams, 'loksewa'));
}

export default async function LoksewaNoticesPage({ searchParams }: { searchParams: NoticeSearchParams }) {
    return <NoticesListing category="loksewa" filters={readFilters(await searchParams, 'loksewa')} />;
}
