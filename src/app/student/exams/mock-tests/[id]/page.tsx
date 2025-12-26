'use client';

import {use, useCallback, useEffect, useRef, useState} from 'react';
import {QuestionCard, QuestionCardSkeleton} from '@/components/Exams/QuestionCard';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import mockTestService from '@/services/ExamService/MockTest';
import {StudentBannerHeader} from "@/components/banner/header";
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import ExamInterrupted from '@/lib/ExamInterrupted';
import {MdWarningAmber} from 'react-icons/md';
import {EXAM_DURATION_SECONDS} from '@/lib/examDurations';
import {FormatExamTime} from "@/lib/utils";
import CustomPagination from "@/components/Pagination";
import {SOLUTIONS_ROUTE, STUDENT_SCORE_ROUTE} from "@/config/app-constant";

export default function GetMockTestById({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const idNumber = Number(id);
    const router = useRouter();
    const [quiz, setQuiz] = useState<any[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS.MOCK_TEST);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const tokenRef = useRef<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [interrupted, setInterrupted] = useState(false);

    const hasInitialized = useRef(false);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            fetchMockTest(1);
        }
    }, []);

    useEffect(() => {
        if (hasInitialized.current && currentPage > 1 && tokenRef.current) {
            fetchMockTest(currentPage);
        }
    }, [currentPage]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!isSubmitted) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSubmitted]);

    const fetchMockTest = useCallback(async (page: number) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        setLoading(true);
        setErrorMessage(null);

        try {
            const params = {
                id: idNumber,
                page: page,
                token: tokenRef.current
            };
            if (tokenRef.current && page === 1) {
                params.token = tokenRef.current;
            }

            const response = await mockTestService.getMockTestById(idNumber, params);
            console.log("fetchMockTest called", response);

            if (response?.status === 409 || response?.message?.includes("already been completed")) {
                setInterrupted(true);
                toast.error("Exam session interrupted");
                return;
            }

            if (response?.status === false) {
                const msg = response?.message || "You do not have an active subscription.";
                toast.error(msg);
                setErrorMessage(msg);
                setQuiz([]);
                setTotalQuestions(0);
                setTotalPages(0);
                return;
            }

            setQuiz(response?.data?.data || []);
            setTotalQuestions(response?.data?.total || 0);

            if (response?.data?.token && page === 1) {
                tokenRef.current = response.data.token;
            }

            const total = response?.data?.total || 0;
            setTotalPages(Math.ceil(total / 10));
        } catch (err: any) {
            console.error("Error fetching mock test:", err);

            if (err?.status === 409 || err?.response?.status === 409) {
                setInterrupted(true);
                toast.error("Exam session interrupted");
                return;
            }

            const backendMsg = err?.data?.message || "Something went wrong fetching mock test.";
            setErrorMessage(backendMsg);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [idNumber]);

    const handleSelect = (qid: number) => (value: string) => {
        setSelectedAnswers(prev => ({...prev, [qid]: value}));
    };


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);

    const handleSubmit = useCallback(async () => {
        if (isSubmitted) return;

        const exam_id = idNumber;
        const totalQuestionId: number[] = [];
        const selectedOptionId: number[] = [];
        const selectedQuestionId: number[] = [];

        const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
            question_id: questionId,
            option_id: optionId,
        }));

        answers.forEach((answer: any) => {
            selectedOptionId.push(answer.option_id);
            selectedQuestionId.push(answer.question_id);
        });

        quiz.forEach((q: any) => {
            totalQuestionId.push(q.id);
        });

        const payload = {
            'exam_id': exam_id,
            'question_ids': totalQuestionId,
            'question_id': selectedQuestionId,
            'option_id': selectedOptionId,
            token: tokenRef.current
        };

        try {
            const res = await mockTestService.submitExam(payload);
            console.log('Mock Quiz submitted:', res?.data);

            router.push(`${STUDENT_SCORE_ROUTE}/${idNumber}`);
        } catch (err) {
            console.error('Error submitting exam:', err);
            toast.error('Failed to submit exam');
        }

        let total = 0;
        quiz.forEach(q => {
            const selected = selectedAnswers[q.id];
            const correctOptions = q.options.filter((o: any) => o.isCorrect).map((o: any) => o.value);
            if (correctOptions.length === 1 && selected === correctOptions[0]) total += 1;
        });

        setScore(total);
        setIsSubmitted(true);
        setTimeLeft(0);
        toast.success('Exam submitted!');
    }, [quiz, selectedAnswers, isSubmitted, idNumber]);

    useEffect(() => {
        if (interrupted) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, handleSubmit, interrupted]);



    if (interrupted) {
        return <ExamInterrupted/>;
    }

    return (
        <section className="w-full min-h-screen">
            <StudentBannerHeader
                title="Mock Test"
                subtitle="Take your mock test and get ready for the real exam."
                imageSrc="/book.png"
                className={'bg-linear-to-r from-teal-400 to-teal-600  text-black'}
                textClassName={'text-black'}
            />
            <div className="max-w-7xl mx-auto my-6 md:my-10">
                {quiz.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {errorMessage === "You do not have an active subscription."
                                ? "You don't have an active subscription"
                                : errorMessage || "No questions found"}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {errorMessage === "You do not have an active subscription."
                                ? "Subscribe now to unlock Sprint Quizzes and start practicing."
                                : "Please contact support or try again later."}
                        </p>

                        {errorMessage === "You do not have an active subscription." && (
                            <Button
                                onClick={() => router.push("/student/subscription")}
                                className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition"
                            >
                                Get Subscription
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="w-full bg-white rounded-lg shadow p-6 md:p-6">
                        <div
                            className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-md text-sm font-medium">
                            <MdWarningAmber className='w-4 h-4'/> Once the exam starts, refreshing the page, closing the
                            browser, or leaving this page will automatically submit your exam.
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-6">
                            <div className="flex items-center gap-4">
                                <Image src="/book.svg" alt="Exam book icon" width={48} height={48}/>
                                <p className="text-sm text-muted-foreground">Question <span
                                    className="font-semibold">{quiz.length}</span> Total</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Time Left:</p>
                                <div className="flex items-center justify-center gap-1 font-medium text-xl">
                                    <span>{FormatExamTime(timeLeft)}</span>
                                </div>
                            </div>
                            <Image src="/exam.png" alt="Exam visual" width={48} height={48}/>
                        </div>
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex flex-col gap-4">
                                    {[...Array(10)].map((_, index) => <QuestionCardSkeleton key={index}/>)}
                                </div>
                            ) : (
                                quiz.map((q: any, index: number) => (
                                    <QuestionCard
                                        key={q.id}
                                        questionNumber={(currentPage - 1) * 10 + index + 1}
                                        questionText={q.question}
                                        options={q.options.map((opt: any) => ({
                                            label: opt.option,
                                            value: opt.id,
                                            isCorrect: opt.value === 1
                                        }))}
                                        onSelect={handleSelect(q.id)}
                                        selectedValue={selectedAnswers[q.id]}
                                        showFeedback={showResult}
                                        correctAnswers={q.options.filter((opt: any) => opt.value === 1).map((opt: any) => opt.id)}
                                        explanation={q.explanation}
                                    />
                                ))
                            )}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <CustomPagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        onPageChangeAction={handlePageChange}
                                    />
                                </div>
                            )}
                            {currentPage === totalPages && !isSubmitted && (
                                <>
                                    <div className="mt-4 flex items-center">
                                        <Checkbox
                                            checked={isAgreedToTerms}
                                            onCheckedChange={(e: boolean) => setIsAgreedToTerms(e)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">
                                            I agree to the{' '}
                                            <a
                                                href="#"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 capitalize"
                                            >
                                                terms and conditions
                                            </a>
                                        </span>
                                    </div>
                                    <Button
                                        className="w-full mt-4 sm:w-auto primary-btn"
                                        onClick={handleSubmit}
                                        disabled={!isAgreedToTerms || loading}
                                    >
                                        Submit Exam
                                    </Button>
                                </>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}