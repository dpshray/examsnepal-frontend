import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

// Split out of the (client-only) page body into this Server Component
// wrapper so it can export metadata - "use client" pages can't export
// `metadata`, so this previously had none at all and fell back to the root
// layout's generic "Exams Nepal" title/description with no canonical.
export const metadata: Metadata = {
    title: "Privacy Policy | ExamsNepal",
    description:
        "How ExamsNepal collects, uses, and protects your personal information across our online exam-preparation platform.",
    alternates: {
        canonical: "/privacy-policy",
    },
};

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyClient />;
}
