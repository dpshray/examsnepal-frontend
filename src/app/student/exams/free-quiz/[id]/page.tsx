'use client';
import {use, useEffect, useState} from 'react';
import QuizEngine from '@/components/Exams/ExamPaper';
import mockTestService from '@/services/ExamService/MockTest';
import {StudentBannerHeader} from '@/components/banner/header';
import {useRouter} from 'next/navigation';
import freeQuizServices from '@/services/ExamService/FreeQuiz';

export default function GetFreeQuizById({params}: { params: Promise<{ id: number }> }) {
    const {id} = use(params);
    const idNumber = Number(id);


    const [quiz, setQuiz] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [token, setToken] = useState<string>('');


    useEffect(() => {
        const fetchQuiz = async (page: number, tokenToUse: string | null) => {
            setLoading(true);
            try {
                const response = await freeQuizServices.getFreeQuizById({
                    id: idNumber,
                    page: page,
                    token: tokenToUse as string,
                });
                console.log(' Response form freequiz',response)
                setQuiz(response?.data?.data);
                setTotalPages(Math.ceil(response?.data?.total / 10));
                setTotalQuestions(response?.data?.total || 0);
                setToken(response.data.token);
                console.log(`currentPage ${page}  token ${token} quiz`, response.data);
            } catch (err:any) {
                if (err?.status===409){
                    return
                }
                console.error('Error fetching Free quiz:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchQuiz(currentPage, token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);


    const submitQuiz = async (payload: {
        exam_id: number;
        question_ids: number[];
        question_id: string[];
        option_id: string[];
    }) => {
        try {
            const res = await mockTestService.submitExam(payload);
            setCorrectAnswers(res?.data?.correct_answer || 0);
        } catch (err) {
            console.error('Error submitting sprint quiz:', err);
        }
    };

    const handleNextAction = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            console.log(`Next Page ${nextPage}`);
        }
    };

    const handlePrevAction = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
        }
        console.log(`Prev Page ${currentPage}`);
    };


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
                onNextAction={handleNextAction}
                onPrevAction={handlePrevAction}
                onSubmitAction={submitQuiz}
                setCurrentPageAction={setCurrentPage}
            />
        </div>
    );
}
