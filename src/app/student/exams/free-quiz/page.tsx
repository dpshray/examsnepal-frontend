'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {StudentBannerHeader} from '@/components/banner/header';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {QuizCompletedCard, QuizPendingCard, QuizTestCardSkeleton} from '@/components/Exams/exam-card';
import {QUIZ_TYPES, QuizType} from '@/lib/Constan';
import freeQuizServices from '@/services/ExamService/FreeQuiz';
import CustomPagination from '@/components/Pagination';
import {CheckCheckIcon, ClockIcon} from 'lucide-react';
import {toast} from 'sonner';
import {FREE_QUIZ_ROUTE} from "@/config/app-constant";

interface Quiz {
    id: number;
    exam_name: string;
    status: string;
    questions_count: number;
    correct_marking_point: number;
    is_negative_marking: boolean;
    negative_marking_point: number;
    players: any;
    user: {
        id: number;
        fullname: string;
    };
}

interface QuizResponse {
    data: Quiz[];
    last_page: number;
    current_page: number;
    total: number;
}

export default function FreeQuiz() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [selectedTab, setSelectedTab] = useState<QuizType>(QUIZ_TYPES.PENDING);
    const [pendingPage, setPendingPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);

    const {
        data: pendingData,
        isLoading: pendingLoading,
        error: pendingError,
        refetch: refetchPendingData
    } = useQuery<QuizResponse>({
        queryKey: ['pendingQuizzes', pendingPage],
        queryFn: async () => {
            const res = await freeQuizServices.getPendingFreeQuizzes(pendingPage);
            return res.data;
        },
        enabled: selectedTab === QUIZ_TYPES.PENDING,
        staleTime: 0,
        gcTime: 0,
    });

    const {
        data: completedData,
        isLoading: completedLoading,
        error: completedError,
        refetch: refetchCompletedData
    } = useQuery<QuizResponse>({
        queryKey: ['completedQuizzes', completedPage],
        queryFn: async () => {
            const res = await freeQuizServices.getCompleteFreeQuizzes(completedPage);
            return res.data;
        },
        enabled: selectedTab === QUIZ_TYPES.COMPLETED,
        staleTime: 0,
        gcTime: 0,
    });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['pendingQuizzes'] });
        queryClient.invalidateQueries({ queryKey: ['completedQuizzes'] });
    }, []);

    useEffect(() => {
        if (selectedTab === QUIZ_TYPES.PENDING) {
            setPendingPage(1);
            queryClient.invalidateQueries({ queryKey: ['pendingQuizzes'] });
        } else {
            setCompletedPage(1);
            queryClient.invalidateQueries({ queryKey: ['completedQuizzes'] });
        }
    }, [selectedTab, queryClient]);

    useEffect(() => {
        if (pendingError) {
            toast.error('Failed to load pending quizzes. Please try again.');
        }
        if (completedError) {
            toast.error('Failed to load completed quizzes. Please try again.');
        }
    }, [pendingError, completedError]);

    const handleTabChange = (val: string) => {
        if (val === QUIZ_TYPES.PENDING || val === QUIZ_TYPES.COMPLETED) {
            setSelectedTab(val);
            if (val === QUIZ_TYPES.PENDING) {
                setPendingPage(1);
            } else {
                setCompletedPage(1);
            }
        }
    };

    const handleViewAllScores = (quizId: number) => {
        router.push(`${process.env.NEXT_PUBLIC_STUDENT_SCORE_ROUTE}/${quizId}`);
    };

    const handleTakeTest = (quizId: number) => {
        router.push(`${FREE_QUIZ_ROUTE}/${quizId}`);
    };

    const handleViewSolution = (quizId: number) => {
        router.push(`${process.env.NEXT_PUBLIC_SOLUTIONS_ROUTE}/${quizId}`);
    };

    const isPending = selectedTab === QUIZ_TYPES.PENDING;
    const isLoading = isPending ? pendingLoading : completedLoading;
    const currentData = isPending ? pendingData : completedData;
    const currentPage = isPending ? pendingPage : completedPage;
    const setCurrentPage = isPending ? setPendingPage : setCompletedPage;

    return (
        <main className="w-full min-h-screen">
            <StudentBannerHeader
                title="Free Quiz"
                imageSrc="/images/exams.png"
                subtitle="Trusted by 20,000+ students and teachers"
                textClassName="text-gray-900"
            />

            <section className="text-center p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
                <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    Take a Free Quiz & Boost Your Confidence
                </h1>
                <p className="font-poppins text-sm sm:text-base md:text-lg text-gray-700 mt-3 md:mt-4 max-w-2xl mx-auto">
                    Our free quizzes are designed to help you assess your knowledge and prepare for your exams
                    effectively.
                </p>
            </section>

            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-4 w-full">
                    <ScrollArea className="w-full">
                        <TabsList
                            className="before:bg-border relative mb-4 md:mb-6 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                            <TabsTrigger
                                value={QUIZ_TYPES.PENDING}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base data-[state=active]:z-10 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                            >
                                <ClockIcon size={16} className="me-2 opacity-60" aria-hidden="true"/>
                                <span className="hidden sm:inline">Pending Free Quiz</span>
                                <span className="sm:hidden">Pending</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value={QUIZ_TYPES.COMPLETED}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base data-[state=active]:z-10 data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                            >
                                <CheckCheckIcon size={16} className="me-2 opacity-60" aria-hidden="true"/>
                                <span className="hidden sm:inline">Completed Free Quiz</span>
                                <span className="sm:hidden">Completed</span>
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>

                    <TabsContent value={QUIZ_TYPES.PENDING} className="mt-6">
                        {isLoading ? (
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
                                role="status"
                                aria-label="Loading pending quizzes"
                            >
                                {Array.from({length: 6}).map((_, index) => (
                                    <QuizTestCardSkeleton key={`pending-skeleton-${index}`}/>
                                ))}
                            </div>
                        ) : currentData?.data && currentData.data.length > 0 ? (
                            <>
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                                    {currentData.data.map((quiz) => (
                                        <QuizPendingCard
                                            key={`pending-${quiz.id}`}
                                            exam={quiz}
                                            onViewAllScoresAction={handleViewAllScores}
                                            onTakeTestAction={handleTakeTest}
                                        />
                                    ))}
                                </div>
                                {currentData.last_page > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <CustomPagination
                                            className={'justify-end'}
                                            totalPages={currentData.last_page}
                                            currentPage={currentPage}
                                            onPageChangeAction={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center py-16 px-4 text-center"
                                role="status"
                            >
                                <ClockIcon size={48} className="text-gray-400 mb-4" aria-hidden="true"/>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                                    No Pending Quizzes
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 max-w-md">
                                    You have completed all available quizzes. Check back later for new quizzes.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value={QUIZ_TYPES.COMPLETED} className="mt-6">
                        {isLoading ? (
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
                                role="status"
                                aria-label="Loading completed quizzes"
                            >
                                {Array.from({length: 6}).map((_, index) => (
                                    <QuizTestCardSkeleton key={`completed-skeleton-${index}`}/>
                                ))}
                            </div>
                        ) : currentData?.data && currentData.data.length > 0 ? (
                            <>
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                                    {currentData.data.map((quiz) => (
                                        <QuizCompletedCard
                                            key={`completed-${quiz.id}`}
                                            exam={quiz}
                                            onViewAllScoresAction={handleViewAllScores}
                                            onViewSolutionAction={handleViewSolution}
                                        />
                                    ))}
                                </div>
                                {currentData.last_page > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <CustomPagination
                                            className={'justify-end'}
                                            totalPages={currentData.last_page}
                                            currentPage={currentPage}
                                            onPageChangeAction={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center py-16 px-4 text-center"
                                role="status"
                            >
                                <CheckCheckIcon size={48} className="text-gray-400 mb-4" aria-hidden="true"/>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                                    No Completed Quizzes
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 max-w-md">
                                    You haven&apos;t completed any quizzes yet. Start taking quizzes to see them here.
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
