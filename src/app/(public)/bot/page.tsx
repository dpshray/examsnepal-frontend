import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'ExamsNepalBot - Notice Crawler | ExamsNepal',
    description: 'Information about ExamsNepalBot, the crawler that collects public notices from official Nepali government, university and council websites.',
    alternates: { canonical: '/bot' },
};

export default function BotInfoPage() {
    return (
        <section className="mx-auto max-w-3xl px-4 py-10 text-gray-800">
            <h1 className="font-montserrat text-2xl font-bold text-gray-900 sm:text-3xl">ExamsNepalBot</h1>
            <p className="mt-2 text-sm text-gray-500">User-Agent: <code className="rounded bg-gray-100 px-1.5 py-0.5">ExamsNepalBot/1.0 (+https://www.examsnepal.com/bot)</code></p>

            <div className="mt-6 space-y-4 text-sm leading-relaxed">
                <p>
                    ExamsNepalBot reads the public notice boards of official Nepali institutions - the Public Service Commission, provincial
                    public service commissions, security forces, universities, the Medical Education Commission, professional councils and
                    similar bodies - so that candidates can find vacancy, entrance and licensing notices in one place on{' '}
                    <Link href="/notices" className="text-green-700 underline">ExamsNepal Notices</Link>. Every notice links back to the
                    original on the official website.
                </p>
                <h2 className="pt-2 text-lg font-bold text-gray-900">How it behaves</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>It obeys <code>robots.txt</code>, including rules addressed to <code>ExamsNepalBot</code>.</li>
                    <li>It only reads notice list pages and the notices and attachments linked from them.</li>
                    <li>It makes at most one request every two seconds to a site, never in parallel, and usually checks each list only a few times a day.</li>
                    <li>It does not submit forms, log in or access anything that is not publicly linked.</li>
                </ul>
                <h2 className="pt-2 text-lg font-bold text-gray-900">Blocking or contacting us</h2>
                <p>
                    To stop the crawler, add <code>User-agent: ExamsNepalBot</code> / <code>Disallow: /</code> to your robots.txt. If you run an
                    official site and want a notice corrected or removed, or would like us to crawl less often, please{' '}
                    <Link href="/contact-us" className="text-green-700 underline">contact us</Link>.
                </p>
            </div>
        </section>
    );
}
