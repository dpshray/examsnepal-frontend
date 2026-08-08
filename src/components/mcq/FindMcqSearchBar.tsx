'use client';

import {useRouter} from 'next/navigation';
import BannerHeader from '@/components/banner/header';

interface FindMcqSearchBarProps {
    basePath?: string;
}

export function FindMcqSearchBar({basePath = '/find-mcq'}: FindMcqSearchBarProps) {
    const router = useRouter();

    const handleSearch = (query: string) => {
        if (!query.trim()) return;
        router.push(`${basePath}?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <BannerHeader
            title="Find Your MCQ"
            subtitle="Explore a wide range of MCQs"
            imageSrc="/banner.png"
            onSearchAction={handleSearch}
        />
    );
}
