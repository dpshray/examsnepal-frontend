'use client';
import {use, useCallback, useEffect, useRef, useState} from 'react';
import QuizEngine from '@/components/Exams/ExamPaper';
import mockTestService from '@/services/ExamService/MockTest';
import {StudentBannerHeader} from '@/components/banner/header';
import freeQuizServices from '@/services/ExamService/FreeQuiz';
import ExamInterrupted from '@/lib/ExamInterrupted';
import { toast } from 'sonner';
import { EXAM_DURATION_SECONDS } from '@/lib/examDurations';

export default function GetFreeQuizById({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const idNumber = Number(id);
    const isInitialMount = useRef(true);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const tokenRef = useRef<string | null>(null);    
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [interrupted, setInterrupted] = useState(false);

    const fetchQuiz = useCallback(async () => {
        if (interrupted) return;
        setLoading(true);
        try {
            const response = await freeQuizServices.getFreeQuizById({id: idNumber, page: currentPage, token: tokenRef.current});
            console.log(' Response form freequiz',response)
            if (response?.status === 409 || (response?.status === false && (response?.message?.includes("already been completed")))) {
                setInterrupted(true);
                toast.error("Exam session interrupted");
                return;
            }

            setQuiz(response?.data?.data);
            if (response?.data?.token) {
                tokenRef.current = response.data.token; 
            }
            setTotalPages(Math.ceil(response?.data?.total / 10));
            setTotalQuestions(response?.data?.total || 0);
        } catch (err:any) {
            if (err?.status === 409 || err?.response?.status === 409) {
                setInterrupted(true);
                toast.error("Exam session interrupted");
                return;
            }
            console.error('Error fetching Free quiz:', err);
        } finally {
            setLoading(false);
        }
    }, [idNumber, currentPage, interrupted]);

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

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchQuiz();
        }
    }, [fetchQuiz]);

    return (
        <div className="w-full">
            <StudentBannerHeader
                title="Free Quiz"
                subtitle="Get instant answers to your questions"
                className="bg-gradient-to-r from-teal-200 to-teal-400 text-white"
                textClassName="text-white"
            />

            {interrupted ? (
                <ExamInterrupted />
            ) : (
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
            )}
        </div>
    );
}
