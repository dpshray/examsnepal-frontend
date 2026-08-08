import Link from 'next/link';
import {cn} from '@/lib/utils';
import type {ExamCategory} from '@/lib/mcqApi';

interface CategorySidebarProps {
    categories: ExamCategory[];
    activeSlug?: string | null;
    getHref?: (category: ExamCategory) => string;
}

export function CategorySidebar({categories, activeSlug = null, getHref}: CategorySidebarProps) {
    return (
        <aside className="w-full md:w-72 shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
            <h2 className="text-lg font-bold font-montserrat text-gray-900 mb-4">Exam Categories</h2>
            <nav className="flex flex-col gap-1" aria-label="Exam categories">
                {categories.map((category) => {
                    const isActive = category.slug === activeSlug;

                    return (
                        <Link
                            key={category.id}
                            href={getHref ? getHref(category) : `/find-mcq/${category.slug}`}
                            className={cn(
                                'block text-left px-3 py-2.5 rounded-md text-sm transition-colors',
                                isActive
                                    ? 'bg-green-600 text-white font-medium'
                                    : 'bg-white text-gray-700 hover:bg-green-50 border border-border'
                            )}
                        >
                            <div>{category.name}</div>
                            <div className={cn('text-xs mt-0.5', isActive ? 'text-green-50' : 'text-muted-foreground')}>
                                {category.question_count.toLocaleString()} Questions
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
