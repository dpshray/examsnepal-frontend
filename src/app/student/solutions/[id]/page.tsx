'use client';

import {use, useCallback, useEffect, useState, memo} from "react";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

import examService from "@/services/ExamService/ExamService";
import {StudentBannerHeader} from "@/components/banner/header";
import {Button} from "@/components/ui/button";
import {QuestionCardSkeleton, QuestionSolutionCard} from "@/components/Exams/QuestionCard";
import CustomPagination from "@/components/Pagination";

interface Option {
    id: number;
    option: string;
    value: boolean;
}

interface Question {
    id: number;
    question: string;
    options: Option[];
    user_choosed: number | null;
    explanation: string;
}

interface SolutionData {
    data: Question[];
    last_page: number;
    total: number;
}

interface ViewSolutionProps {
    params: Promise<{ id: number }>;
}

const LoadingState = memo(() => (
    <div className="w-full mx-auto my-4 md:my-6 lg:my-10 container px-3 sm:px-4 md:px-6">
        <div className="space-y-2 shadow-md rounded-lg p-3 sm:p-4 md:p-6">
            {Array.from({length: 10}).map((_, index) => (
                <QuestionCardSkeleton key={`skeleton-${index}`} />
            ))}
        </div>
    </div>
));

LoadingState.displayName = 'LoadingState';

const ErrorState = memo(({onRetry, onGoBack}: {onRetry: () => void; onGoBack: () => void}) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-red-500 text-center mb-4">
            Failed to fetch solutions data
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button
                onClick={onRetry}
                variant="destructive"
                className="w-full sm:w-auto min-w-[120px]"
                aria-label="Retry loading solutions"
            >
                Retry
            </Button>
            <Button
                onClick={onGoBack}
                className="primary-btn w-full sm:w-auto min-w-[120px]"
                aria-label="Go back to mock tests"
            >
                Go Back
            </Button>
        </div>
    </div>
));

ErrorState.displayName = 'ErrorState';

const SolutionHeader = memo(({totalQuestion, totalPages}: {totalQuestion: number; totalPages: number}) => (
    <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 px-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
            Total Questions: {totalQuestion}
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 font-poppins text-center">
            <span className="text-lg sm:text-xl md:text-2xl font-semibold">Solution</span>
            <span className="text-xs sm:text-sm text-gray-500 ml-1">({totalPages} pages)</span>
        </h2>
    </div>
));

SolutionHeader.displayName = 'SolutionHeader';

export default function ViewSolution({params}: ViewSolutionProps) {
    const {id} = use(params);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const fetchSolution = useCallback(async ({queryKey}: any) => {
        const [_key, examId, page] = queryKey;
        const res = await examService.getExamById({id: Number(examId), page});
        return res.data;
    }, []);

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ["view-solution", id, currentPage],
        queryFn: fetchSolution,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const solution = data?.data || [];
    const totalPages = data?.last_page || 1;
    const totalQuestion = data?.total || 0;

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [currentPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleGoBack = useCallback(() => {
        router.push('/student/exams/mock-tests');
    }, [router]);

    if (isLoading) return <LoadingState />;

    if (isError) {
        return <ErrorState onRetry={handleRetry} onGoBack={handleGoBack} />;
    }

    return (
        <section className="min-h-screen">
            <StudentBannerHeader
                title="Sprint Quiz"
                subtitle="Get instant answers to your questions"
                className="bg-gradient-to-r from-teal-200 to-teal-400 text-white"
                textClassName="text-white"
            />

            <div className="w-full mx-auto my-4 md:my-6 lg:my-10 container px-3 sm:px-4 md:px-6">
                <div className="shadow-md rounded-lg p-3 sm:p-4 md:p-6 bg-white">
                    <SolutionHeader totalQuestion={totalQuestion} totalPages={totalPages} />

                    <div className="space-y-3 sm:space-y-4 mb-6">
                        {solution.map((question: Question, index: number) => {
                            const options = question.options.map((opt: Option) => ({
                                label: opt.option,
                                value: String(opt.id),
                                isCorrect: Boolean(opt.value),
                            }));

                            const selectedAnswer = question?.user_choosed
                                ? String(question.user_choosed)
                                : undefined;

                            const correctAnswers = options
                                .filter((opt) => opt.isCorrect)
                                .map((opt) => opt.value);

                            return (
                                <QuestionSolutionCard
                                    key={question.id}
                                    questionNumber={(currentPage - 1) * 10 + index + 1}
                                    questionText={question.question}
                                    options={options}
                                    selectedValue={selectedAnswer}
                                    showFeedback={true}
                                    correctAnswers={correctAnswers}
                                    explanation={question.explanation}
                                    onSelect={() => {}}
                                    id={question.id}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChangeAction={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}