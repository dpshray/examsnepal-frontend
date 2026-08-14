import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getExamGuideCategories, getExamGuideCategory, type ExamGuideCategoryDetail } from "@/lib/examGuideApi";

// Ties the format pages back into the existing /exams directory content —
// same data source as the /exams hub page (src/lib/examGuideApi.ts).
export default async function AvailableExams() {
    const summaries = await getExamGuideCategories();

    const categories: ExamGuideCategoryDetail[] = [];
    for (const summary of summaries) {
        const detail = await getExamGuideCategory(summary.slug);
        if (detail) categories.push(detail);
    }

    if (categories.length === 0) return null;

    return (
        <section className="bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-montserrat text-gray-900">Available for these exams</h2>
                    <Link href="/exams" className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline whitespace-nowrap">
                        View all exams &rarr;
                    </Link>
                </div>
                <div className="flex flex-col gap-8">
                    {categories.map((category) => (
                        <div key={category.id}>
                            <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {category.guides.map((guide) => (
                                    <Link
                                        key={guide.id}
                                        href={`/exams/${category.slug}/${guide.slug}`}
                                        className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm text-green-800 hover:bg-green-50 hover:border-green-300 transition"
                                    >
                                        {guide.name}
                                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
