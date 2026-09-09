import {Metadata} from "next";
import ContactClient from "@/app/(public)/contact-us/ContactClient";

// This metadata block was previously copy-pasted verbatim from the dev
// agency's own site (Dwork Labs) and never adapted: title/description read as
// agency marketing copy, and openGraph.url / og:image / metadataBase all
// pointed at dworklabs.com - meaning this page's canonical resolved to
// https://dworklabs.com/contact, a domain we don't own, instead of this site.
// metadataBase is inherited from the root layout (examsnepal.com).
export const metadata: Metadata = {
    title: "Contact Us | ExamsNepal",
    description:
        "Have questions or feedback about ExamsNepal? Reach out to our team - we're here to help with your mock tests, subscriptions, and exam prep queries.",
    openGraph: {
        title: "Contact Us | ExamsNepal",
        description:
            "Have questions or feedback about ExamsNepal? Reach out to our team - we're here to help with your mock tests, subscriptions, and exam prep queries.",
        url: "/contact-us",
        images: [
            {
                url: "/contact-us.png",
                width: 1200,
                height: 630,
                alt: "Contact Us",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | ExamsNepal",
        description: "Have questions or feedback about ExamsNepal? Reach out to our team.",
        images: ["/contact-us.png"],
    },
    alternates: {
        canonical: "/contact-us",
    },
};

export default function Contact() {
    return <ContactClient/>
}