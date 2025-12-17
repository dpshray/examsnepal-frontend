'use client';
import {use, useCallback, useEffect, useRef, useState} from 'react';
import QuizEngine from '@/components/Exams/ExamPaper';
import mockTestService from '@/services/ExamService/MockTest';
import {StudentBannerHeader} from '@/components/banner/header';
import freeQuizServices from '@/services/ExamService/FreeQuiz';
import { EXAM_DURATION_SECONDS } from '@/lib/examDurations';
import { toast } from 'sonner';
import ExamInterrupted from '@/lib/ExamInterrupted';

export default function GetFreeQuizById({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const idNumber = Number(id);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const tokenRef = useRef<string | null>(null);    
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [interrupted, setInterrupted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const hasInitialized = useRef(false);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            fetchQuiz(1);
        }
    }, []);

    useEffect(() => {
        if (hasInitialized.current && currentPage > 1 && tokenRef.current) {
            fetchQuiz(currentPage);
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


    const fetchQuiz = useCallback(async (page: number) => {
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
            const response = await freeQuizServices.getFreeQuizById(idNumber, params);
            console.log(' Response form freequiz',response)
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
        } catch (err:any) {
            console.error('Error fetching Free quiz:', err);

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

    const submitQuiz = async (payload: {
        exam_id: number;
        question_ids: number[];
        question_id: string[];
        option_id: string[];
    }) => {
        try {
            const res = await mockTestService.submitExam(payload);
            setCorrectAnswers(res?.data?.correct_answered || 0);
        } catch (err) {
            console.error('Error submitting sprint quiz:', err);
        }
    };

    if (interrupted) {
        return <ExamInterrupted/>;
    }

    return (
        <div className="w-full">
            <StudentBannerHeader
                title="Free Quiz"
                subtitle="Get instant answers to your questions"
                className="bg-linear-to-r from-teal-200 to-teal-400 text-white"
                textClassName="text-white"
            />

                <QuizEngine
                    quiz={quiz}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalQuestions={totalQuestions}
                    correctAnswers={correctAnswers}
                    loading={loading}
                    examId={idNumber}
                    onNextAction={() => setCurrentPage((prev) => prev + 1)}
                    onPrevAction={() => setCurrentPage((prev) => prev - 1)}
                    onSubmitAction={submitQuiz}
                    setCurrentPageAction={setCurrentPage}
                    duration={EXAM_DURATION_SECONDS.FREE_TEST}
                />
            
        </div>
    );
}
