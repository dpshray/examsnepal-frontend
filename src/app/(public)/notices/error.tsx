'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Shown when the notices API fails. Rendering this (a 5xx) instead of an empty
 * list or a 404 keeps search engines from dropping notice pages during an
 * outage.
 */
export default function NoticesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-16">
            <div className="max-w-lg w-full text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <ServerCrash className="w-8 h-8 text-green-700" aria-hidden="true" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-gray-900 mb-3">
                    Notices are temporarily unavailable
                </h1>
                <p className="text-muted-foreground mb-8">
                    We couldn&apos;t load the latest notices right now. Please try again in a moment.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button onClick={reset} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                        <RefreshCw className="w-4 h-4" aria-hidden="true" />
                        Try again
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/">
                            <Home className="w-4 h-4" aria-hidden="true" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
