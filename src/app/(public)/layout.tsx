import Footer from "@/components/common/Footer";
import NavBar from "@/components/header/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import { getExamGuideMenu } from "@/lib/examGuideApi";

// All exam-guide categories with their guides power the mega menu, in the
// backend's display_order - one cached request (free/exam-guides/menu)
// instead of 1 + N uncached ones on every page view.
export default async function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    const examCategories = await getExamGuideMenu();

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
