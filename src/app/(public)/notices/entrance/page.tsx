import type { Metadata } from 'next';
import NoticesListing, { listingMetadata, readFilters, type NoticeSearchParams } from '@/components/notices/NoticesListing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: NoticeSearchParams }): Promise<Metadata> {
    return listingMetadata('entrance', readFilters(await searchParams, 'entrance'));
}

export default async function EntranceNoticesPage({ searchParams }: { searchParams: NoticeSearchParams }) {
    return <NoticesListing category="entrance" filters={readFilters(await searchParams, 'entrance')} />;
}
