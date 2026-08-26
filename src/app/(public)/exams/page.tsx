import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, GraduationCap, HardHat, Landmark } from 'lucide-react';
import { getExamGuideCategories, getExamGuideCategory, type ExamGuideCategoryDetail } from '@/lib/examGuideApi';

export const revalidate = 3600;

const SITE_URL = 'https://examsnepal.com';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    loksewa: Landmark,
    entrance: GraduationCap,
    'nec-license': HardHat,
};

export const metadata: Metadata = {
    title: 'Exam Guides - Loksewa, Entrance Exams, NEC License & More | ExamsNepal',
    description:
        'Syllabus, eligibility, exam pattern, and free mock tests for Loksewa, entrance exams, NEC license, and more — browse by category.',
    alternates: { canonical: '/exams' },
};

export default async function ExamsHubPage() {
    const summaries = await getExamGuideCategories();

    // Fetched sequentially rather than via Promise.all: concurrent fetches to
    // these structurally-similar URLs were hitting a Next.js dev-mode fetch
    // cache collision, silently returning one category's data for another.
    const categories: ExamGuideCategoryDetail[] = [];
    for (const summary of summaries) {
        const detail = await getExamGuideCategory(summary.slug);
        if (detail) categories.push(detail);
    }

    const totalGuides = summaries.reduce((sum, c) => sum + c.guide_count, 0);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Exams', item: `${SITE_URL}/exams` },
        ],
    };

    return (
        <section className="min-h-screen bg-gray-50">
            {/* eslint-disable-next-line react/no-danger */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold font-montserrat mb-3">Exam Guides</h1>
                    <p className="text-green-50 max-w-2xl mx-auto mb-5">
                        Syllabus, eligibility, exam pattern, and free mock tests for Nepal&apos;s Loksewa, entrance,
                        and professional-license exams.
                    </p>
                    {totalGuides > 0 && (
                        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
                            <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
                            {totalGuides} exam guide{totalGuides === 1 ? '' : 's'} across {categories.length}{' '}
                            categor{categories.length === 1 ? 'y' : 'ies'}
                        </div>
                    )}
                </div>
            </div>

            {categories.length > 1 && (
                <div className="sticky top-[64px] md:top-[72px] z-30 bg-white/95 backdrop-blur border-b border-border">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1">
                            Jump to:
                        </span>
                        {categories.map((category) => {
                            const Icon = CATEGORY_ICONS[category.slug] ?? BookOpenCheck;
                            return (
                                <a
                                    key={category.id}
                                    href={`#${category.slug}`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 hover:border-green-300 transition"
                                >
                                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                                    {category.name}
                                    <span className="text-green-600/70">({category.guides.length})</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-12">
                {categories.length === 0 ? (
                    <p className="text-muted-foreground text-center">No exam guides published yet.</p>
                ) : (
                    <div className="flex flex-col gap-14">
                        {categories.map((category) => {
                            const Icon = CATEGORY_ICONS[category.slug] ?? BookOpenCheck;

                            return (
                                <div key={category.id} id={category.slug} className="scroll-mt-32">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5 text-green-700" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold font-montserrat text-gray-900">
                                                    {category.name}
                                                </h2>
                                                {category.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/exams/${category.slug}`}
                                            className="shrink-0 text-sm font-medium text-green-700 hover:text-green-800 hover:underline whitespace-nowrap"
                                        >
                                            View all {category.guides.length} &rarr;
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.guides.map((guide) => (
                                            <Link
                                                key={guide.id}
                                                href={`/exams/${category.slug}/${guide.slug}`}
                                                className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-border shadow-sm hover:shadow-md hover:border-green-300 transition"
                                            >
                                                <div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                                        {guide.name}
                                                    </h3>
                                                    {guide.meta_description && (
                                                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                                                            {guide.meta_description}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 mt-4">
                                                    View guide
                                                    <ArrowRight
                                                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
