import { Skeleton } from "@/components/ui/skeleton"

export default function InstructionsSkeleton() {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
        {/* Header Skeleton */}
        <header className="border-b bg-white shadow-sm">
            <div className="container mx-auto max-w-7xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-72" />
                </div>
            </div>
            <Skeleton className="h-8 w-40 rounded-full" />
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">

            {/* Info Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border shadow-sm space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                ))}
            </div>

            {/* Instructions Skeleton */}
            <div className="bg-white rounded-lg p-5 border shadow-sm space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-10/12" />
            </div>

            {/* Sections Skeleton */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-5 border-b">
                <Skeleton className="h-4 w-48" />
                </div>

                {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-5 border-b last:border-b-0">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-96" />
                    </div>
                </div>
                ))}
            </div>
            </div>
        </main>

        {/* Footer Skeleton */}
        <footer className="border-t shadow-lg">
            <div className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-36 rounded-md" />
            </div>
        </footer>
        </div>
    )
}
