
import type { Metadata } from "next";
import BlogClient from "@/app/(public)/blog/Blogclient";

export const metadata: Metadata = {
    title: "Our Blog | Insights, Updates & Stories",
    description:
        "Explore our latest blog posts featuring news, insights, and stories from our team. Stay updated with industry trends and company updates.",
    keywords: [
        "blog",
        "company news",
        "industry insights",
        "tech updates",
        "team stories",
        "business blog",
        "latest articles"
    ],
    authors: [
        {
            name: "Your Company Name",
            url: "https://yourdomain.com",
        },
    ],
    creator: "Your Company Name",
    publisher: "Your Company Name",
    openGraph: {
        title: "Our Blog | Insights, Updates & Stories",
        description: "Read our blog for the latest news and insights.",
        url: "https://yourdomain.com/blog",
        siteName: "Your Site Name",
        type: "website",
        images: [
            {
                url: "https://yourdomain.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Open graph image showing blog and company branding",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Our Blog | Insights, Updates & Stories",
        description:
            "Explore our latest blog posts featuring news, insights, and stories from our team.",
        images: ["https://yourdomain.com/og-image.jpg"],
        creator: "@your_twitter_handle",
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
        },
    },
    metadataBase: new URL("https://yourdomain.com"),
    alternates: {
        canonical: "/blog",
    },
};

export default function Blog() {
    return <BlogClient />;
}
