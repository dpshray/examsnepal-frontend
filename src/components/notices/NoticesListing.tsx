import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CalendarClock, Clock, Newspaper } from 'lucide-react';
import NoticeCard from './NoticeCard';
import NoticeFilterBar from './NoticeFilterBar';
import NoticeAlertsForm from './NoticeAlertsForm';
import NoticesDisclaimer from './NoticesDisclaimer';
import type { NoticeCategory, NoticeFilters, NoticeSummary } from '@/lib/noticeApi';
import { getNoticeHome, getNoticeMeta, getNotices } from '@/lib/noticeApi';
import { NOTICE_CATEGORIES, categoryInfo } from '@/lib/noticeFormat';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

export type NoticeSearchParams = Promise<Record<string, string | string[] | undefined>>;

const FILTER_KEYS = ['type', 'province', 'org', 'q', 'closing'] as const;

export function readFilters(raw: Record<string, string | string[] | undefined>, category?: NoticeCategory): NoticeFilters {
    const one = (k: string) => (Array.isArray(raw[k]) ? raw[k]?.[0] : raw[k]) as string | undefined;
    const page = Number(one('page') ?? 1);
    return {
        category,
        type: one('type'),
        province: one('province'),
        org: one('org'),
        q: one('q')?.slice(0, 100),
        closing: one('closing'),
        page: Number.isFinite(page) && page > 1 ? Math.floor(page) : undefined,
    };
}

const isFiltered = (f: NoticeFilters) => FILTER_KEYS.some((k) => f[k]) || (f.page ?? 1) > 1;

/**
 * Filtered / paginated combinations are thin duplicates of the category
 * page, so they are noindex,follow with a canonical to the base URL.
 */
export function listingMetadata(category: NoticeCategory | undefined, filters: NoticeFilters): Metadata {
    const info = categoryInfo(category);
    const path = category ? `/notices/${category}` : '/notices';
    const year = '2083';
    const title = info
        ? `${info.title} ${year} - Latest Official Updates | ExamsNepal`
        : `Latest Exam & Vacancy Notices in Nepal ${year} - Loksewa, Entrance, License | ExamsNepal`;
    const description = info
        ? info.description
        : 'All the latest official notices in one place: Lok Sewa vacancies, entrance exam forms and license exam dates in Nepal, with deadlines, exam dates and links to the official notice.';

    return {
        title,
        description,
        alternates: { canonical: path, types: { 'application/rss+xml': `${SITE_URL}/notices/feed.xml` } },
        robots: isFiltered(filters) ? { index: false, follow: true } : undefined,
        openGraph: { title, description, url: path, type: 'website' },
    };
}

