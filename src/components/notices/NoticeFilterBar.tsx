'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import type { NoticeMeta } from '@/lib/noticeApi';
import { PROVINCE_LABELS, TYPE_LABELS } from '@/lib/noticeFormat';

const selectClass =
    'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30';

export default function NoticeFilterBar({ meta, category }: { meta: NoticeMeta | null; category?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [q, setQ] = useState(params.get('q') ?? '');

    const update = (key: string, value: string) => {
        const next = new URLSearchParams(params.toString());
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete('page');
        startTransition(() => router.push(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
    };

    const organizations = category
        ? meta?.organizations?.[category as keyof NoticeMeta['organizations']] ?? []
        : Object.values(meta?.organizations ?? {}).flat();
    const hasFilters = ['q', 'type', 'province', 'org', 'closing'].some((k) => params.get(k));
    // Only offer filters that can match something (e.g. no deadline filter
    // until notices have deadlines); keep a filter visible while it is active.
    const types = meta?.types ?? [];
    const provinces = meta?.provinces ?? [];
    const showType = types.length > 0 || !!params.get('type');
    const showProvince = provinces.length > 0 || !!params.get('province');
    const showClosing = !!meta?.has_deadlines || !!params.get('closing');

    return (
        <form
            role="search"
            aria-label="Filter notices"
            className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap ${pending ? 'opacity-70' : ''}`}
            onSubmit={(e) => {
                e.preventDefault();
                update('q', q.trim());
            }}
        >
            <label className="relative sm:min-w-[240px] sm:flex-[2]">
                <span className="sr-only">Search notices</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search title or organization (नेपाली / English)"
                    className={`${selectClass} pl-9`}
                />
            </label>
            {showType && (
                <label className="sm:flex-1">
                    <span className="sr-only">Notice type</span>
                    <select className={selectClass} value={params.get('type') ?? ''} onChange={(e) => update('type', e.target.value)}>
                        <option value="">All types</option>
                        {types.map((t) => (
                            <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>
                        ))}
                    </select>
                </label>
            )}
            {showProvince && (
                <label className="sm:flex-1">
                    <span className="sr-only">Province</span>
                    <select className={selectClass} value={params.get('province') ?? ''} onChange={(e) => update('province', e.target.value)}>
                        <option value="">All provinces</option>
                        {provinces.map((slug) => (
                            <option key={slug} value={slug}>{PROVINCE_LABELS[slug] ?? slug}</option>
                        ))}
                    </select>
                </label>
            )}
            <label className="sm:flex-[1.4]">
                <span className="sr-only">Organization</span>
                <select className={selectClass} value={params.get('org') ?? ''} onChange={(e) => update('org', e.target.value)}>
                    <option value="">All organizations</option>
                    {[...new Set(organizations)].sort().map((o) => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>
            </label>
            {showClosing && (
                <label className="sm:flex-1">
                    <span className="sr-only">Deadline</span>
                    <select className={selectClass} value={params.get('closing') ?? ''} onChange={(e) => update('closing', e.target.value)}>
                        <option value="">Any deadline</option>
                        <option value="3d">Closing in 3 days</option>
                        <option value="7d">Closing in 7 days</option>
                        <option value="30d">Closing in 30 days</option>
                    </select>
                </label>
            )}
            {hasFilters ? (
                <button
                    type="button"
                    onClick={() => {
                        setQ('');
                        startTransition(() => router.push(pathname, { scroll: false }));
                    }}
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <X className="h-4 w-4" aria-hidden="true" /> Clear
                </button>
            ) : (
                <button type="submit" className="h-10 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">
                    Search
                </button>
            )}
        </form>
    );
}
