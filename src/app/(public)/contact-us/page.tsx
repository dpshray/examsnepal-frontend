import ContactPage from "@/app/(public)/contact-us/ ContactClient";


export const metadata = {
    title: 'Contact Us | Dwork Labs',
    description:
        "Have questions or feedback? Contact Dwork Labs today. We're here to help you grow your business with smart digital solutions.",
    openGraph: {
        title: 'Contact Us | Dwork Labs',
        description:
            "We're here to help you with your queries. Reach out to Dwork Labs anytime.",
        url: 'https://dworklabs.com/contact',
        images: [
            {
                url: 'https://dworklabs.com/contact-us.png',
                width: 1200,
                height: 630,
                alt: 'Contact Us',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | Dwork Labs',
        description:
            'Connect with Dwork Labs to grow your digital presence.',
        images: ['https://dworklabs.com/contact-us.png'],
    },
    metadataBase: new URL('https://dworklabs.com'),
    alternates: {
        canonical: '/contact',
    },
};

export default function Contact() {
    return <ContactPage/>;
}
