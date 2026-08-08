import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpenCheck, GraduationCap, HardHat, Landmark } from 'lucide-react';
import { getExamGuideCategories, getExamGuideCategory } from '@/lib/examGuideApi';

export const revalidate = 3600;

const SITE_URL = 'https://examsnepal.com';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    loksewa: Landmark,
    entrance: GraduationCap,
    'nec-license': HardHat,
};

export async function generateStaticParams() {
    const categories = await getExamGuideCategories();
    return categories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
    const { categorySlug } = await params;
    const category = await getExamGuideCategory(categorySlug);

    if (!category) {
        return { title: 'Category Not Found | ExamsNepal' };
    }

    const description =
        category.description ||
        `Free mock tests, syllabus, and eligibility guides for every ${category.name} exam on ExamsNepal.`;

    return {
        title: `${category.name} - Exam Guides & Free Mock Tests | ExamsNepal`,
        description,
        alternates: { canonical: `/exams/${category.slug}` },
    };
}

export default async function ExamCategoryPage({
    params,
}: {
    params: Promise<{ categorySlug: string }>;
}) {
    const { categorySlug } = await params;
    const category = await getExamGuideCategory(categorySlug);

    if (!category) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Exams', item: `${SITE_URL}/exams` },
            { '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/exams/${category.slug}` },
        ],
    };

    const Icon = CATEGORY_ICONS[category.slug] ?? BookOpenCheck;

    return (
        <section className="min-h-screen bg-gray-50">
            {/* eslint-disable-next-line react/no-danger */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
                <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
                    <nav className="text-sm text-green-100 mb-6" aria-label="Breadcrumb">
                        <Link href="/exams" className="hover:text-white hover:underline">
                            Exams
                        </Link>
                        <span className="mx-2 text-green-200">/</span>
                        <span className="text-white">{category.name}</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">{category.name}</h1>
                            {category.description && (
                                <p className="text-green-50 mt-1 max-w-2xl">{category.description}</p>
                            )}
                        </div>
                    </div>

                    {category.guides.length > 0 && (
                        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mt-6">
                            <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
                            {category.guides.length} exam guide{category.guides.length === 1 ? '' : 's'}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {category.guides.length === 0 ? (
                    <p className="text-muted-foreground text-center">No exam guides published in this category yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.guides.map((guide) => (
                            <Link
                                key={guide.id}
                                href={`/exams/${category.slug}/${guide.slug}`}
                                className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-border shadow-sm hover:shadow-md hover:border-green-300 transition"
                            >
                                <div>
                                    <h2 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                        {guide.name}
                                    </h2>
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
                )}
            </div>
        </section>
    );
}
