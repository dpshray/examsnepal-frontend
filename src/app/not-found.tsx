import type { Metadata } from 'next';
import NavBar from '@/components/header/NavBar';
import Footer from '@/components/common/Footer';
import NotFoundContent from '@/components/common/NotFoundContent';

export const metadata: Metadata = {
    title: 'Page Not Found | ExamsNepal',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className="flex flex-col overflow-x-clip min-h-screen">
            <NavBar />
            <main className="flex flex-grow flex-col">
                <NotFoundContent />
            </main>
            <Footer />
        </div>
    );
}
