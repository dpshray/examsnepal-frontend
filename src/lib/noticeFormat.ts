import type { NoticeCategory, NoticeSummary } from './noticeApi';

export const NOTICE_CATEGORIES: { slug: NoticeCategory; label: string; title: string; description: string }[] = [
    {
        slug: 'loksewa',
        label: 'Loksewa',
        title: 'Lok Sewa & Government Vacancy Notices',
        description:
            'Latest official vacancy (vigyapan), exam schedule and result notices from the Public Service Commission, provincial PSCs, security forces and public enterprises in Nepal.',
    },
    {
        slug: 'entrance',
        label: 'Entrance',
        title: 'Entrance Exam Notices',
        description:
            'Official MBBS/BDS/nursing CEE, MD/MS/MDS PG entrance, IOE, IOST, CTEVT and university entrance notices in Nepal with application deadlines and exam dates.',
    },
    {
        slug: 'license',
        label: 'License',
        title: 'License Exam Notices',
        description:
            'Official licensing exam notices from Nepal Medical, Nursing, Pharmacy, Engineering and other professional councils - exam dates, forms and results.',
    },
];

export const categoryInfo = (slug?: string) => NOTICE_CATEGORIES.find((c) => c.slug === slug);

export const TYPE_LABELS: Record<string, string> = {
    vacancy: 'Vacancy',
    exam_schedule: 'Exam Schedule',
    result: 'Result',
    admit_card: 'Admit Card',
    syllabus: 'Syllabus',
    interview: 'Interview',
    entrance_form: 'Application / Form',
    license_exam: 'License Exam',
    other: 'Notice',
};

export const PROVINCE_LABELS: Record<string, string> = {
    koshi: 'Koshi',
    madhesh: 'Madhesh',
    bagmati: 'Bagmati',
    gandaki: 'Gandaki',
    lumbini: 'Lumbini',
    karnali: 'Karnali',
    sudurpashchim: 'Sudurpashchim',
};

const BS_MONTHS = ['Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Asoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];

/** "2083-06-08" (BS) -> "8 Asoj 2083" */
export function formatBs(bs?: string | null): string | null {
    if (!bs) return null;
    const [y, m, d] = bs.split('-').map(Number);
    if (!y || !m || !d) return bs;
    return `${d} ${BS_MONTHS[m - 1] ?? m} ${y}`;
}

/** "2026-09-24" -> "Sep 24, 2026" (date-only, no timezone shift) */
export function formatAd(ad?: string | null): string | null {
    if (!ad) return null;
    const [y, m, d] = ad.slice(0, 10).split('-').map(Number);
    if (!y || !m || !d) return ad;
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** Whole days from today (Nepal time) until an AD date; negative if past. */
export function daysUntil(ad?: string | null): number | null {
    if (!ad) return null;
    const [y, m, d] = ad.slice(0, 10).split('-').map(Number);
    const nepalToday = new Date(Date.now() + (5 * 60 + 45) * 60 * 1000);
    const today = Date.UTC(nepalToday.getUTCFullYear(), nepalToday.getUTCMonth(), nepalToday.getUTCDate());
    return Math.round((Date.UTC(y, m - 1, d) - today) / 86_400_000);
}

export function deadlineLabel(ad?: string | null): { text: string; tone: 'urgent' | 'soon' | 'open' | 'closed' } | null {
    const days = daysUntil(ad);
    if (days === null) return null;
    if (days < 0) return { text: 'Closed', tone: 'closed' };
    if (days === 0) return { text: 'Closes today', tone: 'urgent' };
    if (days === 1) return { text: 'Closes tomorrow', tone: 'urgent' };
    if (days <= 7) return { text: `Closes in ${days} days`, tone: 'soon' };
    return { text: `Closes in ${days} days`, tone: 'open' };
}

export function isNew(notice: Pick<NoticeSummary, 'published_at' | 'published_date_ad'>): boolean {
    const ref = notice.published_date_ad ? Date.parse(notice.published_date_ad) : notice.published_at ? Date.parse(notice.published_at) : NaN;
    return !isNaN(ref) && Date.now() - ref < 48 * 3600 * 1000;
}

export function noticeTitle(n: Pick<NoticeSummary, 'title_en' | 'title_ne' | 'title_original'>): string {
    return n.title_en || n.title_ne || n.title_original;
}

/** Nepali subtitle shown under the English title, when it adds something. */
export function noticeSubtitle(n: Pick<NoticeSummary, 'title_en' | 'title_ne' | 'title_original'>): string | null {
    const ne = n.title_ne || (/[ऀ-ॿ]/.test(n.title_original) ? n.title_original : null);
    return n.title_en && ne && ne !== n.title_en ? ne : null;
}

export function orgInitials(org: string): string {
    const acronym = org.match(/\(([A-Z]{2,6})\)/)?.[1];
    if (acronym) return acronym.slice(0, 4);
    return org
        .replace(/\(.*?\)/g, '')
        .split(/\s+/)
        .filter((w) => /^[A-Z]/.test(w) && !['Of', 'And', 'The'].includes(w))
        .map((w) => w[0])
        .join('')
        .slice(0, 3) || org.slice(0, 2).toUpperCase();
}
