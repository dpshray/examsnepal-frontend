import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {McqBrowseLayout} from '@/components/mcq/McqBrowseLayout';
import {getCategoryQuestions, getExamCategories} from '@/lib/mcqApi';

export const revalidate = 3600;

export async function generateStaticParams() {
    const categories = await getExamCategories();
    return categories.map((category) => ({categorySlug: category.slug}));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{categorySlug: string}>;
}): Promise<Metadata> {
    const {categorySlug} = await params;
    const categories = await getExamCategories();
    const category = categories.find((c) => c.slug === categorySlug);

    if (!category) {
        return {title: 'Category Not Found | Exams Nepal'};
    }

    const description = `Practice ${category.question_count.toLocaleString()} free MCQs for ${category.name} on Exams Nepal.`;

    return {
        title: `${category.name} MCQs | Exams Nepal`,
        description,
        alternates: {
            canonical: `/find-mcq/${category.slug}`,
        },
        openGraph: {
            title: `${category.name} MCQs | Exams Nepal`,
            description,
            type: 'website',
        },
    };
}

export default async function FindMcqCategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{categorySlug: string}>;
    searchParams: Promise<{page?: string}>;
}) {
    const {categorySlug} = await params;
    const {page: pageParam} = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);

    const categories = await getExamCategories();
    const category = categories.find((c) => c.slug === categorySlug);

    if (!category) {
        notFound();
    }

    const {data: mcqs, last_page: totalPages} = await getCategoryQuestions(categorySlug, page);

    return (
        <McqBrowseLayout
            categories={categories}
            activeCategorySlug={category.slug}
            heading={category.name}
            mcqs={mcqs}
            totalPages={totalPages}
            currentPage={page}
            pagerBasePath={`/find-mcq/${category.slug}`}
            searchBasePath="/find-mcq"
            emptyMessage="No MCQs found in this category."
        />
    );
}
