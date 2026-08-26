'use client'

import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { GraduationCap, MapPin, Star, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export interface InstituteCardProps {
    slug: string
    username: string
    fullname: string
    org: string | null
    logo: string | null
    location: string | null
    students_count: number
    average_rating: number | null
}

export const InstituteCard: FC<InstituteCardProps> = ({
    username,
    fullname,
    org,
    logo,
    location,
    students_count,
    average_rating,
}) => {
    const displayName = org || fullname

    return (
        <Link
            href={`/institute/${username}`}
            className="group block h-full"
            aria-label={`View ${displayName}'s profile`}
        >
            <article className="w-full h-full rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition duration-300 ease-in-out focus-within:ring-2 focus-within:ring-green-400">
                <div className="flex items-center gap-4 px-5 pt-6 pb-3">
                    {logo ? (
                        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-green-100 shrink-0">
                            <Image src={logo} alt={displayName} fill className="object-cover" sizes="56px" />
                        </div>
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white text-xl font-bold shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                            {displayName}
                        </h3>
                        {location && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 shrink-0" /> {location}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between px-5 py-3 mt-auto border-t border-gray-100 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5 font-medium">
                        <Users className="h-3.5 w-3.5 text-green-600 shrink-0" />
                        {students_count} {students_count === 1 ? "student" : "students"}
                    </span>
                    {average_rating != null ? (
                        <span className="flex items-center gap-1 font-medium text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                            {average_rating.toFixed(1)}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <GraduationCap className="h-3.5 w-3.5 shrink-0" /> New
                        </span>
                    )}
                </div>
            </article>
        </Link>
    )
}

export function InstituteCardSkeleton() {
    return (
        <div className="w-full rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-4 px-5 pt-6 pb-3">
                <Skeleton className="h-14 w-14 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 mt-auto border-t border-gray-100">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-10 rounded" />
            </div>
        </div>
    )
}
