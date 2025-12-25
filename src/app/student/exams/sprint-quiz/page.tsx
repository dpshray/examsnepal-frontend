'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import {StudentBannerHeader} from '@/components/banner/header';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {CheckCheckIcon, ClockIcon} from 'lucide-react';
import {QuizCompletedCard, QuizPendingCard, QuizTestCardSkeleton} from '@/components/Exams/exam-card';
import sprintQuizServices from '@/services/ExamService/SprintQuiz';
import CustomPagination from '@/components/Pagination';
import {QUIZ_TYPES, QuizType} from '@/lib/Constan';
import {toast} from 'sonner';
import {SOLUTIONS_ROUTE, SPRINT_QUIZ_ROUTE} from "@/config/app-constant";

export default function SprintQuiz() {
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState<QuizType>(QUIZ_TYPES.PENDING);
    const [pendingPage, setPendingPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);

    const {data: pendingData, isLoading: isPendingLoading, refetch: refetchPendingData} = useQuery({
        queryKey: ['pendingSprintQuizzes', pendingPage],
        queryFn: async () => {
            const res = await sprintQuizServices.getPendingSprintQuizzes(pendingPage);
            return {
                data: res.data.data || [],
                totalPages: res.data.meta?.totalPages || 1,
                currentPage: pendingPage
            };
        },
        enabled: selectedTab === QUIZ_TYPES.PENDING

    });

    const {data: completedData, isLoading: isCompletedLoading, refetch: refetchCompletedData} = useQuery({
        queryKey: ['completedSprintQuizzes', completedPage],
        queryFn: async () => {
            const res = await sprintQuizServices.getCompleteSprintQuizzes(completedPage);
            return {
                data: res.data.data || [],
                totalPages: res.data.meta?.totalPages || 1,
                currentPage: completedPage
            };
        },
        enabled: selectedTab === QUIZ_TYPES.COMPLETED
    });

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab as QuizType);
        if (tab === QUIZ_TYPES.PENDING) {
            setPendingPage(1);
            refetchPendingData()
        } else {
            setCompletedPage(1);
            refetchCompletedData()
        }
    };
    useEffect(() => {
        if (selectedTab === QUIZ_TYPES.PENDING) {
            refetchPendingData();
        } else {
            refetchCompletedData();
        }
    }, [selectedTab, pendingPage, completedPage, refetchPendingData, refetchCompletedData]);


    const handleTakeTestAction = (quizId: number) => {
        toast.success('Quiz started successfully');
        router.push(`${SPRINT_QUIZ_ROUTE}/${quizId}`);
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
                title="Sprint Quiz"
                imageSrc="/images/exams.png"
                subtitle="Trusted by 20,000+ students and teachers"
                textClassName="text-gray-900"
            />

            <section className="text-center p-4 max-w-5xl mx-auto">
                <h1 className="font-poppins text-3xl md:text-4xl font-bold leading-snug">
                    Take a Sprint Quiz & Improve Your Accuracy
                </h1>
                <p className="font-poppins text-base text-gray-700 mt-2 max-w-2xl mx-auto">
                    Sprint quizzes help you focus on speed and accuracy. Perfect for quick learning and time-bound
                    practice.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6 pb-8">
                <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-4">
                    <ScrollArea>
                        <TabsList
                            className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                            <TabsTrigger
                                value={QUIZ_TYPES.PENDING}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                            >
                                <ClockIcon size={16} className="me-2 opacity-60"/>
                                Pending Sprint Quiz
                            </TabsTrigger>
                            <TabsTrigger
                                value={QUIZ_TYPES.COMPLETED}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                            >
                                <CheckCheckIcon size={16} className="me-2 opacity-60"/>
                                Completed Sprint Quiz
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
                                                onTakeTestAction={handleTakeTestAction}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No pending sprint quizzes available</p>
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
                                                onViewSolutionAction={handleViewSolutionAction}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No completed sprint quizzes available</p>
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