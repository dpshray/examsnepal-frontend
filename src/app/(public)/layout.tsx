import Footer from "@/components/common/Footer";
import NavBar from "@/components/header/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import { getExamGuideCategories, getExamGuideCategory, type ExamGuideCategoryDetail } from "@/lib/examGuideApi";

// All 7 exam-guide categories (Medical/Paramedical/Engineering/Management/
// Agriculture/Law/Others) power the mega menu, in the backend's display_order.
// Previously filtered through a hardcoded 3-slug allowlist left over from the
// old loksewa/nec-license/entrance taxonomy - since none of those slugs exist
// any more post-migration, that filter silently emptied the whole menu.
async function getMegaMenuCategories(): Promise<ExamGuideCategoryDetail[]> {
    const summaries = await getExamGuideCategories();

    // Fetched sequentially (see /exams hub page for why): concurrent fetches to
    // these structurally-similar URLs can hit a dev-mode fetch cache collision.
    const categories: ExamGuideCategoryDetail[] = [];
    for (const summary of summaries) {
        const detail = await getExamGuideCategory(summary.slug);
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
