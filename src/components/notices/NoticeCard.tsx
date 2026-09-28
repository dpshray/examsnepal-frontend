import Link from 'next/link';
import { CalendarDays, Clock, Star } from 'lucide-react';
import type { NoticeSummary } from '@/lib/noticeApi';
import { TYPE_LABELS, deadlineLabel, formatAd, formatBs, isNew, noticeSubtitle, noticeTitle, orgInitials } from '@/lib/noticeFormat';

const DEADLINE_TONES = {
    urgent: 'bg-red-50 text-red-700 ring-red-200',
    soon: 'bg-amber-50 text-amber-800 ring-amber-200',
    open: 'bg-green-50 text-green-800 ring-green-200',
    closed: 'bg-gray-100 text-gray-500 ring-gray-200',
};

export default function NoticeCard({ notice }: { notice: NoticeSummary }) {
    const deadline = deadlineLabel(notice.application_deadline_ad);
    const subtitle = noticeSubtitle(notice);

    return (
        <article className="group relative flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-green-300 hover:shadow-md">
            <div
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xs font-bold tracking-tight text-green-800 ring-1 ring-green-100"
            >
                {orgInitials(notice.organization)}
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">{TYPE_LABELS[notice.notice_type] ?? 'Notice'}</span>
                    {isNew(notice) && <span className="rounded-full bg-green-600 px-2 py-0.5 text-white">New</span>}
                    {notice.is_featured && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                            <Star className="h-3 w-3" aria-hidden="true" /> Featured
                        </span>
                    )}
                    {notice.is_archived && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">Archived</span>}
                </div>
                <h3 className="text-[15px] font-semibold leading-snug text-gray-900">
                    <Link href={`/notices/${notice.slug}`} className="after:absolute after:inset-0 group-hover:text-green-800">
                        {noticeTitle(notice)}
                    </Link>
                </h3>
                {subtitle && <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{subtitle}</p>}
                <p className="text-xs text-gray-500">{notice.organization}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5 text-xs text-gray-600">
                    {(notice.published_date_bs || notice.published_date_ad) && (
                        <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                            {[formatBs(notice.published_date_bs), formatAd(notice.published_date_ad)].filter(Boolean).join(' · ')}
                        </span>
                    )}
                    {deadline && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ring-1 ${DEADLINE_TONES[deadline.tone]}`}>
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {deadline.text}
                        </span>
                    )}
                    {notice.exam_date_ad && !deadline && (
                        <span className="inline-flex items-center gap-1 font-medium text-blue-700">
                            Exam: {formatBs(notice.exam_date_bs) ?? formatAd(notice.exam_date_ad)}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
