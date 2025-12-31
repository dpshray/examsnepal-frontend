"use client"

import {Skeleton} from "@/components/ui/skeleton"
import {cn} from "@/lib/utils"

export interface ExamQuestionCardSkeletonProps {
    variant?: "default" | "compact"
    className?: string
}

export default function ExamQuestionCardSkeleton({
                                                     variant = "default",
                                                     className
                                                 }: ExamQuestionCardSkeletonProps) {
    const isCompact = variant === "compact"

    return (
        <article
            className={cn(
                "w-full bg-card rounded-lg border border-gray-200 shadow-sm",
                isCompact ? "p-2" : "p-3",
                className
            )}
        >
            <div className={cn("flex items-start gap-2", isCompact ? "mb-1.5" : "mb-2")}>
                <Skeleton
                    className={cn(
                        "shrink-0 rounded-lg",
                        isCompact ? "w-6 h-6" : "w-7 h-7"
                    )}
                />
                <Skeleton
                    className={cn(
                        "flex-1 rounded",
                        isCompact ? "h-4" : "h-5"
                    )}
                />
            </div>

            <div className={cn("space-y-1.5", isCompact ? "mt-1.5" : "mt-2")}>
                {[1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-start gap-2 rounded-lg border-2 border-gray-200",
                            isCompact ? "p-1.5" : "p-2"
                        )}
                    >
                        <Skeleton
                            className={cn(
                                "shrink-0 rounded-full mt-0.5",
                                isCompact ? "w-3 h-3" : "w-4 h-4"
                            )}
                        />
                        <Skeleton
                            className={cn(
                                "flex-1 rounded",
                                isCompact ? "h-3" : "h-4"
                            )}
                        />
                    </div>
                ))}
            </div>
        </article>
    )
}