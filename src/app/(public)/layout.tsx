import Footer from "@/components/common/Footer";
import NavBar from "@/components/header/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import { getExamGuideCategories, getExamGuideCategory, type ExamGuideCategoryDetail } from "@/lib/examGuideApi";

// Order/labels for the "Exams in Nepal" mega menu — matches the nav/footer spec's
// Lok Sewa / License / Entrance buckets to the existing exam_categories slugs.
const MEGA_MENU_SLUGS = ["loksewa", "nec-license", "entrance"] as const;

async function getMegaMenuCategories(): Promise<ExamGuideCategoryDetail[]> {
    const summaries = await getExamGuideCategories();
    const bySlug = new Map(summaries.map((s) => [s.slug, s]));

    // Fetched sequentially (see /exams hub page for why): concurrent fetches to
    // these structurally-similar URLs can hit a dev-mode fetch cache collision.
    const categories: ExamGuideCategoryDetail[] = [];
    for (const slug of MEGA_MENU_SLUGS) {
        if (!bySlug.has(slug)) continue;
        const detail = await getExamGuideCategory(slug);
        if (detail) categories.push(detail);
    }
    return categories;
}

export default async function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    const examCategories = await getMegaMenuCategories();

    return (
        // <ProtectedRoute>

            <div className="flex flex-col overflow-x-clip min-h-screen">
                <NavBar examCategories={examCategories}/>
                <main className="flex flex-grow flex-col">
                    {children}
                </main>
                <Footer/>
            </div>
        // </ProtectedRoute>
    );
}
