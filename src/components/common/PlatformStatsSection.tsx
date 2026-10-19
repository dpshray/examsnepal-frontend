import { BookOpenCheck, ClipboardCheck, MousePointerClick, Users } from 'lucide-react';
import { formatCount, formatStatsDate, type SiteStats } from '@/lib/statsApi';

// Homepage "ExamsNepal in numbers" - live aggregate counts from the database
// (see backend App\Services\PublicStats), not marketing copy. Rendered
// server-side so crawlers and visitors see the same figures.
export function PlatformStatsSection({ stats }: { stats: SiteStats }) {
    const items = [
        { icon: Users, value: formatCount(stats.students), label: 'Students registered' },
        { icon: ClipboardCheck, value: formatCount(stats.tests_completed), label: 'Tests completed' },
        { icon: MousePointerClick, value: formatCount(stats.answers_submitted), label: 'Answers submitted' },
        { icon: BookOpenCheck, value: formatCount(stats.questions), label: 'Questions in the bank' },
    ];

    return (
        <section className="container mx-auto mt-16 px-6 sm:mt-20 sm:px-10 lg:px-20" aria-labelledby="platform-stats-heading">
            <div className="text-center">
                <h2 id="platform-stats-heading" className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                    ExamsNepal in Numbers
                </h2>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                    Real activity from students preparing on ExamsNepal
                    {stats.tests_last_30_days > 0 && (
                        <> &mdash; {formatCount(stats.tests_last_30_days)} tests taken in the last 30 days</>
                    )}
                    .
                </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {items.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                        <Icon className="order-none h-6 w-6 text-green-600" aria-hidden="true" />
                        {/* dt first for valid <dl> semantics; flex order shows the number on top */}
                        <dt className="order-2 mt-1 text-sm text-gray-500">{label}</dt>
                        <dd className="order-1 mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">{value}</dd>
                    </div>
                ))}
            </dl>

            <p className="mt-4 text-center text-xs text-gray-400">
                Counted from our database, updated {formatStatsDate(stats.generated_at)}. Tests submitted without
                any answers are not counted.
            </p>
        </section>
    );
}
