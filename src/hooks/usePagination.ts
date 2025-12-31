import { useMemo } from "react"

interface UsePaginationProps {
    currentPage: number
    totalPages: number
    paginationItemsToDisplay?: number
}

interface UsePaginationReturn {
    pages: number[]
    showLeftEllipsis: boolean
    showRightEllipsis: boolean
}

export function usePagination({
                                  currentPage,
                                  totalPages,
                                  paginationItemsToDisplay = 5
                              }: UsePaginationProps): UsePaginationReturn {
    return useMemo(() => {
        if (totalPages <= paginationItemsToDisplay) {
            return {
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
                showLeftEllipsis: false,
                showRightEllipsis: false
            }
        }

        const halfDisplay = Math.floor(paginationItemsToDisplay / 2)
        let startPage = Math.max(1, currentPage - halfDisplay)
        let endPage = Math.min(totalPages, currentPage + halfDisplay)

        if (currentPage <= halfDisplay) {
            endPage = paginationItemsToDisplay
        }

        if (currentPage >= totalPages - halfDisplay) {
            startPage = totalPages - paginationItemsToDisplay + 1
        }

        const pages = Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        )

        const showLeftEllipsis = startPage > 1
        const showRightEllipsis = endPage < totalPages

        return {
            pages,
            showLeftEllipsis,
            showRightEllipsis
        }
    }, [currentPage, totalPages, paginationItemsToDisplay])
}