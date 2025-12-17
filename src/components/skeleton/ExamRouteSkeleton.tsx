"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ExamRouteSkeleton() {
    return (
        <div className="min-h-screen p-8 space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/3" />

            <div className="space-y-4 mt-10">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>

            <Skeleton className="h-14 w-48 mt-8 rounded-xl" />
        </div>
    );
}
