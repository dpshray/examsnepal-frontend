"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    totalPages: number
    currentPage?: number
    onPageChange?: (page: number) => void
    className?: string
}

export default function Pagination({
                                       totalPages,
                                       currentPage: propCurrentPage = 1,
                                       onPageChange,
                                       className,
                                   }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(propCurrentPage)

    useEffect(() => {
        setCurrentPage(propCurrentPage)
    }, [propCurrentPage])

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        setCurrentPage(page)
        onPageChange?.(page)
    }

    const generatePages = (): (number | string)[] => {
        const pages: (number | string)[] = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i)
                pages.push("...")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 3) {
                pages.push(1)
                pages.push("...")
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push("...")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push("...")
                pages.push(totalPages)
            }
        }

        return pages
    }
    if (totalPages <= 1) return null

    return (
        <nav
            className={cn("flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-3", className)}
            aria-label="Pagination"
        >
            <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="rounded-full px-4 sm:px-5 py-2 text-sm sm:text-base font-medium"
            >
                Previous
            </Button>

            {generatePages().map((page, index) =>
                    typeof page === "number" ? (
                        <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            variant={currentPage === page ? "outline" : "ghost"}
                            size="icon"
                            aria-current={currentPage === page ? "page" : undefined}
                            className={cn(
                                "h-10 w-10 sm:h-11 sm:w-11 text-sm font-medium rounded-full transition-colors",
                                currentPage === page &&
                                "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                            )}
                        >
                            {page}
                        </Button>
                    ) : (
                        <span
                            key={`ellipsis-${index}`}
                            className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-gray-400"
                            aria-hidden="true"
                        >
            ...
          </span>
                    )
            )}

            <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="rounded-full px-4 sm:px-5 py-2 text-sm sm:text-base font-medium"
            >
                Next
            </Button>
        </nav>
    )
}
