import { useCallback, useEffect, useState } from "react";
import sprintQuizServices from "@/services/ExamService/SprintQuiz";

const useSprintCompletedQuizzes = (initialPage: number = 1) => {
    const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
    const [completedSprintTotalPages, setCompletedSprintTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompletedSprintQuizzes = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await sprintQuizServices.getCompleteSprintQuizzes(page);
            setCompletedQuizzes(response.data?.data || []);
            setCompletedSprintTotalPages(response.data?.meta?.totalPages || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching completed sprint quizzes:", err);
            setError("Failed to load sprint quizzes. Please try again later.");
            setCompletedQuizzes([]);
            setCompletedSprintTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompletedSprintQuizzes(currentPage);
    }, [currentPage, fetchCompletedSprintQuizzes]);

    return {
        completedQuizzes,
        completedSprintTotalPages,
        currentPage,
        loading,
        error,
        fetchCompletedSprintQuizzes,
        setCurrentPage,
    };
};

export default useSprintCompletedQuizzes;
