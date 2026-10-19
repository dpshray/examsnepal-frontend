import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCount, formatStatsDate, type ExamStats, type SubjectAccuracy } from '@/lib/statsApi';

// "How students perform" on an exam guide page - real, anonymous aggregates
// of ExamsNepal mock tests for this exam's question bank (backend
// App\Services\PublicStats). The backend only returns stats once there are
// enough completed tests to be meaningful, so this never renders thin data.
export function ExamPerformanceSection({ examName, stats }: { examName: string; stats: ExamStats }) {
    const headline = [
        { value: `${Math.round(stats.average_score_pct)}%`, label: 'Average score' },
        { value: `${Math.round(stats.top_10_percent_score_pct)}%+`, label: 'Top 10% of students score' },
        { value: formatCount(stats.tests_completed), label: 'Mock tests completed' },
        { value: formatCount(stats.students_preparing), label: 'Students preparing' },
    ];

    return (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-700" aria-hidden="true" />
                How Students Perform on {examName} Mock Tests
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
                From {formatCount(stats.tests_completed)} completed tests on ExamsNepal, drawn from a bank of{' '}
                {formatCount(stats.questions)} questions for this exam.
            </p>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {headline.map(({ value, label }) => (
                    <div key={label} className="flex flex-col rounded-lg bg-green-50 p-3">
                        <dt className="order-2 text-xs text-gray-600">{label}</dt>
                        <dd className="order-1 text-xl font-bold text-green-800">{value}</dd>
                    </div>
                ))}
            </dl>

            <p className="mt-4 text-sm text-gray-700">
                Half of all attempts score {Math.round(stats.median_score_pct)}% or lower. Scoring{' '}
                {Math.round(stats.top_10_percent_score_pct)}% or more on a full mock test puts you in the top 10% of
                students practising for this exam on ExamsNepal.
            </p>

            {(stats.hardest_subjects.length > 0 || stats.easiest_subjects.length > 0) && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.hardest_subjects.length > 0 && (
                        <SubjectList
                            title="Toughest subjects"
                            icon={<TrendingDown className="w-4 h-4 text-red-600" aria-hidden="true" />}
                            subjects={stats.hardest_subjects}
                        />
                    )}
                    {stats.easiest_subjects.length > 0 && (
                        <SubjectList
                            title="Highest-scoring subjects"
                            icon={<TrendingUp className="w-4 h-4 text-green-700" aria-hidden="true" />}
                            subjects={stats.easiest_subjects}
                        />
                    )}
                </div>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
                Anonymous aggregate of ExamsNepal practice tests, updated {formatStatsDate(stats.generated_at)}. Tests
                submitted without any answers are excluded; subject figures use questions tagged by subject. These are
                practice results, not official exam results.
            </p>
        </div>
    );
}

function SubjectList({ title, icon, subjects }: { title: string; icon: React.ReactNode; subjects: SubjectAccuracy[] }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                {icon}
                {title}
            </h3>
            <ul className="space-y-1.5">
                {subjects.map((subject) => (
                    <li key={subject.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{subject.name}</span>
                        <span className="font-medium text-gray-900">{Math.round(subject.accuracy_pct)}% correct</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
