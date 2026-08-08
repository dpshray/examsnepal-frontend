import type { Metadata } from 'next';
import NotFoundContent from '@/components/common/NotFoundContent';

export const metadata: Metadata = {
    title: 'Page Not Found | ExamsNepal',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return <NotFoundContent />;
}
