import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building2, CalendarCheck, CalendarClock, CalendarDays, ClipboardCheck, ExternalLink, FileText, Info, Users } from 'lucide-react';
import NoticeCard from '@/components/notices/NoticeCard';
import NoticesDisclaimer from '@/components/notices/NoticesDisclaimer';
import ShareButtons from '@/components/notices/ShareButtons';
import ReportErrorButton from '@/components/notices/ReportErrorButton';
import { getNotice, type NoticeDetail } from '@/lib/noticeApi';
import { PROVINCE_LABELS, TYPE_LABELS, categoryInfo, deadlineLabel, formatAd, formatBs, noticeSubtitle, noticeTitle } from '@/lib/noticeFormat';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

type Params = Promise<{ slug: string }>;

function metaTitle(n: NoticeDetail): string {
    const base = noticeTitle(n);
    const deadline = n.application_deadline_bs ? ` - Apply by ${formatBs(n.application_deadline_bs)}` : '';
    const full = `${base}${deadline} | ExamsNepal`;
    return full.length > 110 ? `${base.slice(0, 90)}… | ExamsNepal` : full;
}

function metaDescription(n: NoticeDetail): string {
    const text = n.summary_en || `${TYPE_LABELS[n.notice_type] ?? 'Notice'} from ${n.organization}.`;
    const deadline = n.application_deadline_ad ? ` Deadline: ${formatAd(n.application_deadline_ad)}.` : '';
    return `${text}${deadline} Official notice link, dates and preparation resources.`.slice(0, 300);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const notice = await getNotice((await params).slug);
    if (!notice) return { title: 'Notice Not Found | ExamsNepal', robots: { index: false } };

    const title = metaTitle(notice);
    const description = metaDescription(notice);

    return {
        title,
        description,
        alternates: { canonical: `/notices/${notice.slug}` },
        openGraph: { title, description, type: 'article', url: `/notices/${notice.slug}`, publishedTime: notice.published_at ?? undefined },
    };
}

/**
 * JobPosting only for genuine vacancies with every property Google requires;
 * incomplete markup produces Search Console errors, so skip rather than guess.
 */
function jobPostingLd(n: NoticeDetail, url: string) {
    if (n.notice_type !== 'vacancy' || !n.published_date_ad || !n.application_deadline_ad || !n.title_en) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: n.posts.length === 1 ? n.posts[0].name : n.title_en,
        description: n.summary_en || n.title_en,
        datePosted: n.published_date_ad,
        validThrough: `${n.application_deadline_ad}T23:59:59+05:45`,
        employmentType: 'FULL_TIME',
        hiringOrganization: { '@type': 'Organization', name: n.organization, sameAs: new URL(n.source_url).origin },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressCountry: 'NP',
                ...(n.province ? { addressRegion: `${PROVINCE_LABELS[n.province] ?? n.province} Province` } : {}),
            },
        },
        ...(n.posts.reduce((sum, p) => sum + (p.seats ?? 0), 0) > 0 ? { totalJobOpenings: n.posts.reduce((sum, p) => sum + (p.seats ?? 0), 0) } : {}),
        url,
    };
}

/** Event only for exams with a confirmed date and location. */
function eventLd(n: NoticeDetail, url: string) {
    if (!n.exam_date_ad || n.exam_centers.length === 0) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: n.title_en || noticeTitle(n),
        startDate: n.exam_date_ad,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: n.exam_centers.slice(0, 5).map((c) => ({ '@type': 'Place', name: c, address: { '@type': 'PostalAddress', addressCountry: 'NP', streetAddress: c } })),
        organizer: { '@type': 'Organization', name: n.organization, url: new URL(n.source_url).origin },
        url,
    };
}