function Section({ title, icon: Icon, notices, moreHref }: { title: string; icon: React.ElementType; notices: NoticeSummary[]; moreHref?: string }) {
    if (notices.length === 0) return null;
    return (
        <section aria-labelledby={`sec-${title}`} className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 id={`sec-${title}`} className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Icon className="h-5 w-5 text-green-700" aria-hidden="true" /> {title}
                </h2>
                {moreHref && (
                    <Link href={moreHref} className="text-sm font-medium text-green-700 hover:underline">
                        View all
                    </Link>
                )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {notices.map((n) => (
                    <NoticeCard key={n.id} notice={n} />
                ))}
            </div>
        </section>
    );
}

function Pagination({ basePath, filters, lastPage }: { basePath: string; filters: NoticeFilters; lastPage: number }) {
    const page = filters.page ?? 1;
    if (lastPage <= 1) return null;
    const href = (p: number) => {
        const params = new URLSearchParams();
        FILTER_KEYS.forEach((k) => filters[k] && params.set(k, String(filters[k])));
        if (p > 1) params.set('page', String(p));
        return `${basePath}${params.size ? `?${params}` : ''}`;
    };
    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-2">
            {page > 1 && (
                <Link href={href(page - 1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
                    ← Previous
                </Link>
            )}
            <span className="px-2 text-sm text-gray-600">
                Page {page} of {lastPage}
            </span>
            {page < lastPage && (
                <Link href={href(page + 1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
                    Next →
                </Link>
            )}
        </nav>
    );
}

export default async function NoticesListing({ category, filters }: { category?: NoticeCategory; filters: NoticeFilters }) {
    const info = categoryInfo(category);
    const basePath = category ? `/notices/${category}` : '/notices';
    const filtered = FILTER_KEYS.some((k) => filters[k]);
    const showSections = !filtered && (filters.page ?? 1) === 1;

    const [meta, home, list] = await Promise.all([
        getNoticeMeta(),
        showSections ? getNoticeHome(category) : Promise.resolve(null),
        getNotices(filters),
    ]);

    const tabs = [{ slug: undefined, label: 'All' }, ...NOTICE_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }))];

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Notices', item: `${SITE_URL}/notices` },
            ...(info ? [{ '@type': 'ListItem', position: 3, name: info.label, item: `${SITE_URL}${basePath}` }] : []),
        ],
    };

    return (
        <section className="min-h-screen bg-gray-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

            <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
                <div className="mx-auto max-w-6xl px-4 pb-8 pt-8">
                    <nav className="mb-3 text-sm text-green-100" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-white hover:underline">Home</Link>
                        <span className="mx-2 text-green-200">/</span>
                        {info ? (
                            <>
                                <Link href="/notices" className="hover:text-white hover:underline">Notices</Link>
                                <span className="mx-2 text-green-200">/</span>
                                <span className="text-white">{info.label}</span>
                            </>
                        ) : (
                            <span className="text-white">Notices</span>
                        )}
                    </nav>
                    <h1 className="max-w-3xl font-montserrat text-2xl font-bold leading-snug sm:text-3xl">
                        {info ? info.title : 'Latest Exam & Vacancy Notices in Nepal'}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-green-50 sm:text-base">
                        {info?.description ??
                            'Official Lok Sewa, entrance and license exam notices collected from government, university and council websites - with deadlines, exam dates and a link to every original notice.'}
                    </p>

                    <div className="mt-5 flex gap-1 overflow-x-auto" role="tablist" aria-label="Notice categories">
                        {tabs.map((t) => {
                            const active = t.slug === category;
                            const count = t.slug ? home?.counts?.[t.slug] : undefined;
                            return (
                                <Link
                                    key={t.label}
                                    href={t.slug ? `/notices/${t.slug}` : '/notices'}
                                    role="tab"
                                    aria-selected={active}
                                    className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
                                        active ? 'bg-gray-50 text-green-800' : 'text-green-50 hover:bg-white/10'
                                    }`}
                                >
                                    {t.label}
                                    {count ? <span className="ml-1.5 text-xs font-normal opacity-75">{count}</span> : null}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
                <Suspense>
                    <NoticeFilterBar meta={meta} category={category} />
                </Suspense>

                {showSections && home && (
                    <>
                        <Section title="Closing Soon" icon={Clock} notices={home.closing_soon} moreHref={`${basePath}?closing=7d`} />
                        <Section title="Upcoming Exams" icon={CalendarClock} notices={home.upcoming_exams} />
                    </>
                )}

                <section aria-labelledby="latest-heading" className="space-y-3">
                    <h2 id="latest-heading" className="flex items-center gap-2 text-lg font-bold text-gray-900">
                        <Newspaper className="h-5 w-5 text-green-700" aria-hidden="true" />
                        {filtered ? `${list.total} matching notice${list.total === 1 ? '' : 's'}` : 'Latest Notices'}
                    </h2>
                    {list.data.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                            No notices match these filters yet.
                        </p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {list.data.map((n) => (
                                <NoticeCard key={n.id} notice={n} />
                            ))}
                        </div>
                    )}
                    <Pagination basePath={basePath} filters={filters} lastPage={list.last_page} />
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                    <NoticeAlertsForm defaultCategory={category} />
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <h2 className="text-base font-bold text-gray-900">Preparing for one of these exams?</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Practise with thousands of free MCQs and full-length mock tests built around the official syllabus.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Link href="/exams" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                                Browse exam guides
                            </Link>
                            <Link href="/find-mcq" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                                Free MCQ practice
                            </Link>
                        </div>
                    </div>
                </div>

                <NoticesDisclaimer />
            </div>
        </section>
    );
}
