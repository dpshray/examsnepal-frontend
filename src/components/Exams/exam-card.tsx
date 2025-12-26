'use client'
import {FaExclamationTriangle, FaEye, FaFolder} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import {EXAM_STATUS} from "@/types/Enum";
import {useCallback} from "react";
import {useRouter} from "next/navigation";
import {SOLUTIONS_ROUTE, STUDENT_SCORE_ROUTE} from "@/config/app-constant";

interface BaseQuizCardProps {
    exam: Exam;
    onViewAllScoresAction?: (examId: number) => void;
}

export interface ExamUser {
    id: number;
    fullname: string;
}

export interface Exam {
    id: number;
    exam_name: string;
    status: EXAM_STATUS | string;
    correct_marking_point: number;
    is_negative_marking?: boolean;
    negative_marking_point?: number;
    questions_count: number;
    user: ExamUser;
}

interface QuizPendingCardProps extends BaseQuizCardProps {
    onTakeTestAction?: (examId: number) => void;
}

interface QuizCompletedCardProps extends BaseQuizCardProps {
    onViewSolutionAction?: (examId: number) => void;
}

export function QuizPendingCard({
                                    exam,
                                    onViewAllScoresAction,
                                    onTakeTestAction,
                                }: QuizPendingCardProps) {
    const router = useRouter();

    const handleTakeTestAction = useCallback(() => {
        if (onTakeTestAction) {
            onTakeTestAction(exam.id);
        }
    }, [exam.id, onTakeTestAction]);

    const handleViewAllScoresAction = useCallback(() => {
        router.push(STUDENT_SCORE_ROUTE + `/${exam.id}`);
        onViewAllScoresAction?.(exam.id);
    }, [exam.id, onViewAllScoresAction, router]);

    return (
        <div
            className={cn(
                'group flex flex-col h-full rounded-xl shadow-md transition-all duration-300 ease-in-out bg-white',
                'hover:shadow-2xl hover:bg-gradient-to-r hover:from-white hover:to-amber-50 hover:border-2 hover:border-amber-500',
                'focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2'
            )}
        >
            <article
                className="flex flex-col justify-between h-full w-full rounded-xl py-4 px-4 sm:py-5 sm:px-5 md:py-6 md:px-6"
                aria-label={`Quiz card for ${exam.exam_name}`}
            >
                <header className="mb-4 space-y-2">
                    <h3 className="font-montserrat text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2 break-words">
                        {exam.exam_name}
                    </h3>
                    <p className="font-montserrat text-xs sm:text-sm text-gray-600 truncate">
                        {exam.user.fullname}
                    </p>
                    {/* Marking Information */}
                    <div className="flex flex-wrap gap-2">
                        {/* Positive Marking */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 font-medium">
                            <span>+{exam.correct_marking_point} per correct</span>
                        </div>
                        
                        {/* Negative Marking */}
                        {exam.is_negative_marking && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
                                <FaExclamationTriangle className="flex-shrink-0" aria-hidden="true"/>
                                <span>-{exam.negative_marking_point} per wrong</span>
                            </div>
                        )}
                    </div>
                </header>

                <footer
                    className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                    <div
                        className="flex flex-col sm:flex-row flex-wrap gap-2 text-xs sm:text-sm text-gray-700 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <FaFolder className="text-gray-800 flex-shrink-0" aria-hidden="true"/>
                            <span className="font-medium">{exam.questions_count} Questions</span>
                        </span>
                        <button
                            type="button"
                            onClick={handleViewAllScoresAction}
                            className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded transition-colors whitespace-nowrap"
                            aria-label={`View all scores for ${exam.exam_name}`}
                        >
                            <FaEye className="text-gray-800 flex-shrink-0" aria-hidden="true"/>
                            <span className="font-medium">View Scores</span>
                        </button>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs sm:text-sm primary-btn w-full sm:w-auto min-w-[100px] focus:ring-2 focus:ring-offset-2 transition-all"
                        onClick={handleTakeTestAction}
                        aria-label={`Take the test for ${exam.exam_name}`}
                    >
                        Take Test
                    </Button>
                </footer>
            </article>
        </div>
    );
}

