import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import type {Mcq} from '@/lib/mcqApi';

export function QuestionBrowseCard({mcq, index}: {mcq: Mcq; index: number}) {
    return (
        <article className="w-full flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm border border-border">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">
                {index}. {mcq.question}
            </h2>

            <ul className="flex flex-col gap-3">
                {mcq.options.map((option, idx) => (
                    <li
                        key={idx}
                        className="p-3 rounded-md border border-border bg-gray-50 text-gray-800"
                    >
                        {option.option.trim()}
                    </li>
                ))}
            </ul>

            {mcq.slug ? (
                <Link
                    href={`/mcq/${mcq.slug}`}
                    className="self-start inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
                >
                    View Answer
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
            ) : null}
        </article>
    );
}
