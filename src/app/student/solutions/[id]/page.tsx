'use client';

import {use, useCallback, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

import examService from "@/services/ExamService/ExamService";
import {StudentBannerHeader} from "@/components/banner/header";
import {Button} from "@/components/ui/button";
import {QuestionCardSkeleton, QuestionSolutionCard} from "@/components/Exams/QuestionCard";
import CustomPagination from "@/components/Pagination";

export default function ViewSolution({params}: { params: Promise<{ id: number }> }) {
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

    });

    const solution = data?.data || [];
    const totalPages = data?.total ? Math.ceil(data.total / 10) : 0;

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [currentPage]);

    const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

    if (isLoading) return (
        <div className="w-full mx-auto my-6 md:my-10 container space-y-2 shadow-md p-3">
            {Array.from({length: 10}).map((_, index) => (
                <QuestionCardSkeleton
                    key={index}/>
            ))}
        </div>
    );


    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Failed to fetch solutions data</h1>
                <div className="flex items-center justify-center space-x-2">
                    <Button onClick={() => refetch()} variant="destructive" className="mt-4">
                        Retry
                    </Button>
                    <Button onClick={() => router.push('/student/exams/mock-tests')} className="mt-4 primary-btn">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <section>
            <div className="w-full">
                <StudentBannerHeader
                    title="Sprint Quiz"
                    subtitle="Get instant answers to your questions"
                    className="bg-gradient-to-r from-teal-200 to-teal-400 text-white"
                    textClassName="text-white"
                />
                <div className="w-full mx-auto my-6 md:my-10 container space-y-2 shadow-md p-3">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Total Questions: {solution.length}
                        </h1>
                        <h2 className="text-3xl font-medium text-gray-900 mb-2 font-poppins">
                            <span className="text-2xl font-semibold">Solution</span>
                            <span className="text-sm text-gray-500"> ({totalPages} pages)</span>
                        </h2>
                    </div>
                    {solution.map((question: any, index: number) => {
                        const options = question.options.map((opt: any) => ({
                            label: opt.option,
                            value: String(opt.id),
                            isCorrect: Boolean(opt.value),
                        }));
                        const selectedAnswer = question?.user_choosed
                            ? String(question.user_choosed)
                            : undefined;
                        return (
                            <QuestionSolutionCard
                                key={question.id}
                                questionNumber={(currentPage - 1) * 10 + index + 1}
                                questionText={question.question}
                                options={options}
                                selectedValue={selectedAnswer}
                                showFeedback={true}
                                correctAnswers={options.filter((opt: any) => opt.isCorrect).map((opt: any) => opt.value)}
                                explanation={question.explanation}
                                onSelect={() => {
                                }}
                                id={question.id}
                            />
                        );
                    })}
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChangeAction={handlePageChange}
                    />
                </div>
            </div>
        </section>
    );
}
