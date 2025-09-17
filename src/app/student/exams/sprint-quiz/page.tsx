'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {StudentBannerHeader} from '@/components/banner/header';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {CheckCheckIcon, ClockIcon} from 'lucide-react';
import {QuizTestCardSkeleton} from '@/components/Exams/exam-card';
import QuizCardList from '@/components/Exams/Quiz';
import sprintQuizServices from '@/services/ExamService/SprintQuiz';
import Pagination from '@/components/Pagination';
import {QUIZ_TYPES, QuizType} from '@/lib/Constan';
import CustomPagination from "@/components/Pagination";
import { toast } from 'sonner';

export default function SprintQuiz() {
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState<QuizType>(QUIZ_TYPES.PENDING);

    const [pendingQuizzes, setPendingQuizzes] = useState<any[]>([]);
    const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);

    const [pendingPage, setPendingPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);

    const [pendingTotalPages, setPendingTotalPages] = useState(1);
    const [completedTotalPages, setCompletedTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);

    const fetchPending = async (page: number) => {
        setLoading(true);
        try {
            const res = await sprintQuizServices.getPendingSprintQuizzes(page);
            setPendingQuizzes(res.data.data || []);
            setPendingTotalPages(res.data.meta?.totalPages || 1);
        } catch {
            setPendingQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompleted = async (page: number) => {
        setLoading(true);
        try {
            const res = await sprintQuizServices.getCompleteSprintQuizzes(page);
            setCompletedQuizzes(res.data.data || []);
            setCompletedTotalPages(res.data.meta?.totalPages || 1);
        } catch {
            setCompletedQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending(pendingPage);
        fetchCompleted(completedPage);
    }, [completedPage, pendingPage]);

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab as QuizType);
        if (tab === QUIZ_TYPES.PENDING) {
            fetchPending(1);
            setPendingPage(1);
        } else {
            fetchCompleted(1);
            setCompletedPage(1);
        }
    };

    const renderContent = (quizzes: any[], tab: QuizType) => {
        return loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {Array.from({length: 6}).map((_, i) => (
                    <QuizTestCardSkeleton key={i}/>
                ))}
            </div>
        ) : (
            <QuizCardList
                quizzes={quizzes}
                selectedTab={tab}
                onTakeTestAction={(id: number) => {
                    toast.success(`Quiz started successfully ${id}`);
                    router.push(`/student/exams/sprint-quiz/${id}`);
                }}
                onViewSolutionAction={(id: number) => {
                    router.push(`${process.env.NEXT_PUBLIC_SOLUTION_API_URL}/${id}`);
                }}
                onViewAllScoresAction={() => {
                    router.push(`/student/exams/sprint-quiz/scores`);
                }}
            />
        );
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

            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
                <Tabs value={selectedTab} onValueChange={handleTabChange}>
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
                        {renderContent(pendingQuizzes, QUIZ_TYPES.PENDING)}
                    </TabsContent>
                    <TabsContent value={QUIZ_TYPES.COMPLETED}>
                        {renderContent(completedQuizzes, QUIZ_TYPES.COMPLETED)}
                    </TabsContent>
                </Tabs>

                <div className="p-4">
                    {
                        completedTotalPages > 1 || pendingTotalPages > 1 ? (
                            <CustomPagination
                                totalPages={selectedTab === QUIZ_TYPES.PENDING ? pendingTotalPages : completedTotalPages}
                                currentPage={selectedTab === QUIZ_TYPES.PENDING ? pendingPage : completedPage}
                                onPageChangeAction={(page: number) => {
                                    if (selectedTab === QUIZ_TYPES.PENDING) {
                                        setPendingPage(page);
                                        fetchPending(page);
                                    } else {
                                        setCompletedPage(page);
                                        fetchCompleted(page);
                                    }
                                }}
                            />
                        ) : null
                    }
                </div>
            </div>
        </main>
    );
}
