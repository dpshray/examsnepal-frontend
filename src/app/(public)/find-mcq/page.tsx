import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {McqBrowseLayout} from '@/components/mcq/McqBrowseLayout';
import {getExamCategories, searchQuestions} from '@/lib/mcqApi';

export const metadata: Metadata = {
    title: 'Find Your MCQ | Exams Nepal',
    description: 'Browse thousands of free MCQs by exam category, or search for a specific topic.',
};

export default async function FindMcq({
    searchParams,
}: {
    searchParams: Promise<{q?: string; page?: string}>;
}) {
    const {q, page: pageParam} = await searchParams;
    const query = q?.trim() || '';
    const page = Math.max(1, Number(pageParam) || 1);

    const categories = await getExamCategories();

    if (!query && categories.length > 0) {
        redirect(`/find-mcq/${categories[0].slug}`);
    }

    const {data: mcqs, last_page: totalPages} = query
        ? await searchQuestions(query, page)
        : {data: [], last_page: 1};

    return (
        <McqBrowseLayout
            categories={categories}
            activeCategorySlug={null}
            heading={`Results for "${query}"`}
            mcqs={mcqs}
            totalPages={totalPages}
            currentPage={page}
            pagerBasePath="/find-mcq"
            searchBasePath="/find-mcq"
            emptyMessage={`No MCQs found for "${query}". Please try a different search term.`}
        />
    );
}
