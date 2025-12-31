"use client";

import {
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { memo, useCallback } from "react";
import { usePagination } from "@/hooks/usePagination";

interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChangeAction: (page: number) => void;
    maxPagesToShow?: number;
    className?: string;
}

const CustomPagination = memo(function CustomPagination({
                                                            currentPage,
                                                            totalPages,
                                                            onPageChangeAction,
                                                            maxPagesToShow = 5,
                                                            className = "",
                                                        }: CustomPaginationProps) {
    const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
        currentPage,
        paginationItemsToDisplay: maxPagesToShow,
        totalPages,
    });

    const handlePageClick = useCallback(
        (page: number) => {
            if (page !== currentPage && page >= 1 && page <= totalPages) {
                onPageChangeAction(page);
            }
        },
        [currentPage, totalPages, onPageChangeAction]
    );

    if (totalPages <= 1) {
        return null;
    }

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <Pagination className={className}>
            <PaginationContent className="flex-wrap gap-2">
                <PaginationItem>
                    <PaginationLink
                        aria-disabled={isFirstPage}
                        aria-label="Go to first page"
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-40 hover:bg-green-50 hover:border-green-500 aria-disabled:hover:bg-transparent aria-disabled:hover:border-gray-300 h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg transition-all duration-200"
                        onClick={() => handlePageClick(1)}
                        tabIndex={isFirstPage ? -1 : 0}
                    >
                        <ChevronFirstIcon aria-hidden="true" className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        aria-disabled={isFirstPage}
                        aria-label="Go to previous page"
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-40 hover:bg-green-50 hover:border-green-500 aria-disabled:hover:bg-transparent aria-disabled:hover:border-gray-300 h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg transition-all duration-200"
                        onClick={() => handlePageClick(currentPage - 1)}
                        tabIndex={isFirstPage ? -1 : 0}
                    >
                        <ChevronLeftIcon aria-hidden="true" className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>

                {showLeftEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis className="h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg flex items-center justify-center" />
                    </PaginationItem>
                )}

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageClick(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                            className="h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 data-[active=true]:bg-green-500 data-[active=true]:text-white data-[active=true]:border-green-500 data-[active=true]:hover:bg-green-600 transition-all duration-200 font-medium"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {showRightEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis className="h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg flex items-center justify-center" />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationLink
                        aria-disabled={isLastPage}
                        aria-label="Go to next page"
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-40 hover:bg-green-50 hover:border-green-500 aria-disabled:hover:bg-transparent aria-disabled:hover:border-gray-300 h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg transition-all duration-200"
                        onClick={() => handlePageClick(currentPage + 1)}
                        tabIndex={isLastPage ? -1 : 0}
                    >
                        <ChevronRightIcon aria-hidden="true" className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        aria-disabled={isLastPage}
                        aria-label="Go to last page"
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-40 hover:bg-green-50 hover:border-green-500 aria-disabled:hover:bg-transparent aria-disabled:hover:border-gray-300 h-9 w-9 sm:h-10 sm:w-10 border border-gray-300 rounded-lg transition-all duration-200"
                        onClick={() => handlePageClick(totalPages)}
                        tabIndex={isLastPage ? -1 : 0}
                    >
                        <ChevronLastIcon aria-hidden="true" className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
});

export default CustomPagination;