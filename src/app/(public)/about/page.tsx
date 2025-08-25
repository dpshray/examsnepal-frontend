import {Metadata} from "next";
import AboutPage from "@/app/(public)/about/About";


export const metadata: Metadata = {
    title: 'About Us | Exam Nepal',
    description: 'Learn more about Exam Nepal, our mission, and our team.',
    openGraph: {
        title: 'About Us | Exam Nepal',
        description: 'Learn more about Exam Nepal, our mission, and our team.',
        url: 'https://examnepal.com/about',
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
        title: 'About Us | Exam Nepal',
        description: 'Learn more about Exam Nepal, our mission, and our team.',
        images: ['/about-us.png'],
    },
    metadataBase: new URL('https://examnepal.com'),
    alternates: {
        canonical: 'https://examnepal.com/about',
        languages: {
            'en-US': 'https://examnepal.com/en/about',
            'np-NP': 'https://examnepal.com/np/about',
        },
    },
};

export default function About() {
    return (
        <AboutPage/>
    );
}