import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getExamGuideCategories } from "@/lib/examGuideApi";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.examsnepal.com").replace(/\/+$/, "");

export const metadata: Metadata = {
    title: "ExamsNepal - Free Online Mock Tests for Loksewa, IOE, CEE & 30,000+ Questions",
    description:
        "Practice for Loksewa, IOE entrance, CEE MBBS/BDS, Nursing & more with free mock tests, past questions, and real-time ranking. Start your free test now.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "ExamsNepal - Free Online Mock Tests for Loksewa, IOE, CEE & 30,000+ Questions",
        description:
            "Practice for Loksewa, IOE entrance, CEE MBBS/BDS, Nursing & more with free mock tests, past questions, and real-time ranking.",
        url: SITE_URL,
        type: "website",
    },
};

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Exams Nepal",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        sameAs: [
            process.env.NEXT_PUBLIC_FACEBOOK_LINK,
            process.env.NEXT_PUBLIC_INSTAGRAM_LINK,
            process.env.NEXT_PUBLIC_LINKEDIN_LINK,
        ].filter(Boolean),
    },
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Exams Nepal",
        url: SITE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/find-mcq?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    },
];

export default async function Home() {
    // Powers the real (crawlable, server-rendered) hub-category links section
    // on the homepage - previously the only path to /exams/{category} was the
    // nav mega menu, which doesn't render into the initial HTML (see
    // HomeClient.tsx for why that matters).
    const examCategories = await getExamGuideCategories();

    return (
        <>
            {/* eslint-disable-next-line react/no-danger */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient examCategories={examCategories} />
        </>
    );
}
