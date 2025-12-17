'use client';

import {memo, useMemo} from 'react';
import {Badge} from '@/components/ui/badge';
import {Award, ChevronUp, LucideIcon, Star, Target} from 'lucide-react';

interface ScoreResult {
    scoreId?: number;
    exam_name: string;
    total_question_count: number;
    correct_answer_count: number;
    exam_type?: string;
}

interface ScoreCardProps {
    results: ScoreResult;
}

interface PerformanceLevel {
    label: string;
    color: string;
    bgColor: string;
    icon: LucideIcon;
}

const ProfileScoreCard = memo(({results}: ScoreCardProps) => {
    const {exam_name, total_question_count, correct_answer_count, exam_type} = results;

    const percentage = useMemo(() => {
        return total_question_count > 0
            ? Math.round((correct_answer_count / total_question_count) * 100)
            : 0;
    }, [correct_answer_count, total_question_count]);

    const incorrectCount = useMemo(() =>
            total_question_count - correct_answer_count,
        [total_question_count, correct_answer_count]
    );

    const getPerformanceLevel = useMemo((): PerformanceLevel => {
        if (percentage >= 90) return {
            label: 'Excellent',
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            icon: Award
        };
        if (percentage >= 75) return {
            label: 'Great',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            icon: Star
        };
        if (percentage >= 60) return {
            label: 'Good',
            color: 'bg-amber-500',
            bgColor: 'bg-amber-50',
            icon: ChevronUp
        };
        return {
            label: 'Needs Improvement',
            color: 'bg-red-500',
            bgColor: 'bg-red-50',
            icon: Target
        };
    }, [percentage]);

    const PerformanceIcon = getPerformanceLevel.icon;

    return (
        <article
            className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            aria-label={`Score card for ${exam_name}`}
        >
            <div
                className={`${getPerformanceLevel.color} h-2 w-full`}
                role="presentation"
                aria-hidden="true"
            />

            <div className="p-4 sm:p-6 md:p-8">
                <header className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 break-words mb-2">
                            {exam_name}
                        </h2>
                        {exam_type && (
                            <Badge variant="secondary" className="text-xs sm:text-sm">
                                {exam_type}
                            </Badge>
                        )}
                    </div>

                    <div
                        className={`${getPerformanceLevel.color} p-2 sm:p-3 rounded-full flex-shrink-0`}
                        aria-label={`Performance level: ${getPerformanceLevel.label}`}
                    >
                        <PerformanceIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" aria-hidden="true"/>
                    </div>
                </header>

                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-baseline gap-1 sm:gap-2">
                            <span
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
                                aria-label={`Score: ${percentage} percent`}
                            >
                                {percentage}
                            </span>
                            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-500"
                                  aria-hidden="true">%</span>
                        </div>
                        <Badge
                            className={`${getPerformanceLevel.color} text-white text-xs sm:text-sm px-2 sm:px-3 py-1`}
                            aria-label={`Performance: ${getPerformanceLevel.label}`}
                        >
                            {getPerformanceLevel.label}
                        </Badge>
                    </div>

                    <div
                        className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progress: ${percentage} percent complete`}
                    >
                        <div
                            className={`${getPerformanceLevel.color} h-full rounded-full transition-all duration-500 ease-out`}
                            style={{width: `${percentage}%`}}
                        />
                    </div>

                    <dl className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <dt className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Correct</dt>
                            <dd className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                                {correct_answer_count}
                            </dd>
                        </div>

                        <div className="text-center border-x border-gray-300">
                            <dt className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Total</dt>
                            <dd className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700">
                                {total_question_count}
                            </dd>
                        </div>

                        <div className="text-center">
                            <dt className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Incorrect</dt>
                            <dd className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">
                                {incorrectCount}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </article>
    );
});

ProfileScoreCard.displayName = 'ProfileScoreCard';

export default ProfileScoreCard;