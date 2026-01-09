import { Skeleton } from "@/components/ui/skeleton"

export function ExamLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-12 w-32" />
            </div>
            </div>
        </header>

        <div className="container mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Questions Skeleton */}
            <div className="space-y-6">
                {[1, 2].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    {/* Question Header */}
                    <div className="border-b bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-16 w-24 rounded-lg" />
                    </div>
                    </div>

                    {/* Question Body */}
                    <div className="p-6 space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-14 w-full rounded-lg" />
                    ))}
                    </div>
                </div>
                ))}

                {/* Pagination Skeleton */}
                <div className="p-4 flex justify-between items-center">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-28" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex justify-end gap-3">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
                </div>
            </div>

            {/* Question Navigation Skeleton */}
            <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4">
                    <Skeleton className="h-6 w-40" />
                </div>
                <div className="p-4 space-y-6">
                    <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 30 }, (_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-md" />
                    ))}
                    </div>

                    <div className="pt-4 border-t space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-12" />
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}