import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Building2,
    CalendarClock,
    CalendarCheck,
    ClipboardCheck,
    ClipboardList,
    ExternalLink,
    GraduationCap,
    ListChecks,
    Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { getExamGuide, getExamGuideCategories, getExamGuideCategory } from '@/lib/examGuideApi';

export const revalidate = 3600;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

const TYPE_LABELS: Record<string, string> = {
    license: 'License',
    loksewa: 'Loksewa',
    entrance: 'Entrance',
    job: 'Job',
};

export async function generateStaticParams() {
    const categories = await getExamGuideCategories();
    const params: { categorySlug: string; examSlug: string }[] = [];

    for (const category of categories) {
        const detail = await getExamGuideCategory(category.slug);
        detail?.guides.forEach((guide) => {
            params.push({ categorySlug: category.slug, examSlug: guide.slug });
        });
    }

    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ categorySlug: string; examSlug: string }>;
}): Promise<Metadata> {
    const { categorySlug, examSlug } = await params;
    const guide = await getExamGuide(categorySlug, examSlug);

    if (!guide) {
        return { title: 'Exam Not Found | ExamsNepal' };
    }

    const title = guide.meta_title || `${guide.name} Mock Test - Free Practice | ExamsNepal`;
    const description =
        guide.meta_description ||
        `Free ${guide.name} mock tests, syllabus, and eligibility on ExamsNepal.`;

    return {
        title,
        description,
        alternates: { canonical: `/exams/${guide.category.slug}/${guide.slug}` },
        openGraph: { title, description, type: 'article' },
    };
}

export default async function ExamGuidePage({
    params,
}: {
    params: Promise<{ categorySlug: string; examSlug: string }>;
}) {
    const { categorySlug, examSlug } = await params;
    const guide = await getExamGuide(categorySlug, examSlug);

    if (!guide) {
        notFound();
    }

    const pageUrl = `${SITE_URL}/exams/${guide.category.slug}/${guide.slug}`;

    const overviewItems: { label: string; value: string; icon: React.ElementType }[] = [
        ...(guide.conducting_body
            ? [{ label: 'Conducting Body', value: guide.conducting_body, icon: Building2 }]
            : []),
        ...(guide.eligibility ? [{ label: 'Eligibility', value: guide.eligibility, icon: GraduationCap }] : []),
        ...(guide.exam_pattern ? [{ label: 'Exam Pattern', value: guide.exam_pattern, icon: ClipboardList }] : []),
        ...(guide.passing_marks ? [{ label: 'Passing Marks', value: guide.passing_marks, icon: Target }] : []),
        ...(guide.application_period
            ? [{ label: 'Application Period', value: guide.application_period, icon: CalendarClock }]
            : []),
    ];

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Exams', item: `${SITE_URL}/exams` },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: guide.category.name,
                    item: `${SITE_URL}/exams/${guide.category.slug}`,
                },
                { '@type': 'ListItem', position: 4, name: guide.name, item: pageUrl },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: `${guide.name} Preparation`,
            description: guide.meta_description || guide.intro || guide.name,
            provider: {
                '@type': 'Organization',
                name: 'ExamsNepal',
                sameAs: SITE_URL,
            },
        },
        ...(guide.faqs.length > 0
            ? [
                  {
                      '@context': 'https://schema.org',
                      '@type': 'FAQPage',
                      mainEntity: guide.faqs.map((faq) => ({
                          '@type': 'Question',
                          name: faq.question,
                          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                      })),
                  },
              ]
            : []),
    ];

    const ctaCard = (
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-6 text-center">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <ClipboardCheck className="w-5 h-5 text-green-700" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Start Practicing</h2>
            {guide.question_count_label && (
                <p className="text-sm text-muted-foreground mb-4">{guide.question_count_label}</p>
            )}
            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Link href={guide.mock_test_url || '/find-mcq'}>Start Free Mock Test</Link>
            </Button>
        </div>
    );

    return (
        <section className="min-h-screen bg-gray-50">
            {/* eslint-disable-next-line react/no-danger */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
                <div className="max-w-5xl mx-auto px-4 pt-8 pb-10">
                    <nav className="text-sm text-green-100 mb-4" aria-label="Breadcrumb">
                        <Link href="/exams" className="hover:text-white hover:underline">
                            Exams
                        </Link>
                        <span className="mx-2 text-green-200">/</span>
                        <Link href={`/exams/${guide.category.slug}`} className="hover:text-white hover:underline">
                            {guide.category.name}
                        </Link>
                        <span className="mx-2 text-green-200">/</span>
                        <span className="text-white">{guide.name}</span>
                    </nav>

                    <h1 className="text-2xl sm:text-3xl font-bold font-montserrat leading-snug max-w-3xl">
                        {guide.name} Online Mock Test &amp; Preparation
                    </h1>

                    {guide.last_verified_at && (
                        <div className="flex items-center gap-1.5 mt-4 text-sm text-green-50">
                            <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                            <span>Last verified: {guide.last_verified_at}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {guide.intro && (
                        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {guide.intro}
                            </p>
                        </div>
                    )}

                    {overviewItems.length > 0 && (
                        <div>
                            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-green-700" aria-hidden="true" />
                                Exam Overview
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {overviewItems.map(({ label, value, icon: Icon }) => (
                                    <div
                                        key={label}
                                        className="bg-white rounded-xl border border-border shadow-sm p-4 flex gap-3"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-green-700" aria-hidden="true" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                                                {label}
                                            </div>
                                            <div className="text-sm text-gray-800 whitespace-pre-wrap">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA appears early on mobile since the sidebar is hidden until lg */}
                    <div className="lg:hidden">{ctaCard}</div>

                    {guide.syllabus && (
                        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-3">Syllabus</h2>
                            {/* Several guides' syllabus content is a real marks-distribution
                                <table> (5 columns, long cell text) from the CMS - without this
                                wrapper it overflows a mobile viewport instead of scrolling. */}
                            <div className="overflow-x-auto">
                                <div
                                    className="prose prose-sm max-w-none text-gray-700"
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{ __html: guide.syllabus }}
                                />
                            </div>
                        </div>
                    )}

                    {guide.faqs.length > 0 && (
                        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible>
                                {guide.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`}>
                                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    {guide.related_guides.length > 0 && (
                        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-3">Related Exams</h2>
                            <div className="flex flex-wrap gap-2">
                                {guide.related_guides.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/exams/${guide.category.slug}/${related.slug}`}
                                        className="text-sm px-3 py-1.5 rounded-full border border-green-300 text-green-700 hover:bg-green-50 transition"
                                    >
                                        {related.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {guide.official_source && (
                        <p className="text-sm text-muted-foreground">
                            Official source:{' '}
                            <a
                                href={guide.official_source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline"
                            >
                                {guide.official_source.replace(/^https?:\/\//, '')}
                                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                        </p>
                    )}
                </div>

                <aside className="hidden lg:flex lg:flex-col gap-4 sticky top-24 self-start">
                    {ctaCard}
                    <div className="bg-white rounded-xl border border-border shadow-sm p-5 flex flex-col gap-4">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Category
                            </div>
                            <Link
                                href={`/exams/${guide.category.slug}`}
                                className="text-sm font-medium text-green-700 hover:underline"
                            >
                                {guide.category.name} &rarr;
                            </Link>
                        </div>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Type
                            </div>
                            <span className="text-sm text-gray-800">
                                {TYPE_LABELS[guide.type] ?? guide.type}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
