'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import CustomPagination from '@/components/Pagination';

interface CategoryPagerProps {
    basePath: string;
    currentPage: number;
    totalPages: number;
}

export function CategoryPager({basePath, currentPage, totalPages}: CategoryPagerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page > 1) {
            params.set('page', String(page));
        } else {
            params.delete('page');
        }
        const query = params.toString();
        router.push(query ? `${basePath}?${query}` : basePath, {scroll: true});
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center mt-8">
            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChangeAction={handlePageChange}
                maxPagesToShow={5}
            />
        </div>
    );
}
