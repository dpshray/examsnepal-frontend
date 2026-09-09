import type { Metadata } from "next";
import TermsClient from "./TermsClient";

// Split out of the (client-only) page body into this Server Component
// wrapper so it can export metadata - "use client" pages can't export
// `metadata`, so this previously had none at all and fell back to the root
// layout's generic "Exams Nepal" title/description with no canonical.
export const metadata: Metadata = {
    title: "Terms and Conditions | ExamsNepal",
    description:
        "The terms and conditions governing your access to and use of ExamsNepal's online exam-preparation platform and services.",
    alternates: {
        canonical: "/terms-and-conditions",
    },
};

export default function TermsAndConditionsPage() {
    return <TermsClient />;
}
