'use client';
import {use, useCallback, useEffect, useState} from 'react';
import QuizEngine from '@/components/Exams/ExamPaper';
import mockTestService from '@/services/ExamService/MockTest';
import {StudentBannerHeader} from '@/components/banner/header';
import freeQuizServices from '@/services/ExamService/FreeQuiz';

export default function GetFreeQuizById({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const idNumber = Number(id);

    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [token, setToken] = useState<string>('');
    const [correctAnswers, setCorrectAnswers] = useState(0);


    const fetchQuiz = useCallback(async () => {
        setLoading(true);
        try {
            const response = await freeQuizServices.getFreeQuizById({id: idNumber, page: currentPage, token});
            console.log(' Response form freequiz',response)
            setQuiz(response?.data?.data);
            setTotalPages(Math.ceil(response?.data?.total / 10));
            setTotalQuestions(response?.data?.total || 0);
            setToken(response.data.token);
        } catch (err:any) {
            if (err?.status===409){
                return
            }
            console.error('Error fetching Free quiz:', err);
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
            setCorrectAnswers(res?.data?.correct_answered || 0);
        } catch (err) {
            console.error('Error submitting sprint quiz:', err);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    return (
        <div className="w-full">
            <StudentBannerHeader
                title="Free Quiz"
                subtitle="Get instant answers to your questions"
                className="bg-gradient-to-r from-teal-200 to-teal-400 text-white"
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
            />
        </div>
    );
}
