import {motion} from "framer-motion";
import {FaEye, FaFolder} from "react-icons/fa6";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";

interface BaseQuizCardProps {
    title: string;
    provider: string;
    questionCount: number;
    onViewAllScoresAction: () => void;
}

interface QuizTestCardProps extends BaseQuizCardProps {
    onTakeTestAction: () => void;
}

interface QuizCompletedCardProps extends BaseQuizCardProps {
    onViewSolutionAction: () => void;
}


export function QuizPendingCard({
                                    title,
                                    provider,
                                    questionCount,
                                    onViewAllScoresAction,
                                    onTakeTestAction,
                                }: QuizTestCardProps) {
    return (
        <div
            className={cn(
                'group flex flex-col justify-between h-full rounded-xl shadow transition duration-300 ease-in-out',
                'hover:shadow-xl hover:bg-gradient-to-r hover:from-white hover:to-amber-100 hover:border hover:border-amber-600'
            )}
        >
            <article
                className="flex flex-col justify-between h-full max-w-sm rounded-xl py-4 px-3"
                aria-label={`Quiz card for ${title}`}
            >
                {/* Header */}
                <header className="mb-4">
                    <h3 className="font-montserrat text-lg font-semibold text-gray-900 line-clamp-2">
                        {title}
                    </h3>
                    <p className="font-montserrat text-sm text-gray-600">{provider}</p>
                </header>

                {/* Footer Actions */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1 text-xs text-gray-700">
            <span className="inline-flex items-center gap-1">
              <FaFolder className="text-black"/>
                {questionCount} Questions
            </span>
                        <button
                            type="button"
                            onClick={onViewAllScoresAction}
                            className="inline-flex items-center gap-1 text-green-700 hover:underline"
                            aria-label={`View all scores for ${title}`}
                        >
                            <FaEye className="text-black"/>
                            View Scores
                        </button>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs primary-btn"
                        onClick={onTakeTestAction}
                        aria-label={`Take the test for ${title}`}
                    >
                        Take Test
                    </Button>
                </div>
            </article>
        </div>
    );
}


export function QuizCompletedCard({
                                      title,
                                      provider,
                                      questionCount,
                                      onViewAllScoresAction,
                                      onViewSolutionAction,
                                  }: QuizCompletedCardProps) {
    return (
        <div
            className={cn(
                'group flex flex-col justify-between h-full rounded-xl shadow transition duration-300 ease-in-out overflow-hidden',
                'hover:shadow-xl hover:bg-gradient-to-r hover:from-white hover:to-green-200 hover:border hover:border-green-600'
            )}
        >
            <article
                className="flex flex-col justify-between h-full max-w-sm rounded-xl py-4 px-3"
                aria-label={`Quiz card for ${title}`}
            >
                {/* Header */}
                <header className="mb-4">
                    <h3 className="font-montserrat text-lg font-semibold text-gray-900 line-clamp-2">
                        {title}
                    </h3>
                    <p className="font-montserrat text-sm text-gray-600">{provider}</p>
                </header>

                {/* Footer Actions */}
                <div className="mt-auto flex items-center justify-between pt-4  border-gray-200">
                    <div className="flex flex-wrap gap-1 text-xs text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <FaFolder className="text-black"/>
                            {questionCount} Questions
                        </span>
                        <button
                            type="button"
                            onClick={onViewAllScoresAction}
                            className="inline-flex items-center gap-1 text-green-700 hover:underline"
                            aria-label={`View all scores for ${title}`}
                        >
                            <FaEye className="text-black"/>
                            View Scores
                        </button>
                    </div>
                    <Button
                        size="sm"
                        className="text-xs primary-btn disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300"
                        onClick={onViewSolutionAction}
                        aria-label={`View the solution for ${title}`}
                    >
                        View Solution
                    </Button>
                </div>
            </article>
        </div>
    );
}


export function QuizTestCardSkeleton() {
    return (
        <motion.article
            className="bg-white w-full max-w-sm rounded-lg shadow p-4 flex flex-col justify-between animate-pulse"
            aria-label="Loading quiz card"
        >
            <header className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-3/4 rounded"/>
                <Skeleton className="h-4 w-1/2 rounded"/>
            </header>

            <div className="flex justify-between items-center mt-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32 rounded"/>
                    <Skeleton className="h-4 w-28 rounded"/>
                </div>
                <Skeleton className="h-8 w-20 rounded-md"/>
            </div>
        </motion.article>
    );
}