export function QuizCompletedCard({
                                      exam,
                                      onViewAllScoresAction,
                                      onViewSolutionAction,
                                  }: QuizCompletedCardProps) {
    const router = useRouter();

    const handleViewSolutionAction = useCallback(() => {
        if (onViewSolutionAction) {
            onViewSolutionAction(exam.id);
        }
        router.push(SOLUTIONS_ROUTE + `/${exam.id}`);
    }, [exam.id, onViewSolutionAction, router]);

    const handleViewAllScoresAction = useCallback(() => {

        router.push(STUDENT_SCORE_ROUTE + `/${exam.id}`);
        onViewAllScoresAction?.(exam.id);
    }, [exam.id, onViewAllScoresAction, router]);

    return (
        <div
            className={cn(
                'group flex flex-col h-full rounded-xl shadow-md transition-all duration-300 ease-in-out overflow-hidden bg-white',
                'hover:shadow-2xl hover:bg-gradient-to-r hover:from-white hover:to-green-50 hover:border-2 hover:border-green-500',
                'focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-offset-2'
            )}
        >
            <article
                className="flex flex-col justify-between h-full w-full rounded-xl py-4 px-4 sm:py-5 sm:px-5 md:py-6 md:px-6"
                aria-label={`Quiz card for ${exam.exam_name}`}
            >
                <header className="mb-4 space-y-2">
                    <h3 className="font-montserrat text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2 wrap-break-word">
                        {exam.exam_name}
                    </h3>
                    <p className="font-montserrat text-xs sm:text-sm text-gray-600 truncate">
                        {exam.user.fullname}
                    </p>
                    {exam.is_negative_marking && (
                        <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
                            <FaExclamationTriangle className="flex-shrink-0" aria-hidden="true"/>
                            <span>Negative Marking: -{exam.negative_marking_point} points</span>
                        </div>
                    )}
                </header>

                <footer
                    className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                    <div
                        className="flex flex-col sm:flex-row flex-wrap gap-2 text-xs sm:text-sm text-gray-700 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <FaFolder className="text-gray-800 flex-shrink-0" aria-hidden="true"/>
                            <span className="font-medium">{exam.questions_count} Questions</span>
                        </span>
                        <button
                            type="button"
                            onClick={handleViewAllScoresAction}
                            className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded transition-colors whitespace-nowrap"
                            aria-label={`View all scores for ${exam.exam_name}`}
                        >
                            <FaEye className="text-gray-800 flex-shrink-0" aria-hidden="true"/>
                            <span className="font-medium">View Scores</span>
                        </button>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs sm:text-sm primary-btn disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 w-full sm:w-auto min-w-[120px] focus:ring-2 focus:ring-offset-2 transition-all"
                        onClick={handleViewSolutionAction}
                        aria-label={`View the solution for ${exam.exam_name}`}
                    >
                        View Solution
                    </Button>
                </footer>
            </article>
        </div>
    );
}

export function QuizTestCardSkeleton() {
    return (
        <article
            className="bg-white w-full rounded-xl shadow-md p-4 sm:p-5 md:p-6 flex flex-col justify-between animate-pulse"
            aria-label="Loading quiz card"
            role="status"
        >
            <header className="flex flex-col space-y-3">
                <Skeleton className="h-5 sm:h-6 w-3/4 rounded"/>
                <Skeleton className="h-4 w-1/2 rounded"/>
            </header>

            <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Skeleton className="h-4 w-32 rounded"/>
                    <Skeleton className="h-4 w-28 rounded"/>
                </div>
                <Skeleton className="h-8 sm:h-9 w-full sm:w-24 rounded-md"/>
            </div>
            <span className="sr-only">Loading quiz information...</span>
        </article>
    );
}