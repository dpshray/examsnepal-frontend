import {CategorySidebar} from '@/components/mcq/CategorySidebar';
import {FindMcqSearchBar} from '@/components/mcq/FindMcqSearchBar';
import {QuestionBrowseCard} from '@/components/mcq/QuestionBrowseCard';
import {CategoryPager} from '@/components/mcq/CategoryPager';
import type {ExamCategory, Mcq} from '@/lib/mcqApi';

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
}: McqBrowseLayoutProps) {
    return (
        <section className="min-h-screen bg-gray-50">
            <FindMcqSearchBar basePath={searchBasePath} />

            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                <CategorySidebar categories={categories} activeSlug={activeCategorySlug} getHref={getCategoryHref} />

                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold font-montserrat text-gray-900 mb-4">{heading}</h1>

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
