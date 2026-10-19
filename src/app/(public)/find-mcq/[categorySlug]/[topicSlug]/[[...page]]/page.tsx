import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategorySidebar } from '@/components/mcq/CategorySidebar';
import { getExamCategories, getMcqTopic, mcqTopicPath, type McqTopicPage } from '@/lib/mcqApi';

// Topic pages: one exam category + one subject, 20 questions a page with
// answers and explanations in the HTML (behind <details> so students can
// still try first). Paginated by path (/2, /3) rather than ?page= so every
// page is ISR-cached and the pager is plain crawlable links.
export const revalidate = 3600;

export async function generateStaticParams() {
    return [];
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

type Params = Promise<{ categorySlug: string; topicSlug: string; page?: string[] }>;

/** undefined for a malformed page segment (/x/abc, /x/1, /x/2/3) - those 404. */
function pageNumber(page?: string[]): number | undefined {
    if (!page || page.length === 0) return 1;
    if (page.length > 1 || !/^[1-9]\d*$/.test(page[0]) || page[0] === '1') return undefined;
    return Number(page[0]);
}

async function load(params: Params): Promise<{ data: McqTopicPage; page: number } | null> {
    const { categorySlug, topicSlug, page: segment } = await params;
    const page = pageNumber(segment);
    if (page === undefined) return null;
    const data = await getMcqTopic(categorySlug, topicSlug, page);
    return data ? { data, page } : null;
}

function title(data: McqTopicPage, page: number): string {
    const { subject_name, category_name } = data.topic;
    const suffix = page > 1 ? ` - Page ${page}` : '';
    const long = `${subject_name} MCQs for ${category_name}${suffix}`;
    // Category names run long ("Medical NMCLE / Loksewa / MDMS Exams"); past
    // ~60 chars Google truncates, so fall back to the subject alone.
    return long.length <= 60 ? long : `${subject_name} MCQs with Answers${suffix} | ExamsNepal`;
}

const stripTags = (html: string | null | undefined) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const loaded = await load(params);
    if (!loaded) return { title: 'Topic Not Found | ExamsNepal' };

    const { data, page } = loaded;
    const { topic } = data;
    const description = `Practice ${topic.question_count.toLocaleString()} ${topic.subject_name} MCQs for ${topic.category_name} with answers and explanations${
        topic.accuracy_pct !== null ? `. ExamsNepal students answer ${Math.round(topic.accuracy_pct)}% of these correctly` : ''
    }.`;
    const path = mcqTopicPath(topic.category_slug, topic.subject_slug, page);

    return {
        title: title(data, page),
        description,
        alternates: { canonical: path },
        openGraph: { title: title(data, page), description, type: 'website', url: path },
    };
}

