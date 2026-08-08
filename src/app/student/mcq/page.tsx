import {McqBrowseLayout} from '@/components/mcq/McqBrowseLayout';
import {getCategoryQuestions, getExamCategories, searchQuestions} from '@/lib/mcqApi';

export default async function StudentMcq({
    searchParams,
}: {
    searchParams: Promise<{q?: string; category?: string; page?: string}>;
}) {
    const {q, category: categorySlugParam, page: pageParam} = await searchParams;
    const query = q?.trim() || '';
    const page = Math.max(1, Number(pageParam) || 1);

    const categories = await getExamCategories();
    const activeCategory = query
        ? null
        : categories.find((c) => c.slug === categorySlugParam) || categories[0] || null;

    const {data: mcqs, last_page: totalPages} = query
        ? await searchQuestions(query, page)
        : activeCategory
            ? await getCategoryQuestions(activeCategory.slug, page)
            : {data: [], last_page: 1};

    return (
        <McqBrowseLayout
            categories={categories}
            activeCategorySlug={activeCategory?.slug ?? null}
            heading={query ? `Results for "${query}"` : activeCategory?.name || 'Find MCQ'}
            mcqs={mcqs}
            totalPages={totalPages}
            currentPage={page}
            pagerBasePath="/student/mcq"
            searchBasePath="/student/mcq"
            emptyMessage={
                query ? `No MCQs found for "${query}". Please try a different search term.` : 'No MCQs found in this category.'
            }
            getCategoryHref={(category) => `/student/mcq?category=${category.slug}`}
        />
    );
}
