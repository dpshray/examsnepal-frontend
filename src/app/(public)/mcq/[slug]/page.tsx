import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentSection, type QuestionComment } from "@/components/mcq/CommentSection";
import { CategorySidebar } from "@/components/mcq/CategorySidebar";
import { getExamCategories } from "@/lib/mcqApi";

interface McqOption {
    id: number;
    option: string;
    is_correct: boolean;
    image_url: string | null;
}

interface McqDetail {
    id: number;
    slug: string;
    question: string;
    explanation: string;
    image_url: string | null;
    explanation_image_url: string | null;
    view_count: number;
    options: McqOption[];
    comments: QuestionComment[];
}

// On-demand ISR: pages are generated the first time they're requested, then
// cached and revalidated in the background. With ~194k questions, pre-building
// all of them at deploy time isn't practical.
export const revalidate = 3600;

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

async function getMcq(slug: string): Promise<McqDetail | null> {
    const res = await fetch(`${API_URL}/free/mcq/${slug}`, {
        next: { revalidate },
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`Failed to load MCQ (status ${res.status})`);
    }

    const json = await res.json();
    return json.data as McqDetail;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const mcq = await getMcq(slug);

    if (!mcq) {
        return { title: "MCQ Not Found | Exams Nepal" };
    }

    const correct = mcq.options.find((o) => o.is_correct)?.option;
    const description = correct
        ? `${mcq.question} Answer: ${correct}. ${mcq.explanation}`.slice(0, 160)
        : mcq.question.slice(0, 160);

    return {
        title: `${mcq.question.slice(0, 65)} | Exams Nepal MCQ`,
        description,
        alternates: {
            canonical: `/mcq/${mcq.slug}`,
        },
        openGraph: {
            title: mcq.question,
            description,
            type: "article",
        },
    };
}

export default async function McqDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const [mcq, categories] = await Promise.all([getMcq(slug), getExamCategories()]);

    if (!mcq) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "QAPage",
        mainEntity: {
            "@type": "Question",
            name: mcq.question,
            text: mcq.question,
            answerCount: 1,
            acceptedAnswer: {
                "@type": "Answer",
                text:
                    mcq.options.find((o) => o.is_correct)?.option +
                    (mcq.explanation ? `. ${mcq.explanation.replace(/<[^>]*>/g, "")}` : ""),
            },
        },
    };

    return (
        <section className="min-h-screen bg-gray-50">
            {/* eslint-disable-next-line react/no-danger */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
                <CategorySidebar categories={categories} activeSlug={null} />

                <div className="flex-1 min-w-0 max-w-3xl">
                <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
                    <Link href="/find-mcq" className="hover:text-green-600 hover:underline">
                        Find MCQs
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700">Question</span>
                </nav>

                <article className="bg-white rounded-lg shadow-sm border border-border p-6 sm:p-8">
                    <header className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug">
                            {mcq.question}
                        </h1>

                        <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" aria-hidden="true" />
                            <span>{mcq.view_count.toLocaleString()} views</span>
                        </div>
                    </header>

                    <ul className="flex flex-col gap-3" aria-label="Answer choices">
                        {mcq.options.map((option) => (
                            <li
                                key={option.id}
                                className={`flex items-center gap-2 p-3 rounded-md border text-base font-poppins ${
                                    option.is_correct
                                        ? "bg-green-50 border-green-500 text-green-800 font-medium"
                                        : "bg-gray-50 border-border text-gray-800"
                                }`}
                            >
                                {option.is_correct ? (
                                    <CheckCircle2
                                        className="w-5 h-5 text-green-600 shrink-0"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <span className="w-5 h-5 shrink-0" aria-hidden="true" />
                                )}
                                <span>
                                    {option.option}
                                    {option.is_correct && (
                                        <span className="sr-only"> (Correct Answer)</span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {mcq.explanation && (
                        <div className="mt-6 pt-6 border-t border-border">
                            <h2 className="font-bold text-gray-900 mb-2">Explanation</h2>
                            <p
                                className="text-base text-muted-foreground font-poppins leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: mcq.explanation }}
                            />
                        </div>
                    )}
                </article>

                <CommentSection slug={mcq.slug} initialComments={mcq.comments} />

                <div className="mt-8 text-center bg-white rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Want to practice more?
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Explore thousands of MCQs across every exam category on Exams Nepal.
                    </p>
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                        <Link href="/find-mcq">Find More MCQs</Link>
                    </Button>
                </div>
                </div>
            </div>
        </section>
    );
}
