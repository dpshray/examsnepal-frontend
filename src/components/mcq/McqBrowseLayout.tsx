import {CategorySidebar} from '@/components/mcq/CategorySidebar';
import {FindMcqSearchBar} from '@/components/mcq/FindMcqSearchBar';
import {QuestionBrowseCard} from '@/components/mcq/QuestionBrowseCard';
import {CategoryPager} from '@/components/mcq/CategoryPager';
import Link from 'next/link';
import {mcqTopicPath, type ExamCategory, type Mcq, type McqTopicSummary} from '@/lib/mcqApi';

interface McqBrowseLayoutProps {
    categories: ExamCategory[];
    activeCategorySlug: string | null;
    heading: string;
    mcqs: Mcq[];
    totalPages: number;
    currentPage: number;
    pagerBasePath: string;
    searchBasePath: string;
    emptyMessage: string;
    getCategoryHref?: (category: ExamCategory) => string;
    // Subject topic pages for the active category (crawlable links into them).
    topics?: McqTopicSummary[];
}

// Pure presentational layout shared by /find-mcq, /find-mcq/[categorySlug],
// and /student/mcq (the authenticated student-dashboard variant) - each of
// those pages fetches its own data and decides its own routing/redirect
// behavior, then renders this the same way.
export function McqBrowseLayout({
    categories,
    activeCategorySlug,
    heading,
    mcqs,
    totalPages,
    currentPage,
    pagerBasePath,
    searchBasePath,
    emptyMessage,
    getCategoryHref,
    topics = [],
}: McqBrowseLayoutProps) {
    return (
        <section className="min-h-screen bg-gray-50">
            <FindMcqSearchBar basePath={searchBasePath} />

            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                <CategorySidebar categories={categories} activeSlug={activeCategorySlug} getHref={getCategoryHref} />

                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold font-montserrat text-gray-900 mb-4">{heading}</h1>

                    {topics.length > 0 && (
                        <div className="mb-6 bg-white rounded-lg shadow-sm border border-border p-4">
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">Practice by subject</h2>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((t) => (
                                    <Link
                                        key={t.subject_slug}
                                        href={mcqTopicPath(t.category_slug, t.subject_slug)}
                                        className="text-sm px-3 py-1.5 rounded-full border border-green-300 text-green-700 hover:bg-green-50"
                                    >
                                        {t.subject_name} ({t.question_count.toLocaleString()})
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {mcqs.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-4">
                                {mcqs.map((mcq, index) => (
                                    <QuestionBrowseCard
                                        key={mcq.id}
                                        mcq={mcq}
                                        index={(currentPage - 1) * 10 + index + 1}
                                    />
                                ))}
                            </div>

                            <CategoryPager basePath={pagerBasePath} currentPage={currentPage} totalPages={totalPages} />
                        </>
                    ) : (
                        <p className="text-center text-gray-500">{emptyMessage}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
