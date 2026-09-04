import {Metadata} from "next";
import AboutPage from "@/app/(public)/about/About";


export const metadata: Metadata = {
    title: 'About Us | ExamsNepal',
    description:
        'ExamsNepal is Nepal’s online exam-preparation platform for Loksewa, NEC license, and entrance exams — learn about our mission and team.',
    openGraph: {
        title: 'About Us | ExamsNepal',
        description:
            'ExamsNepal is Nepal’s online exam-preparation platform for Loksewa, NEC license, and entrance exams — learn about our mission and team.',
        url: '/about',
        images: [
            {
                url: '/about-us.png',
                width: 800,
                height: 600,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | ExamsNepal',
        description:
            'ExamsNepal is Nepal’s online exam-preparation platform for Loksewa, NEC license, and entrance exams.',
        images: ['/about-us.png'],
    },
    // metadataBase is inherited from the root layout (examsnepal.com). This page
    // previously hardcoded its own https://examnepal.com (missing the "s") across
    // metadataBase/canonical/OG/hreflang, pointing Google at a domain we don't own.
    // The hreflang `languages` entries below also targeted /en/about and /np/about,
    // neither of which exists (this site has no locale routing) - both 404'd, so
    // they've been dropped rather than fixed forward to fake working URLs.
    alternates: {
        canonical: '/about',
    },
};

export default function About() {
    return (
        <AboutPage/>
    );
}