
import type { Metadata } from "next";
import BlogClient from "@/app/(public)/blog/Blogclient";

// metadataBase is inherited from the root layout (examsnepal.com). This page
// previously shipped template placeholders (yourdomain.com canonical/OG,
// "Your Company Name") that pointed Google's canonical at a domain we don't own.
export const metadata: Metadata = {
    title: "Exam Guidebook - Loksewa, Entrance & License Exam Tips | ExamsNepal",
    description:
        "Exam notices, preparation strategies and study guides for Loksewa, IOE, CEE, Nursing and license exams in Nepal, from the ExamsNepal team.",
    openGraph: {
        title: "Exam Guidebook | ExamsNepal",
        description:
            "Exam notices, preparation strategies and study guides for Loksewa, entrance and license exams in Nepal.",
        url: "/blog",
        siteName: "ExamsNepal",
        type: "website",
    },
    alternates: {
        canonical: "/blog",
    },
};

export default function Blog() {
    return <BlogClient />;
}
