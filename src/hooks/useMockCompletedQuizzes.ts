import {useCallback, useEffect, useState} from "react";
import mockTestService from "@/services/ExamService/MockTest";

const useMockCompletedQuizzes = (initialPage: number = 1) => {
    const [completedMockQuizzes, setCompletedMockQuizzes] = useState<any[]>([]);
    const [completedMockTotalPages, setCompletedMockTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [loadingMock, setLoadingMock] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompletedMockQuizzes = useCallback(async (page: number) => {
        setLoadingMock(true);
        setError(null);
        try {
            const response = await mockTestService.getCompletedMockTests(page);
            setCompletedMockQuizzes(response.data?.data || []);
            setCompletedMockTotalPages(response.data?.last_page || 1);
            console.log(`Completed Mock Tests`, response.data?.data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching completed mock tests:", err);
            setError("Failed to load mock tests. Please try again later.");
            setCompletedMockQuizzes([]);
            setCompletedMockTotalPages(1);
        } finally {
            setLoadingMock(false);
        }
    }, []);

    useEffect(() => {
        fetchCompletedMockQuizzes(currentPage);
    }, [fetchCompletedMockQuizzes, currentPage]);

    return {
        completedMockQuizzes,
        completedMockTotalPages,
        currentPage,
        loadingMock,
        error,
        fetchCompletedMockQuizzes,
        setCurrentPage,
    };
};

export default useMockCompletedQuizzes;
