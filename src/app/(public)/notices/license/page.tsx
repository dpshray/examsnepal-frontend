import type { Metadata } from 'next';
import NoticesListing, { listingMetadata, readFilters, type NoticeSearchParams } from '@/components/notices/NoticesListing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: NoticeSearchParams }): Promise<Metadata> {
    return listingMetadata('license', readFilters(await searchParams, 'license'));
}

export default async function LicenseNoticesPage({ searchParams }: { searchParams: NoticeSearchParams }) {
    return <NoticesListing category="license" filters={readFilters(await searchParams, 'license')} />;
}
