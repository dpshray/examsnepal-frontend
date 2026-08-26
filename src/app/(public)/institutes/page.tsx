import type { Metadata } from "next";
import InstitutesClient from "@/app/(public)/institutes/InstitutesClient";

export const metadata: Metadata = {
    title: "Institutes | ExamsNepal",
    description:
        "Browse institutes and coaching centers on ExamsNepal offering classes, study notes, and exams for students.",
    keywords: ["institutes", "coaching centers", "classes", "exams nepal", "exam preparation"],
    openGraph: {
        title: "Institutes | ExamsNepal",
        description: "Browse institutes and coaching centers on ExamsNepal.",
        url: "https://www.examsnepal.com/institutes",
        siteName: "ExamsNepal",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/institutes",
    },
};

export default function Institutes() {
    return <InstitutesClient />;
}
