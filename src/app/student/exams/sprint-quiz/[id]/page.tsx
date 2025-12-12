'use client';
import {use, useCallback, useEffect, useState} from "react";
import QuizEngine from "@/components/Exams/ExamPaper";
import sprintQuizServices from "@/services/ExamService/SprintQuiz";
import mockTestService from "@/services/ExamService/MockTest";
import {StudentBannerHeader} from "@/components/banner/header";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ExamInterrupted from "@/lib/ExamInterrupted";

export default function GetSprintQuizById({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const idNumber = Number(id);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [interrupted, setInterrupted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const storageKey = `sprint_exam_in_progress_${idNumber}`;

    useEffect(() => {
        const running = localStorage.getItem(storageKey);
        const submitted = localStorage.getItem(`${storageKey}_submitted`);

        if (running === "true" && !submitted) {
            setInterrupted(true);
            return;
        }

        localStorage.setItem(storageKey, "true");

        return () => {
            if (!submitted) {
                localStorage.removeItem(storageKey);
            }
        };
    }, []);

    const fetchQuiz = useCallback(async () => {
        if (interrupted) return;
        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await sprintQuizServices.getSprintQuizById({id: idNumber, page: currentPage, token});
            console.log("fetchQuiz called");

            if (res?.status === false) {
                const msg = res?.message || "You do not have an active subscription.";
                toast.error(msg);
                setErrorMessage(msg); 
                setQuiz([]);
                setTotalQuestions(0);
                setTotalPages(0);
                return;
            }

            console.log(`Sprint Quiz Response `, res);
            setQuiz(res?.data?.data || []);
            if (res?.data?.token) setToken(res.data.token);
            setTotalPages(Math.ceil(res?.data?.total / 10));
            setTotalQuestions(res?.data?.total || 0);
            console.log(`Sprint Quiz `, res?.data?.data);
        } catch (err: any) {
            console.error("Error fetching sprint test:", err);
            const backendMsg = err?.data.message || "Something went wrong fetching sprint test.";
            // toast.error(backendMsg);
            setErrorMessage(backendMsg);
        } finally {
            setLoading(false);
        }
    }, [idNumber, currentPage, token]);

    const submitQuiz = async (payload: {
        exam_id: number;
        question_ids: number[];
        question_id: string[];
        option_id: string[];
    }) => {
        try {
            const res = await mockTestService.submitExam(payload);
            console.log(`Sprint Quiz Submit Response `, res);
            setCorrectAnswers(res?.data?.correct_answered);

        } catch (err) {
            console.error("Error submitting sprint quiz:", err);
        }
    };
    
    useEffect(() => {
        console.log('fetchQuiz running');
        fetchQuiz();
    }, [fetchQuiz]);

    return (
        <div className={'w-full'}>
            <StudentBannerHeader
                title={' Sprint Quiz'}
                subtitle={'Get instant answers to your questions'}
                className={'bg-gradient-to-r from-teal-200 to-teal-400 text-white'}
                textClassName={'text-white'}
            />

            {interrupted && (
                <ExamInterrupted storageKey={storageKey}/>
            )}


            {!interrupted && (
                <>
                    {quiz.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {errorMessage || "No questions found"}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Please contact support or try again later.
                            </p>
                        </div>
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
                            storageKey={storageKey}
                        />
                    )}
                </>
            )}
        </div>
    )
        ;
}