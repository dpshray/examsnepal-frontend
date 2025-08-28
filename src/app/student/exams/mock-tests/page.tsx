'use client';

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {StudentBannerHeader} from "@/components/banner/header";
import {QuizTestCardSkeleton} from "@/components/Exams/exam-card";
import {QUIZ_TYPES, QuizType} from "@/lib/Constan";
import mockTestService from "@/services/ExamService/MockTest";
import QuizCardList from "@/components/Exams/Quiz";
import Pagination from "@/components/Pagination";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {CheckCheckIcon, ClockIcon} from "lucide-react";

interface MetaData {
    totalPages: number;
    currentPage: number;

    [key: string]: any;
}

export default function MockTestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();


    const tabParam = searchParams.get('tab') || QUIZ_TYPES.PENDING;
    const [selectedTab, setSelectedTab] = useState<QuizType>(
        tabParam === QUIZ_TYPES.COMPLETED ? QUIZ_TYPES.COMPLETED : QUIZ_TYPES.PENDING
    );

    const [pendingQuizzes, setPendingQuizzes] = useState<any[]>([]);
    const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [pendingMeta, setPendingMeta] = useState<MetaData>({totalPages: 1, currentPage: 1});
    const [completedMeta, setCompletedMeta] = useState<MetaData>({totalPages: 1, currentPage: 1});

    const fetchPendingQuizzes = async (page: number) => {
        try {
            const response = await mockTestService.getPendingMockTests(page);
            const totalPages = Math.ceil(response?.data?.total / 10);
            setPendingQuizzes(response.data.data);
            console.log(`Pending Quizzes`, response.data);
            setPendingMeta({totalPages, currentPage: page});
        } catch (error) {
            console.error('Error fetching pending quizzes:', error);
        }
    };

    const fetchCompletedQuizzes = async (page: number) => {
        try {
            const response = await mockTestService.getCompletedMockTests(page);
            const totalPages = Math.ceil(response?.data?.total / 10);
            setCompletedQuizzes(response.data.data);
            console.log(`Completed Quizzes`, response);
            setCompletedMeta({totalPages, currentPage: page});
        } catch (error) {
            console.error('Error fetching completed quizzes:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (selectedTab === QUIZ_TYPES.PENDING) {
            fetchPendingQuizzes(pendingMeta.currentPage).finally(() => setLoading(false));
        } else {
            fetchCompletedQuizzes(completedMeta.currentPage).finally(() => setLoading(false));
        }
    }, [selectedTab, pendingMeta.currentPage, completedMeta.currentPage]);

    const handleTabChange = (tab: string) => {
        if (tab === QUIZ_TYPES.PENDING || tab === QUIZ_TYPES.COMPLETED) {
            setSelectedTab(tab);
            router.push(`?tab=${tab}`);
        }
    };

    const handleViewAllScoresAction = (quizName: string) => {
        console.log(`View Scores for ${quizName}`);
    };

    const handleTakeTestAction = (quizId: number) => {
        router.push(`/student/exams/mock-tests/${quizId}`);
    };

    const handlePageChange = (page: number) => {
        if (selectedTab === QUIZ_TYPES.PENDING) {
            setPendingMeta(prev => ({...prev, currentPage: page}));
        } else {
            setCompletedMeta(prev => ({...prev, currentPage: page}));
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

            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
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
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({length: 6}).map((_, index) => (
                                    <QuizTestCardSkeleton key={index}/>
                                ))}
                            </div>
                        ) : (
                            <>
                                <QuizCardList
                                    quizzes={pendingQuizzes}
                                    selectedTab={QUIZ_TYPES.PENDING}
                                    onViewAllScoresAction={handleViewAllScoresAction as any}
                                    onTakeTestAction={handleTakeTestAction}
                                    onViewSolutionAction={(quizId: number) =>
                                        router.push(`${process.env.NEXT_PUBLIC_SOLUTION_API_URL}/${quizId}`)
                                    }
                                />
                                <div className="flex justify-center mt-4">
                                    <Pagination
                                        totalPages={pendingMeta.totalPages}
                                        currentPage={pendingMeta.currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value={QUIZ_TYPES.COMPLETED}>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({length: 6}).map((_, index) => (
                                    <QuizTestCardSkeleton key={index}/>
                                ))}
                            </div>
                        ) : (
                            <>
                                <QuizCardList
                                    quizzes={completedQuizzes}
                                    selectedTab={QUIZ_TYPES.COMPLETED}
                                    onViewAllScoresAction={handleViewAllScoresAction as any}
                                    onTakeTestAction={handleTakeTestAction}
                                    onViewSolutionAction={(quizId: number) =>
                                        router.push(`${process.env.NEXT_PUBLIC_SOLUTION_API_URL}/${quizId}`)
                                    }
                                />
                                <div className="flex justify-center mt-4">
                                    <Pagination
                                        totalPages={completedMeta.totalPages}
                                        currentPage={completedMeta.currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
