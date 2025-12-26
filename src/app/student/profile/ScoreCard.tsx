import React from 'react';
import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import {Button} from '@/components/ui/button';
import {EXAM_TYPE} from "@/types/Enum";
import {cn} from "@/lib/utils";
import {Calendar, CheckCircle2, MinusCircle, TrendingDown, XCircle, FileText} from 'lucide-react';

interface ScoreResult {
    exam_id: number;
    exam_name: string | EXAM_TYPE;
    type: string;
    is_negative_marking: boolean;
    negative_marking_point: number;
    total_question_count: number;
    correct_answer_count: number;
    incorrect_answer_count: number;
    missed_answer_count: number;
    total_point_reduction_based_on_negative_marking_point: number;
    final_exam_marks_after_reduction_of_negative_marking_point: number;
    submitted_at?: string;
    correct_marking_point?: number;
    full_marks?: number;
}

interface ExamScoreCardProps {
    data: ScoreResult;
    onViewSolutionAction?: (examId: number) => void;
    className?: string;
}

const ExamScoreCard: React.FC<ExamScoreCardProps> = React.memo(({data, onViewSolutionAction, className = ''}) => {
    const scorePercentage = data.full_marks
        ? (data.final_exam_marks_after_reduction_of_negative_marking_point / data.full_marks) * 100
        : 0;

    const getScoreColor = (percentage: number): string => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-blue-600';
        if (percentage >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (percentage: number): string => {
        if (percentage >= 80) return 'bg-green-50';
        if (percentage >= 60) return 'bg-blue-50';
        if (percentage >= 40) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    return (
        <article
            className={cn(
                'w-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col',
                className
            )}
            aria-label={`Exam score card for ${data.exam_name}`}
        >
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                            {data.exam_name}
                        </h2>
                        <Badge
                            variant="secondary"
                            className="text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                            {data.type}
                        </Badge>
                    </div>
                </header>

                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">
                        Questions: {data.total_question_count}
                    </Badge>
                    <Badge variant="outline">
                        Negative Marking: {data.negative_marking_point}
                    </Badge>
                    <Badge variant="outline">
                        Mark per Question: {data.correct_marking_point}
                    </Badge>
                </div>

                <div className={cn(
                    'rounded-lg p-4 mb-4',
                    getScoreBgColor(scorePercentage)
                )}>
                    <div className="flex items-baseline justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Final Score</span>
                        <div className="flex items-baseline gap-1">
                            <span className={cn(
                                'text-lg sm:text-xl font-bold',
                                getScoreColor(scorePercentage)
                            )}>
                                {data.final_exam_marks_after_reduction_of_negative_marking_point.toFixed(2)}
                            </span>
                            {data.full_marks && (
                                <span className="text-base sm:text-lg text-gray-500 font-medium">
                                    / {data.full_marks}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    <div className="flex flex-col items-center p-3 rounded-lg bg-green-50">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-1" aria-hidden="true"/>
                        <span className="text-lg sm:text-xl font-bold text-green-600">
                            {data.correct_answer_count}
                        </span>
                        <span className="text-xs text-gray-600">Correct</span>
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-red-50">
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mb-1" aria-hidden="true"/>
                        <span className="text-lg sm:text-xl font-bold text-red-600">
                            {data.incorrect_answer_count}
                        </span>
                        <span className="text-xs text-gray-600">Incorrect</span>
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                        <MinusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mb-1" aria-hidden="true"/>
                        <span className="text-lg sm:text-xl font-bold text-gray-600">
                            {data.missed_answer_count}
                        </span>
                        <span className="text-xs text-gray-600">Missed</span>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Accuracy</span>
                        <span className={cn(
                            'text-sm sm:text-base font-bold',
                            getScoreColor(scorePercentage)
                        )}>
                            {scorePercentage.toFixed(2)}%
                        </span>
                    </div>
                    <Progress
                        value={scorePercentage}
                        className="h-1.5 sm:h-2 w-full [&>div]:bg-green-500"
                        aria-valuenow={scorePercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Exam score percentage"
                    />
                </div>

                {data.is_negative_marking && data.total_point_reduction_based_on_negative_marking_point > 0 && (
                    <div
                        className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-100 mb-4"
                        role="alert"
                        aria-live="polite"
                    >
                        <TrendingDown className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" aria-hidden="true"/>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-orange-800 font-medium">
                                Deduction: -{data.total_point_reduction_based_on_negative_marking_point.toFixed(2)} marks
                            </p>
                        </div>
                    </div>
                )}

                {data.submitted_at && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" aria-hidden="true"/>
                        <time
                            dateTime={data.submitted_at}
                            className="text-xs sm:text-sm text-gray-500"
                        >
                            Submitted on: {new Date(data.submitted_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
                        </time>
                    </div>
                )}

                <div className="flex-1"></div>

                {onViewSolutionAction && (
                    <div className="flex justify-end pt-3 border-t border-gray-100 mt-auto">
                        <Button
                            onClick={() => onViewSolutionAction(data.exam_id)}
                            variant="default"
                            size="sm"
                            className="gap-2 bg-green-600"
                        >
                            <FileText className="w-4 h-4" />
                            View Solutions
                        </Button>
                    </div>
                )}
            </div>
        </article>
    );
});

ExamScoreCard.displayName = 'ExamScoreCard';

export default ExamScoreCard;