export default async function McqTopicRoute({ params }: { params: Params }) {
    const [loaded, categories] = await Promise.all([load(params), getExamCategories()]);
    if (!loaded) notFound();

    const { data, page } = loaded;
    const { topic, questions, last_page: lastPage, related, guides } = data;
    const basePath = mcqTopicPath(topic.category_slug, topic.subject_slug);
    const firstIndex = (page - 1) * 20;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Find MCQs', item: `${SITE_URL}/find-mcq` },
                { '@type': 'ListItem', position: 2, name: topic.category_name, item: `${SITE_URL}/find-mcq/${topic.category_slug}` },
                { '@type': 'ListItem', position: 3, name: `${topic.subject_name} MCQs`, item: `${SITE_URL}${basePath}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Quiz',
            name: `${topic.subject_name} MCQs for ${topic.category_name}`,
            about: { '@type': 'Thing', name: topic.subject_name },
            hasPart: questions.map((q) => {
                const correct = q.options.find((o) => o.is_correct);
                return {
                    '@type': 'Question',
                    eduQuestionType: 'Multiple choice',
                    learningResourceType: 'Practice problem',
                    text: stripTags(q.question),
                    url: `${SITE_URL}/mcq/${q.slug}`,
                    ...(correct
                        ? {
                              acceptedAnswer: {
                                  '@type': 'Answer',
                                  text: stripTags(correct.option),
                                  ...(q.explanation ? { answerExplanation: { '@type': 'Comment', text: stripTags(q.explanation) } } : {}),
                              },
                          }
                        : {}),
                    suggestedAnswer: q.options.filter((o) => !o.is_correct).map((o) => ({ '@type': 'Answer', text: stripTags(o.option) })),
                };
            }),
        },
    ];

    return (
        <section className="min-h-screen bg-gray-50">
            {/* eslint-disable-next-line react/no-danger */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                <CategorySidebar categories={categories} activeSlug={topic.category_slug} />

                <div className="flex-1 min-w-0">
                    <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
                        <Link href="/find-mcq" className="hover:text-green-600 hover:underline">Find MCQs</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/find-mcq/${topic.category_slug}`} className="hover:text-green-600 hover:underline">
                            {topic.category_name}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">{topic.subject_name}</span>
                    </nav>

                    <header className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
                        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
                            {topic.subject_name} MCQs for {topic.category_name}
                            {page > 1 && <span className="text-gray-500 font-medium"> &ndash; Page {page}</span>}
                        </h1>
                        <p className="mt-3 text-gray-700 leading-relaxed">
                            {topic.question_count.toLocaleString()} {topic.subject_name} multiple-choice questions with answers and
                            explanations, from the ExamsNepal question bank for {topic.category_name}. Try each question first, then open
                            the answer to check your reasoning.
                        </p>
                        {topic.accuracy_pct !== null && (
                            <p className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                                <BarChart3 className="w-4 h-4 mt-0.5 text-green-700 shrink-0" aria-hidden="true" />
                                <span>
                                    In ExamsNepal mock tests, students answer <strong>{Math.round(topic.accuracy_pct)}%</strong> of{' '}
                                    {topic.subject_name} questions correctly ({topic.answers.toLocaleString()} answers).
                                </span>
                            </p>
                        )}
                        {guides.length > 0 && (
                            <p className="mt-3 text-sm text-gray-700">
                                Preparing for{' '}
                                {guides.map((g, i) => (
                                    <span key={g.url}>
                                        {i > 0 && (i === guides.length - 1 ? ' or ' : ', ')}
                                        <Link href={g.url} className="font-medium text-green-700 hover:underline">{g.name}</Link>
                                    </span>
                                ))}
                                ? See the exam pattern, syllabus and free mock tests.
                            </p>
                        )}
                    </header>

                    <ol className="flex flex-col gap-4" start={firstIndex + 1}>
                        {questions.map((q, i) => {
                            const correct = q.options.find((o) => o.is_correct);
                            return (
                                <li key={q.id} className="bg-white rounded-lg shadow-sm border border-border p-6 list-none">
                                    <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                                        {firstIndex + i + 1}. {q.question}
                                    </h2>
                                    <ul className="mt-4 flex flex-col gap-2" aria-label="Answer choices">
                                        {q.options.map((o, idx) => (
                                            <li key={idx} className="p-3 rounded-md border border-border bg-gray-50 text-gray-800">
                                                {String.fromCharCode(65 + idx)}. {o.option.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                    <details className="mt-4 group">
                                        <summary className="cursor-pointer select-none text-sm font-medium text-green-700 hover:text-green-800">
                                            Show answer &amp; explanation
                                        </summary>
                                        <div className="mt-3 rounded-md bg-green-50 border border-green-200 p-4">
                                            {correct && (
                                                <p className="font-medium text-green-800">
                                                    Answer: {String.fromCharCode(65 + q.options.indexOf(correct))}. {correct.option.trim()}
                                                </p>
                                            )}
                                            {q.explanation && (
                                                <div
                                                    className="mt-2 text-sm text-gray-700 leading-relaxed"
                                                    // eslint-disable-next-line react/no-danger
                                                    dangerouslySetInnerHTML={{ __html: q.explanation }}
                                                />
                                            )}
                                        </div>
                                    </details>
                                    <Link
                                        href={`/mcq/${q.slug}`}
                                        className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-green-700 hover:underline"
                                    >
                                        Discuss this question <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ol>

                    {lastPage > 1 && (
                        <nav className="mt-8 flex items-center justify-between gap-4 text-sm" aria-label="Pagination">
                            {page > 1 ? (
                                <Link
                                    href={mcqTopicPath(topic.category_slug, topic.subject_slug, page - 1)}
                                    className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-white hover:border-green-400"
                                >
                                    <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Previous
                                </Link>
                            ) : (
                                <span />
                            )}
                            <span className="text-gray-600">
                                Page {page} of {lastPage}
                            </span>
                            {page < lastPage ? (
                                <Link
                                    href={mcqTopicPath(topic.category_slug, topic.subject_slug, page + 1)}
                                    className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-white hover:border-green-400"
                                >
                                    Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                </Link>
                            ) : (
                                <span />
                            )}
                        </nav>
                    )}

                    {related.length > 0 && (
                        <div className="mt-10 bg-white rounded-lg shadow-sm border border-border p-6">
                            <h2 className="font-bold text-gray-900 mb-3">More subjects in {topic.category_name}</h2>
                            <div className="flex flex-wrap gap-2">
                                {related.map((r) => (
                                    <Link
                                        key={r.subject_slug}
                                        href={mcqTopicPath(topic.category_slug, r.subject_slug)}
                                        className="text-sm px-3 py-1.5 rounded-full border border-green-300 text-green-700 hover:bg-green-50"
                                    >
                                        {r.subject_name} ({r.question_count.toLocaleString()})
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
