import type { Metadata } from "next"
import blogService from "@/services/blogService"
import BlogDetailPage from "./BlogDetailPage"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params

    try {
        const blog = await blogService.getClientBlogBySlug(slug)

        if (!blog) {
            return {
                title: "Blog Not Found",
                description: "The blog post you are looking for does not exist.",
            }
        }

        // Strip HTML tags from content for description fallback
        const plainContent = blog.content
            ?.replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim()

        const description = blog.summary || plainContent?.slice(0, 160) || ""

        const categoryNames = blog.categories?.map((c: { title: string }) => c.title) ?? []
        const tagNames = blog.tag?.map((t: { title: string }) => t.title) ?? []

        return {
            title: blog.title,
            description,
            authors: [{ name: blog.author }],
            keywords: [...categoryNames, ...tagNames],

            openGraph: {
                title: blog.title,
                description,
                type: "article",
                publishedTime: blog.published_date,
                authors: [blog.author],
                tags: tagNames,
                images: blog.image
                    ? [
                          {
                              url: blog.image,
                              width: 1200,
                              height: 630,
                              alt: blog.title,
                          },
                      ]
                    : [],
            },

            twitter: {
                card: "summary_large_image",
                title: blog.title,
                description,
                images: blog.image ? [blog.image] : [],
            },

            alternates: {
                canonical: `/blog/${slug}`,
            },
        }
    } catch {
        return {
            title: "Blog Not Found",
            description: "The blog post you are looking for does not exist.",
        }
    }
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

async function BlogJsonLd({ slug }: { slug: string }) {
    try {
        const blog = await blogService.getClientBlogBySlug(slug)
        if (!blog) return null

        const plainContent = blog.content
            ?.replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim()

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.summary || plainContent?.slice(0, 160),
            image: blog.image || undefined,
            author: {
                "@type": "Person",
                name: blog.author,
            },
            datePublished: blog.published_date,
            dateModified: blog.published_date,
            keywords: [
                ...(blog.categories?.map((c: { title: string }) => c.title) ?? []),
                ...(blog.tag?.map((t: { title: string }) => t.title) ?? []),
            ].join(", "),
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `/blog/${slug}`,
            },
        }

        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        )
    } catch {
        return null
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params

    return (
        <>
            <BlogJsonLd slug={slug} />
            <BlogDetailPage />
        </>
    )
}