'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {StudentBannerHeader} from "@/components/banner/header";
import {QuizCompletedCard, QuizPendingCard, QuizTestCardSkeleton} from "@/components/Exams/exam-card";
import {QUIZ_TYPES, QuizType} from "@/lib/Constan";
import mockTestService from "@/services/ExamService/MockTest";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {CheckCheckIcon, ClockIcon} from "lucide-react";
import CustomPagination from "@/components/Pagination";
import {toast} from "sonner";
import {MOCK_TEST_ROUTE, SOLUTIONS_ROUTE, STUDENT_SCORE_ROUTE} from "@/config/app-constant";

interface MetaData {
    totalPages: number;
    currentPage: number;
    [key: string]: any;
}

export default function MockTestPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [selectedTab, setSelectedTab] = useState<QuizType>(QUIZ_TYPES.PENDING);
    const [pendingPage, setPendingPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);

    const {data: pendingData, isLoading: isPendingLoading} = useQuery({
        queryKey: ['pendingQuizzes', pendingPage],
        queryFn: async () => {
            const response = await mockTestService.getPendingMockTests(pendingPage);
            return {
                data: response.data.data,
                totalPages: Math.ceil(response?.data?.total / 10),
                currentPage: pendingPage
            };
        },
        enabled: selectedTab === QUIZ_TYPES.PENDING,
        staleTime: 0,
        gcTime: 0,
    });

    const {data: completedData, isLoading: isCompletedLoading} = useQuery({
        queryKey: ['completedQuizzes', completedPage],
        queryFn: async () => {
            const response = await mockTestService.getCompletedMockTests(completedPage);
            return {
                data: response.data.data,
                totalPages: Math.ceil(response?.data?.total / 10),
                currentPage: completedPage
            };
        },
        enabled: selectedTab === QUIZ_TYPES.COMPLETED,
        staleTime: 0,
        gcTime: 0,
    });

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
        queryClient.invalidateQueries({ queryKey: ['pendingQuizzes'] });
        queryClient.invalidateQueries({ queryKey: ['completedQuizzes'] });
    }, []);

    const handleTabChange = (tab: string) => {
        if (tab === QUIZ_TYPES.PENDING || tab === QUIZ_TYPES.COMPLETED) {
            setSelectedTab(tab as QuizType);
        }
    };

    const handleViewAllScoresAction = (quizId: number) => {
        router.push(`${STUDENT_SCORE_ROUTE}/${quizId}`);
    };

    const handleTakeTestAction = (quizId: number) => {
        toast.success('Quiz started successfully');
        router.push(`${MOCK_TEST_ROUTE}/${quizId}`);
    };

    const handleViewSolutionAction = (quizId: number) => {
        router.push(`${SOLUTIONS_ROUTE}/${quizId}`);
    };

    const handlePageChange = (page: number) => {
        if (selectedTab === QUIZ_TYPES.PENDING) {
            setPendingPage(page);
        } else {
            setCompletedPage(page);
        }
    };

    return (
        <main className="w-full">
            <StudentBannerHeader
                title="Mock Test"
                imageSrc="/images/exams.png"
                subtitle="Trusted by 20,000+ students and teachers"
                textClassName="text-gray-900"
            />

            <section className="text-center p-4 max-w-5xl mx-auto">
                <h1 className="font-poppins text-3xl md:text-4xl font-bold leading-snug">
                    Attempt a Mock Test & Ace Your Preparation
                </h1>
                <p className="font-poppins text-base text-gray-700 mt-2 max-w-2xl mx-auto">
                    Our mock tests are designed to simulate real exam conditions and assess your readiness.
                </p>
            </section>

            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 pb-8">
                <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-4">
                    <ScrollArea>
                        <TabsList
                            className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                            <TabsTrigger
                                value={QUIZ_TYPES.PENDING}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                            >
                                <ClockIcon size={16} className="me-2 opacity-60"/>
                                Pending Mock Test
                            </TabsTrigger>
                            <TabsTrigger
                                value={QUIZ_TYPES.COMPLETED}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                            >
                                <CheckCheckIcon size={16} className="me-2 opacity-60"/>
                                Completed Mock Test
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>

                    <TabsContent value={QUIZ_TYPES.PENDING}>
                        {isPendingLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({length: 6}).map((_, index) => (
                                    <QuizTestCardSkeleton key={index}/>
                                ))}
                            </div>
                        ) : (
                            <>
                                {pendingData?.data && pendingData.data.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {pendingData.data.map((exam: any) => (
                                            <QuizPendingCard
                                                key={exam.id}
                                                exam={exam}
                                                onViewAllScoresAction={handleViewAllScoresAction}
                                                onTakeTestAction={handleTakeTestAction}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No pending mock tests available</p>
                                    </div>
                                )}

                                {pendingData && pendingData.totalPages > 1 && (
                                    <div className="flex justify-center mt-6">
                                        <CustomPagination
                                            totalPages={pendingData.totalPages}
                                            currentPage={pendingData.currentPage}
                                            onPageChangeAction={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value={QUIZ_TYPES.COMPLETED}>
                        {isCompletedLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({length: 6}).map((_, index) => (
                                    <QuizTestCardSkeleton key={index}/>
                                ))}
                            </div>
                        ) : (
                            <>
                                {completedData?.data && completedData.data.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {completedData.data.map((exam: any) => (
                                            <QuizCompletedCard
                                                key={exam.id}
                                                exam={exam}
                                                onViewAllScoresAction={handleViewAllScoresAction}
                                                onViewSolutionAction={handleViewSolutionAction}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No completed mock tests available</p>
                                    </div>
                                )}

                                {completedData && completedData.totalPages > 1 && (
                                    <div className="flex justify-center mt-6">
                                        <CustomPagination
                                            totalPages={completedData.totalPages}
                                            currentPage={completedData.currentPage}
                                            onPageChangeAction={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
