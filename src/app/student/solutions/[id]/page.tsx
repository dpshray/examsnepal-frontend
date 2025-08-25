'use client';
import {use, useCallback, useEffect, useState} from "react";
import examService from "@/services/ExamService/ExamService";
import {QuestionCard} from "@/components/Exams/QuestionCard";
import {StudentBannerHeader} from "@/components/banner/header";
import {Button} from "@/components/ui/button";
import {router} from "next/client";
import LogoLoading from "@/lib/LogoLoading";

export default function ViewSolution({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const [solution, setSolution] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchSolution = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await examService.getExamById({id: Number(id), page});
            console.log(`Solution Response `, res);
            setSolution(res?.data?.data || null);
            setTotalPages(Math.ceil(res?.data?.total / 10));
        } catch (err) {
            setError("Failed to fetch solutions data");
        } finally {
            setLoading(false);
        }

    }, [id]);

    useEffect(() => {
        fetchSolution(currentPage);
    }, [currentPage, fetchSolution]);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [currentPage]);

    if (loading) return <LogoLoading/>;
    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-500">{error}</h1>
            <div className={' flex items-center justify-center space-x-2'}>
                <Button onClick={() => setCurrentPage(1)} variant={'destructive'}
                        className="mt-4">
                    Retry
                </Button>
                <Button onClick={() => router.push('/student/exams/mock-tests')} className="mt-4 primary-btn">
                    Go Back
                </Button>
            </div>
        </div>
    )

    const handleNext = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevious = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    return (
        <section>
            <div className={'w-full'}>
                <StudentBannerHeader
                    title={' Sprint Quiz'}
                    subtitle={'Get instant answers to your questions'}
                    className={'bg-gradient-to-r from-teal-200 to-teal-400 text-white'}
                    textClassName={'text-white'}
                />
                <div className={'max-w-5xl mx-auto my-6 md:my-10 container space-y-2 shadow-md p-3'}>
                    <div className={' flex flex-col items-center justify-center'}>
                        <h1 className={' text-2xl font-bold text-gray-900 mb-2'}>
                            Total Questions: {solution?.length}
                        </h1>
                        <h2 className={' text-3xl font-medium text-gray-900 mb-2 font-poppins'}>
                            <span className={'text-2xl font-semibold'}>Solution</span>
                            <span className={'text-sm text-gray-500'}> ({totalPages} pages)</span>
                        </h2>
                    </div>
                    {
                        solution?.map((question: any, index: number) => {
                                const options = question.options.map((opt: any) => ({
                                    label: opt.option,
                                    value: String(opt.id),
                                    isCorrect: Boolean(opt.value),
                                }));
                                const selectedAnswer = question?.user_choosed
                                    ? String(question.user_choosed)
                                    : undefined;
                                return (
                                    <QuestionCard key={question.id} questionNumber={(currentPage - 1) * 10 + index + 1}
                                                  questionText={question?.question}
                                                  options={options}
                                                  selectedValue={selectedAnswer}
                                                  showFeedback={true}
                                                  correctAnswers={options.filter((opt: any) => opt.isCorrect).map((opt: any) => opt.value)}
                                                  explanation={question?.explanation}
                                                  onSelect={function (value: string): void {
                                                  }}
                                                  id={question?.id}
                                    />
                                )

                            }
                        )
                    }


                    {/* Navigation & Submit */}
                    <div className="flex justify-between mt-4">
                        <Button onClick={handlePrevious} disabled={currentPage === 1} variant="secondary"
                                className={'border border-gray-300'}>
                            Previous
                        </Button>
                        <Button onClick={handleNext} disabled={currentPage === totalPages} className="primary-btn">
                            Next
                        </Button>
                    </div>
                </div>


            </div>
        </section>
    );
}
