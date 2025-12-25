'use client';
import {use, useCallback, useEffect, useRef, useState} from "react";
import QuizEngine from "@/components/Exams/ExamPaper";
import sprintQuizServices from "@/services/ExamService/SprintQuiz";
import mockTestService from "@/services/ExamService/MockTest";
import {StudentBannerHeader} from "@/components/banner/header";
import {toast} from "sonner";
import ExamInterrupted from "@/lib/ExamInterrupted";
import {EXAM_DURATION_SECONDS} from "@/lib/examDurations";
import {useRouter} from "next/navigation";

export default function GetSprintQuizById({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const idNumber = Number(id);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const tokenRef = useRef<string | null>(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [interrupted, setInterrupted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

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
            const res = await sprintQuizServices.getSprintQuizById(idNumber, params);
            // console.log("fetchQuiz called");

            if (res?.status === 409 || (res?.status === false && (res?.message?.includes("already been completed")))) {
                setInterrupted(true);
                toast.error("Exam session interrupted");
                return;
            }

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
            setTotalQuestions(res?.data?.total || 0);

            if (res?.data?.token && page === 1) {
                tokenRef.current = res.data.token;
            }

            const total = res?.data?.total || 0;
            setTotalPages(Math.ceil(total / 10));
        } catch (err: any) {
            console.error("Error fetching sprint test:", err);

            if (err?.status === 409 || err?.response?.status === 409) {
                setInterrupted(true);
                toast.error("Exam session interrupted");
                return;
            }

            const backendMsg = err?.data.message || "Something went wrong fetching sprint test.";
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

        await mockTestService.submitExam(payload).then((res) => {
            console.log(`Sprint Quiz Submit Response `, res);
            router.push(`/student/scores/${idNumber}`);
        })
    }

    if (interrupted) {
        return <ExamInterrupted/>;
    }

    return (
        <div className={'w-full'}>
            <StudentBannerHeader
                title={' Sprint Quiz'}
                subtitle={'Get instant answers to your questions'}
                className={'bg-linear-to-r from-teal-200 to-teal-400 text-white'}
                textClassName={'text-white'}
            />

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
                    duration={EXAM_DURATION_SECONDS.SPRINT_TEST}
                />
            )}
        </div>
    )
        ;
}