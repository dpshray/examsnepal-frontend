import React from 'react';
import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import {EXAM_TYPE} from "@/types/Enum";
import {cn} from "@/lib/utils";
import {CheckCircle2, MinusCircle, XCircle} from 'lucide-react';

interface ScoreResult {
    exam_id: number;
    exam_name: string;
    type: EXAM_TYPE | string;
    is_negative_marking?: boolean;
    negative_marking_point?: number;
    total_question_count?: number;
    correct_answer_count?: number;
    incorrect_answer_count: number;
    missed_answer_count?: number;
    total_point_reduction_based_on_negative_marking_point?: number;
    final_exam_marks_after_reduction_of_negative_marking_point?: number;
    submitted_date?: string;
}

interface ExamScoreCardProps {
    data: ScoreResult;
    className?: string;
}

const ExamScoreCard: React.FC<ExamScoreCardProps> = React.memo(({data, className = ''}) => {
    const accuracy = React.useMemo(() =>
            ((data.correct_answer_count || 0) / (data.total_question_count || 1) * 100).toFixed(2),
        [data.correct_answer_count, data.total_question_count]
    );

    const finalScore = data.final_exam_marks_after_reduction_of_negative_marking_point || 0;
    const isNegative = finalScore < 0;
    const accuracyNum = parseFloat(accuracy);

    return (
        <article
            className={cn('w-full bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-5 mb-3 sm:mb-4', className)}
            aria-label={`Exam scores for ${data.exam_name}`}
        >
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex-1 leading-tight">
                    {data.exam_name}
                </h3>
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-600 border-blue-200 whitespace-nowrap self-start text-xs sm:text-sm"
                    aria-label={`Quiz type: ${data.type}`}
                >
                    {data.type}
                </Badge>
            </header>

            <section
                className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
                aria-label="Final score section"
            >
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Final Score</div>
                <div className="flex items-baseline gap-1">
                    <span
                        className={cn(
                            "text-xl sm:text-2xl md:text-3xl font-bold",
                            isNegative ? "text-red-500" : "text-blue-600"
                        )}
                        aria-label={`Score: ${finalScore.toFixed(2)} out of ${data.total_question_count || 0}`}
                    >
                        {finalScore.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base text-gray-500">
                        / {data.total_question_count || 0}
                    </span>
                </div>
            </section>

            <section
                className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4"
                aria-label="Answer statistics"
            >
                <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
                    <CheckCircle2
                        className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1"
                        aria-hidden="true"
                    />
                    <div className="text-lg sm:text-xl font-bold text-green-700">
                        {data.correct_answer_count || 0}
                    </div>
                    <div className="text-xs text-green-600">Correct</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                    <XCircle
                        className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mx-auto mb-1"
                        aria-hidden="true"
                    />
                    <div className="text-lg sm:text-xl font-bold text-red-700">
                        {data.incorrect_answer_count || 0}
                    </div>
                    <div className="text-xs text-red-600">Incorrect</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                    <MinusCircle
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto mb-1"
                        aria-hidden="true"
                    />
                    <div className="text-lg sm:text-xl font-bold text-gray-700">
                        {data.missed_answer_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Missed</div>
                </div>
            </section>

            <section className="space-y-2 sm:space-y-3">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm text-gray-600">Accuracy</span>
                        <span
                            className={cn(
                                "text-xs sm:text-sm font-semibold",
                                accuracyNum > 50 ? "text-green-600" : "text-red-600"
                            )}
                            aria-label={`Accuracy: ${accuracy} percent`}
                        >
                            {accuracy}%
                        </span>
                    </div>
                    <Progress
                        value={accuracyNum}
                        className={cn(
                            "h-1.5 sm:h-2",
                            accuracyNum > 50 ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"
                        )}
                        aria-label={`Accuracy progress: ${accuracy}%`}
                    />
                </div>

                {data.is_negative_marking && (
                    <div
                        className="flex items-start sm:items-center gap-2 text-xs sm:text-sm"
                        role="alert"
                        aria-label="Negative marking deduction"
                    >
                        <span className="text-yellow-600 shrink-0" aria-hidden="true">⚠</span>
                        <span className="text-gray-700">
                            Deduction: <span className="font-semibold text-red-600">
                                {data.total_point_reduction_based_on_negative_marking_point?.toFixed(2)} marks
                            </span>
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                    <span className="inline-block w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true">📅</span>
                    <time dateTime={data.submitted_date || '2025-12-24'}>
                        Submitted on: {data.submitted_date || '2025/12/24'}
                    </time>
                </div>
            </section>
        </article>
    );
});

ExamScoreCard.displayName = 'ExamScoreCard';

export default ExamScoreCard;