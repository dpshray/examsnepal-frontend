import Link from 'next/link';
import { BookOpenCheck, Home, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundContent() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-16">
            <div className="max-w-lg w-full text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <SearchX className="w-8 h-8 text-green-700" aria-hidden="true" />
                </div>

                <p className="text-sm font-semibold text-green-700 tracking-wide uppercase mb-2">Error 404</p>
                <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-gray-900 mb-3">
                    Page Not Found
                </h1>
                <p className="text-muted-foreground mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved. Check the URL, or
                    head back to explore exams and MCQs.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                        <Link href="/">
                            <Home className="w-4 h-4" aria-hidden="true" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/find-mcq">
                            <SearchX className="w-4 h-4" aria-hidden="true" />
                            Find MCQs
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/exams">
                            <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
                            Browse Exams
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
