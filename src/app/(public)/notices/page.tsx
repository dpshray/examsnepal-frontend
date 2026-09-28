import type { Metadata } from 'next';
import NoticesListing, { listingMetadata, readFilters, type NoticeSearchParams } from '@/components/notices/NoticesListing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: NoticeSearchParams }): Promise<Metadata> {
    return listingMetadata(undefined, readFilters(await searchParams));
}

export default async function NoticesPage({ searchParams }: { searchParams: NoticeSearchParams }) {
    return <NoticesListing filters={readFilters(await searchParams)} />;
}
