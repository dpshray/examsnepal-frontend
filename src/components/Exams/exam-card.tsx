'use client'
import {FaExclamationTriangle, FaEye, FaFolder} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import {EXAM_STATUS} from "@/types/Enum";
import {useCallback} from "react";
import {useRouter} from "next/navigation";
import {SOLUTIONS_ROUTE, STUDENT_SCORE_ROUTE} from "@/config/app-constant";
import {Badge} from "@/components/ui/badge";

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
    is_interrupted?: boolean;
    is_exam_completed?: boolean;
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
                'group flex flex-col h-full rounded-xl shadow-lg transition-all duration-300 ease-in-out bg-white border border-gray-100',
                'hover:shadow-2xl hover:bg-gradient-to-br hover:from-white hover:via-amber-50 hover:to-orange-50 hover:border-amber-400',
                'focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2'
            )}
        >
            <article
                className="flex flex-col justify-between h-full w-full rounded-xl py-5 px-5 sm:py-6 sm:px-6"
                aria-label={`Quiz card for ${exam.exam_name}`}
            >
                <header className="mb-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-montserrat text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2 break-words">
                            {exam.exam_name}
                        </h3>
                        {exam.is_interrupted && (
                            <Badge variant="destructive" className="shrink-0">
                                Incomplete
                            </Badge>
                        )}
                    </div>
                    <p className="font-montserrat text-xs sm:text-sm text-gray-600 truncate">
                        Created by {exam.user.fullname}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold">
                            <span>+{exam.correct_marking_point} per correct</span>
                        </div>

                        {exam.is_negative_marking && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold">
                                <FaExclamationTriangle className="shrink-0" aria-hidden="true"/>
                                <span>-{exam.negative_marking_point} per wrong</span>
                            </div>
                        )}
                    </div>
                </header>

                <footer
                    className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                    <div
                        className="flex flex-col sm:flex-row flex-wrap gap-3 text-xs sm:text-sm text-gray-700 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <FaFolder className="text-amber-600 flex-shrink-0" aria-hidden="true"/>
                            <span className="font-semibold">{exam.questions_count} Questions</span>
                        </span>
                        <button
                            type="button"
                            onClick={handleViewAllScoresAction}
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md transition-colors whitespace-nowrap font-semibold"
                            aria-label={`View all scores for ${exam.exam_name}`}
                        >
                            <FaEye className="flex-shrink-0" aria-hidden="true"/>
                            <span>View Scores</span>
                        </button>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs sm:text-sm primary-btn w-full sm:w-auto min-w-[110px] font-semibold focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
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
                'group flex flex-col h-full rounded-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden bg-white border border-gray-100',
                'hover:shadow-2xl hover:bg-gradient-to-br hover:from-white hover:via-emerald-50 hover:to-green-50 hover:border-emerald-400',
                'focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2'
            )}
        >
            <article
                className="flex flex-col justify-between h-full w-full rounded-xl py-5 px-5 sm:py-6 sm:px-6"
                aria-label={`Quiz card for ${exam.exam_name}`}
            >
                <header className="mb-4 space-y-3">
                    <h3 className="font-montserrat text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2 break-words">
                        {exam.exam_name}
                    </h3>
                    <p className="font-montserrat text-xs sm:text-sm text-gray-600 truncate">
                        Created by {exam.user.fullname}
                    </p>
                    {exam.is_negative_marking && (
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold">
                            <FaExclamationTriangle className="flex-shrink-0" aria-hidden="true"/>
                            <span>Negative Marking: -{exam.negative_marking_point} points</span>
                        </div>
                    )}
                </header>

                <footer
                    className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                    <div
                        className="flex flex-col sm:flex-row flex-wrap gap-3 text-xs sm:text-sm text-gray-700 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <FaFolder className="text-emerald-600 flex-shrink-0" aria-hidden="true"/>
                            <span className="font-semibold">{exam.questions_count} Questions</span>
                        </span>
                        <button
                            type="button"
                            onClick={handleViewAllScoresAction}
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md transition-colors whitespace-nowrap font-semibold"
                            aria-label={`View all scores for ${exam.exam_name}`}
                        >
                            <FaEye className="flex-shrink-0" aria-hidden="true"/>
                            <span>View Scores</span>
                        </button>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs sm:text-sm primary-btn disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 w-full sm:w-auto min-w-[130px] font-semibold focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
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
            className="bg-white w-full rounded-xl shadow-lg border border-gray-100 p-5 sm:p-6 flex flex-col justify-between animate-pulse"
            aria-label="Loading quiz card"
            role="status"
        >
            <header className="flex flex-col space-y-3">
                <Skeleton className="h-6 sm:h-7 w-3/4 rounded"/>
                <Skeleton className="h-4 w-1/2 rounded"/>
                <Skeleton className="h-8 w-40 rounded-lg"/>
            </header>

            <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Skeleton className="h-4 w-36 rounded"/>
                    <Skeleton className="h-4 w-32 rounded"/>
                </div>
                <Skeleton className="h-9 sm:h-10 w-full sm:w-28 rounded-md"/>
            </div>
            <span className="sr-only">Loading quiz information...</span>
        </article>
    );
}