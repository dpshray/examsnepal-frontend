
import type { Metadata } from "next";
import BlogClient, { type BlogItem } from "@/app/(public)/blog/Blogclient";
import { publicDataFetchOptions } from "@/lib/publicDataCache";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

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

async function getFirstPage(): Promise<{ items: BlogItem[]; total_page: number } | null> {
    try {
        const res = await fetch(`${API_URL}/user/blogs?page=1`, publicDataFetchOptions);
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data?.items ? { items: json.data.items, total_page: json.data.total_page ?? 1 } : null;
    } catch {
        return null;
    }
}

export default async function Blog() {
    return <BlogClient initialPage={await getFirstPage()} />;
}
