import {useCallback, useEffect, useState} from "react";
import freeQuizServices from "@/services/ExamService/FreeQuiz";

const useFreeCompletedQuizzes = (initialPage: number = 1) => {
    const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
    const [completedTotalPages, setCompletedTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    const fetchCompletedQuizzes = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await freeQuizServices.getCompleteFreeQuizzes(page);
            setCompletedQuizzes(response.data?.data || []);
            setCompletedTotalPages(response.data?.last_page || 1);
            console.log(`Completed Quizzes`, response?.data?.data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching completed quizzes:", err);
            setError("Failed to load quizzes. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompletedQuizzes(currentPage);
    }, [fetchCompletedQuizzes, currentPage]);

    return {
        completedQuizzes,
        completedTotalPages,
        currentPage,
        loading,
        error,
        fetchCompletedQuizzes,
        setCurrentPage,
    };
};

export default useFreeCompletedQuizzes;
