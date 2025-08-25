'use client';
import {use, useCallback, useEffect, useState} from "react";
import QuizEngine from "@/components/Exams/ExamPaper";
import sprintQuizServices from "@/services/ExamService/SprintQuiz";
import mockTestService from "@/services/ExamService/MockTest";
import {StudentBannerHeader} from "@/components/banner/header";
import {useRouter} from "next/navigation";

export default function GetSprintQuizById({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const idNumber = Number(id);
    const router = useRouter();
    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);


    const fetchQuiz = useCallback(async () => {
        setLoading(true);

        try {
            const res = await sprintQuizServices.getSprintQuizById({id: idNumber, page: currentPage, token});
            console.log(`Sprint Quiz Response `, res);
            setQuiz(res?.data?.data || []);
            if (res?.data?.token) setToken(res.data.token);
            setTotalPages(Math.ceil(res?.data?.total / 10));
            setTotalQuestions(res?.data?.total || 0);
            console.log(`Sprint Quiz `, res?.data?.data);
        } catch (err) {
            console.error(err);

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
        fetchQuiz();
    }, [fetchQuiz]);

console.log(correctAnswers)

    return (
        <div className={'w-full'}>
            <StudentBannerHeader
                title={' Sprint Quiz'}
                subtitle={'Get instant answers to your questions'}
                className={'bg-gradient-to-r from-teal-200 to-teal-400 text-white'}
                textClassName={'text-white'}
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
                onSubmitAction={submitQuiz} setCurrentPageAction={setCurrentPage}
            />
        </div>
    )
        ;
}