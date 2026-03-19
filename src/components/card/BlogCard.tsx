import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User } from "lucide-react"
import { format } from "date-fns"

interface Category {
    id: number
    title: string
    slug: string
}

interface Tag {
    id: number
    title: string
    slug: string
}

export interface BlogCardProps {
    title: string
    slug: string
    summary: string
    image: string
    author: string
    published_date: string
    categories: Category[]
    tag: Tag[]
}

export const BlogCard: FC<BlogCardProps> = ({
    title,
    slug,
    summary,
    image,
    author,
    published_date,
    categories,
    tag,
}) => {
    const formattedDate = format(new Date(published_date), "MMM d, yyyy")

    return (
        <Link href={`/blog/${slug}`} className="group block">
            <article
                className="w-full rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-md transition duration-300 ease-in-out focus-within:ring-2 focus-within:ring-teal-400"
                aria-label={`Read blog post: ${title}`}
            >
                {/* Image */}
                <div className="relative h-52 w-full bg-muted overflow-hidden">
                    <Image
                        src={image || "/blog-image.png"}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300 ease-in-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Category badges overlay */}
                    {categories.length > 0 && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {categories.slice(0, 2).map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-600/90 text-white backdrop-blur-sm"
                                >
                                    {cat.title}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-5 py-4 gap-3">
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
                        {title}
                    </h3>

                    {/* Summary */}
                    {summary && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {summary}
                        </p>
                    )}

                    {/* Tags */}
                    {tag.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tag.slice(0, 3).map((t) => (
                                <Badge
                                    key={t.id}
                                    variant="outline"
                                    className="text-[10px] px-2 py-0 rounded-full border-teal-300 text-teal-700"
                                >
                                    #{t.title}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Footer: Author + Date */}
                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
                        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <User className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span className="truncate max-w-[120px]">{author}</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            {formattedDate}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export function BlogCardSkeleton() {
    return (
        <div className="w-full rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col">
            {/* Image skeleton */}
            <Skeleton className="w-full h-52 rounded-none" />

            <div className="flex flex-col flex-1 px-5 py-4 gap-3">
                {/* Title */}
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-5 w-1/2 rounded" />

                {/* Summary */}
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />

                {/* Tags */}
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-14 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-3.5 w-20 rounded" />
                </div>
            </div>
        </div>
    )
}