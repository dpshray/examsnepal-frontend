"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ExamGuideCategoryDetail, ExamGuideType } from "@/lib/examGuideApi";

const TYPE_LABELS: Record<ExamGuideType, string> = {
    license: "License",
    loksewa: "Loksewa",
    entrance: "Entrance",
    job: "Job",
};

const TYPE_BADGE_CLASSES: Record<ExamGuideType, string> = {
    license: "bg-blue-50 text-blue-700 border-blue-200",
    loksewa: "bg-green-50 text-green-700 border-green-200",
    entrance: "bg-purple-50 text-purple-700 border-purple-200",
    job: "bg-amber-50 text-amber-700 border-amber-200",
};

type SortOption = "name-asc" | "name-desc" | "most-guides";

interface ExamsDirectoryClientProps {
    categories: ExamGuideCategoryDetail[];
}

export function ExamsDirectoryClient({ categories }: ExamsDirectoryClientProps) {
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [sort, setSort] = useState<SortOption>("name-asc");

    const filtered = useMemo(() => {
        let result = categories
            .filter((category) => categoryFilter === "all" || category.slug === categoryFilter)
            .map((category) => ({
                ...category,
                guides:
                    typeFilter === "all"
                        ? category.guides
                        : category.guides.filter((guide) => guide.type === typeFilter),
            }))
            .filter((category) => category.guides.length > 0);

        if (sort === "most-guides") {
            result = [...result].sort((a, b) => b.guides.length - a.guides.length);
        }
        // "name-asc"/"name-desc" sorts guides within each category (category
        // order itself stays the fixed Medical -> ... -> Others sequence).
        result = result.map((category) => ({
            ...category,
            guides: [...category.guides].sort((a, b) =>
                sort === "name-desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name),
            ),
        }));

        return result;
    }, [categories, categoryFilter, typeFilter, sort]);

    return (
        <>
            <div className="sticky top-[64px] md:top-[72px] z-30 bg-white/95 backdrop-blur border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[160px]" aria-label="Filter by category">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.slug}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[140px]" aria-label="Filter by type">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="license">License</SelectItem>
                            <SelectItem value="loksewa">Loksewa</SelectItem>
                            <SelectItem value="entrance">Entrance</SelectItem>
                            <SelectItem value="job">Job</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                        <SelectTrigger className="w-[160px]" aria-label="Sort exams">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            <SelectItem value="most-guides">Category: most exams first</SelectItem>
                        </SelectContent>
                    </Select>

                    <span className="ml-auto text-sm text-muted-foreground">
                        {filtered.reduce((sum, c) => sum + c.guides.length, 0)} exam
                        {filtered.reduce((sum, c) => sum + c.guides.length, 0) === 1 ? "" : "s"}
                    </span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {filtered.length === 0 ? (
                    <p className="text-muted-foreground text-center">No exams match these filters.</p>
                ) : (
                    <div className="flex flex-col gap-14">
                        {filtered.map((category) => (
                            <div key={category.id} id={category.slug} className="scroll-mt-32">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-xl font-bold font-montserrat text-gray-900">
                                            {category.name}
                                        </h2>
                                        {category.description && (
                                            <p className="text-sm text-muted-foreground">{category.description}</p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/exams/${category.slug}`}
                                        className="shrink-0 text-sm font-medium text-green-700 hover:text-green-800 hover:underline whitespace-nowrap"
                                    >
                                        View category &rarr;
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.guides.map((guide) => (
                                        <Link
                                            key={guide.id}
                                            href={`/exams/${category.slug}/${guide.slug}`}
                                            className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-border shadow-sm hover:shadow-md hover:border-green-300 transition"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                                        {guide.name}
                                                    </h3>
                                                    <span
                                                        className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASSES[guide.type]}`}
                                                    >
                                                        {TYPE_LABELS[guide.type]}
                                                    </span>
                                                </div>
                                                {guide.meta_description && (
                                                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                                                        {guide.meta_description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 mt-4">
                                                View guide
                                                <ArrowRight
                                                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