function DateRow({ icon: Icon, label, bs, ad, highlight }: { icon: React.ElementType; label: string; bs?: string | null; ad?: string | null; highlight?: string | null }) {
    const bsText = formatBs(bs);
    const adText = formatAd(ad);
    return (
        <div className="flex items-start gap-3 py-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
            <div className="min-w-0 flex-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">
                    {bsText || adText ? (
                        <>
                            {bsText && <span>{bsText} BS</span>}
                            {bsText && adText && <span className="text-gray-400"> · </span>}
                            {adText && <span className={bsText ? 'text-gray-600' : ''}>{adText}</span>}
                            {highlight && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">{highlight}</span>}
                        </>
                    ) : (
                        <span className="text-gray-500">See official notice</span>
                    )}
                </dd>
            </div>
        </div>
    );
}

export default async function NoticeDetailPage({ params }: { params: Params }) {
    const notice = await getNotice((await params).slug);
    if (!notice) notFound();

    const url = `${SITE_URL}/notices/${notice.slug}`;
    const info = categoryInfo(notice.category);
    const title = noticeTitle(notice);
    const subtitle = noticeSubtitle(notice);
    const deadline = deadlineLabel(notice.application_deadline_ad);
    const totalSeats = notice.posts.reduce((sum, p) => sum + (p.seats ?? 0), 0);
    const isVacancyLike = ['vacancy', 'entrance_form', 'license_exam'].includes(notice.notice_type);

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Notices', item: `${SITE_URL}/notices` },
                ...(info ? [{ '@type': 'ListItem', position: 3, name: info.label, item: `${SITE_URL}/notices/${notice.category}` }] : []),
                { '@type': 'ListItem', position: info ? 4 : 3, name: title, item: url },
            ],
        },
        jobPostingLd(notice, url),
        eventLd(notice, url),
    ].filter(Boolean);

    return (
        <section className="min-h-screen bg-gray-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
                <div className="mx-auto max-w-5xl px-4 pb-8 pt-8">
                    <nav className="mb-3 text-sm text-green-100" aria-label="Breadcrumb">
                        <Link href="/notices" className="hover:text-white hover:underline">Notices</Link>
                        {info && (
                            <>
                                <span className="mx-2 text-green-200">/</span>
                                <Link href={`/notices/${notice.category}`} className="hover:text-white hover:underline">{info.label}</Link>
                            </>
                        )}
                    </nav>
                    <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-white/15 px-2.5 py-1">{TYPE_LABELS[notice.notice_type] ?? 'Notice'}</span>
                        {notice.province && <span className="rounded-full bg-white/15 px-2.5 py-1">{PROVINCE_LABELS[notice.province]} Province</span>}
                        {notice.is_archived && <span className="rounded-full bg-black/20 px-2.5 py-1">Archived</span>}
                        {deadline && <span className="rounded-full bg-white px-2.5 py-1 text-green-800">{deadline.text}</span>}
                    </div>
                    <h1 className="max-w-4xl font-montserrat text-xl font-bold leading-snug sm:text-2xl lg:text-3xl">{title}</h1>
                    {subtitle && <p className="mt-2 max-w-4xl text-base leading-relaxed text-green-50">{subtitle}</p>}
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-green-100">
                        <Building2 className="h-4 w-4" aria-hidden="true" /> {notice.organization}
                    </p>
                </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0 space-y-6">
                    {/* Official source first - it is the authority, we are the index. */}
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={notice.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                        >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" /> View Official Notice
                        </a>
                        {notice.attachment_urls
                            .filter((a) => a.url !== notice.source_url)
                            .slice(0, 4)
                            .map((a, i) => (
                                <a
                                    key={a.url}
                                    href={a.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                                >
                                    <FileText className="h-4 w-4 text-red-600" aria-hidden="true" />
                                    {a.name ? a.name.slice(0, 40) : `Official PDF${notice.attachment_urls.length > 1 ? ` ${i + 1}` : ''}`}
                                </a>
                            ))}
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white px-5 shadow-sm">
                        <dl className="divide-y divide-gray-100">
                            <DateRow icon={CalendarDays} label="Published" bs={notice.published_date_bs} ad={notice.published_date_ad} />
                            {(isVacancyLike || notice.application_deadline_ad) && (
                                <>
                                    {notice.application_start_ad && <DateRow icon={CalendarCheck} label="Applications open" bs={notice.application_start_bs} ad={notice.application_start_ad} />}
                                    <DateRow icon={CalendarClock} label="Application deadline" bs={notice.application_deadline_bs} ad={notice.application_deadline_ad} highlight={deadline && deadline.tone !== 'closed' ? deadline.text : null} />
                                    {notice.double_fee_deadline_ad && <DateRow icon={CalendarClock} label="Double-fee deadline" bs={notice.double_fee_deadline_bs} ad={notice.double_fee_deadline_ad} />}
                                </>
                            )}
                            {(notice.exam_date_ad || isVacancyLike || notice.notice_type === 'exam_schedule') && (
                                <DateRow icon={ClipboardCheck} label="Exam date" bs={notice.exam_date_bs} ad={notice.exam_date_ad} />
                            )}
                        </dl>
                    </div>

                    {(notice.summary_en || notice.summary_ne) && (
                        <section aria-labelledby="summary-heading" className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 id="summary-heading" className="text-base font-bold text-gray-900">Summary</h2>
                            {notice.is_ai_summary && (
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-800">
                                    <Info className="h-3.5 w-3.5" aria-hidden="true" /> Summary (auto-generated — verify with the official notice)
                                </p>
                            )}
                            {notice.summary_en && <p className="mt-3 text-sm leading-relaxed text-gray-800">{notice.summary_en}</p>}
                            {notice.summary_ne && <p className="mt-2 text-sm leading-relaxed text-gray-700" lang="ne">{notice.summary_ne}</p>}
                        </section>
                    )}

                    {notice.posts.length > 0 && (
                        <section aria-labelledby="posts-heading" className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 id="posts-heading" className="flex items-center gap-2 text-base font-bold text-gray-900">
                                <Users className="h-5 w-5 text-green-700" aria-hidden="true" /> Posts{totalSeats > 0 && ` · ${totalSeats} seats`}
                            </h2>
                            <div className="mt-3 overflow-x-auto">
                                <table className="w-full min-w-[520px] text-left text-sm">
                                    <thead className="border-b text-xs uppercase tracking-wide text-gray-500">
                                        <tr>
                                            <th scope="col" className="py-2 pr-3">Post</th>
                                            <th scope="col" className="py-2 pr-3">Service / Group</th>
                                            <th scope="col" className="py-2 pr-3">Level</th>
                                            <th scope="col" className="py-2 pr-3 text-right">Seats</th>
                                            <th scope="col" className="py-2">Qualification</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {notice.posts.map((p, i) => (
                                            <tr key={`${p.name}-${i}`} className="align-top">
                                                <td className="py-2 pr-3 font-medium text-gray-900">{p.name}</td>
                                                <td className="py-2 pr-3 text-gray-700">{p.service_group ?? '—'}</td>
                                                <td className="py-2 pr-3 text-gray-700">{p.level ?? '—'}</td>
                                                <td className="py-2 pr-3 text-right tabular-nums text-gray-900">{p.seats ?? '—'}</td>
                                                <td className="py-2 text-gray-700">{p.qualification ?? '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {(notice.eligibility.length > 0 || notice.fees.length > 0 || notice.exam_centers.length > 0) && (
                        <section className="grid gap-4 sm:grid-cols-2">
                            {notice.eligibility.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900">Eligibility</h2>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                        {notice.eligibility.map((e) => <li key={e}>{e}</li>)}
                                    </ul>
                                </div>
                            )}
                            {notice.fees.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900">Fees</h2>
                                    <dl className="mt-2 space-y-1 text-sm">
                                        {notice.fees.map((f) => (
                                            <div key={f.label} className="flex justify-between gap-3">
                                                <dt className="text-gray-600">{f.label}</dt>
                                                <dd className="font-medium text-gray-900">{f.amount}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}
                            {notice.exam_centers.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900">Exam centres</h2>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                        {notice.exam_centers.map((c) => <li key={c}>{c}</li>)}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <ShareButtons url={url} title={title} />
                        <ReportErrorButton slug={notice.slug} />
                    </div>

                    {notice.related.length > 0 && (
                        <section aria-labelledby="related-heading" className="space-y-3">
                            <h2 id="related-heading" className="text-lg font-bold text-gray-900">Related notices</h2>
                            <div className="grid gap-3">
                                {notice.related.map((r) => <NoticeCard key={r.id} notice={r} />)}
                            </div>
                        </section>
                    )}

                    <NoticesDisclaimer />
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    {notice.exam_links.length > 0 ? (
                        <div className="rounded-xl border border-green-200 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-bold text-gray-900">Prepare for this exam</h2>
                            <p className="mt-1 text-sm text-gray-600">Practise with mock tests built on the official syllabus.</p>
                            <ul className="mt-4 space-y-3">
                                {notice.exam_links.slice(0, 4).map((link) => (
                                    <li key={link.tag} className="rounded-lg bg-green-50 p-3">
                                        <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {link.mock_test_url && (
                                                <Link href={link.mock_test_url} className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                                                    Start Mock Test
                                                </Link>
                                            )}
                                            {link.guide_url && (
                                                <Link href={link.guide_url} className="rounded-md border border-green-300 bg-white px-3 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-100">
                                                    Exam guide
                                                </Link>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/student/subscription" className="mt-4 block text-center text-sm font-semibold text-green-700 hover:underline">
                                Unlock all mock tests →
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-green-200 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-bold text-gray-900">Start preparing</h2>
                            <p className="mt-1 text-sm text-gray-600">Free MCQs and mock tests for Loksewa, entrance and license exams.</p>
                            <Link href="/exams" className="mt-3 block rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700">
                                Browse exams
                            </Link>
                        </div>
                    )}
                    {info && (
                        <Link href={`/notices/${notice.category}`} className="block rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800 shadow-sm hover:border-green-300">
                            More {info.label.toLowerCase()} notices →
                        </Link>
                    )}
                </aside>
            </div>
        </section>
    );
}
