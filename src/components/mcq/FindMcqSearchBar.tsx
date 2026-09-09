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
            // McqBrowseLayout (this component's only caller) always renders its
            // own, more specific <h1> (category name / search results) right
            // below this banner - without this, every /find-mcq/* page shipped
            // two H1s.
            titleAs="p"
        />
    );
}
