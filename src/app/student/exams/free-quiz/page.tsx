'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {StudentBannerHeader} from '@/components/banner/header';
import {Tabs, TabsContent, TabsList, TabsTrigger,} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {QuizTestCardSkeleton} from '@/components/Exams/exam-card';
import {QUIZ_TYPES, QuizType} from '@/lib/Constan';
import freeQuizServices from '@/services/ExamService/FreeQuiz';
import QuizCardList from '@/components/Exams/Quiz';
import Pagination from '@/components/Pagination';
import {CheckCheckIcon, ClockIcon} from 'lucide-react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from "@/redux/Store";
import CustomPagination from "@/components/Pagination";
import { toast } from 'sonner';

interface Quiz {
    id: number;
    exam_name: string;
    status: string;
    questions_count: number;
    players: any;
    user: {
        id: number;
        fullname: string;
    };
}

export default function FreeQuiz() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();


    const tabParam = searchParams.get('tab') || QUIZ_TYPES.PENDING;
    const [selectedTab, setSelectedTab] = useState<QuizType>(
        tabParam === QUIZ_TYPES.COMPLETED ? QUIZ_TYPES.COMPLETED : QUIZ_TYPES.PENDING
    );

    const [pendingQuizzes, setPendingQuizzes] = useState<Quiz[]>([]);
    const [completedQuizzes, setCompletedQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(false);

    const [pendingPage, setPendingPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    const [pendingTotalPages, setPendingTotalPages] = useState(1);
    const [completedTotalPages, setCompletedTotalPages] = useState(1);

    const fetchPendingQuizzes = async (page: number) => {
        try {
            const res = await freeQuizServices.getPendingFreeQuizzes(page);
            setPendingQuizzes(res.data.data);
            setPendingTotalPages(res.data.last_page);
            console.log(`Pending Quizzes`, res.data?.data);
        } catch (error) {
            console.error('Error fetching pending quizzes:', error);
        }
    };

    const fetchCompletedQuizzes = async (page: number) => {
        try {
            const res = await freeQuizServices.getCompleteFreeQuizzes(page);
            setCompletedQuizzes(res.data.data);
            setCompletedTotalPages(res.data.last_page);
            console.log(`Player Quizzes`, res.data?.data);

        } catch (error) {
            console.error('Error fetching completed quizzes:', error);
        }
    };

    const handleTabChange = (val: string) => {
        if (val === QUIZ_TYPES.PENDING || val === QUIZ_TYPES.COMPLETED) {
            setSelectedTab(val);
            router.push(`?tab=${val}`);
        }
    };


    const handleViewAllScores = (quizId: number) => {
        const quiz = completedQuizzes.find((quiz) => quiz.id === quizId);

        if (quiz && quiz.players) {
            dispatch({
                type: 'players/setPlayers',
                payload: quiz.players,
            });
        } else {
            console.warn('Quiz not found or no players available');
        }

        router.push(`/student/scores/${quizId}`);
    };


    useEffect(() => {
        setLoading(true);
        if (selectedTab === QUIZ_TYPES.PENDING) {
            fetchPendingQuizzes(pendingPage).finally(() => setLoading(false));
        } else {
            fetchCompletedQuizzes(completedPage).finally(() => setLoading(false));
        }
    }, [selectedTab, pendingPage, completedPage]);

    return (
        <main className="w-full">
            <StudentBannerHeader
                title="Free Quiz"
                imageSrc="/images/exams.png"
                subtitle="Trusted by 20,000+ students and teachers"
                textClassName="text-gray-900"
            />

            <section className="text-center p-4 max-w-5xl mx-auto">
                <h1 className="font-poppins text-3xl md:text-4xl font-bold leading-snug">
                    Take a Free Quiz & Boost Your Confidence
                </h1>
                <p className="font-poppins text-base text-gray-700 mt-2 max-w-2xl mx-auto">
                    Our free quizzes are designed to help you assess your knowledge and prepare for your exams...
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
                                Pending Free Quiz
                            </TabsTrigger>
                            <TabsTrigger
                                value={QUIZ_TYPES.COMPLETED}
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                            >
                                <CheckCheckIcon size={16} className="me-2 opacity-60"/>
                                Completed Free Quiz
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
                                    onViewAllScoresAction={handleViewAllScores}
                                    onTakeTestAction={(quizId: number) => {
                                        toast.success(`Quiz started successfully`);
                                        router.push(`/student/exams/free-quiz/${quizId}`)
                                    }}
                                    onViewSolutionAction={(quizId: number) =>
                                        router.push(`/student/exams/solution/${quizId}`)
                                    }
                                />
                                <div className="flex justify-center mt-4">
                                    {
                                        pendingTotalPages > 1 &&
                                        <CustomPagination
                                            totalPages={pendingTotalPages}
                                            currentPage={pendingPage}
                                            onPageChangeAction={(page) => setPendingPage(page)}
                                        />
                                    }
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
                                    onViewAllScoresAction={handleViewAllScores}
                                    onTakeTestAction={(quizId: number) =>
                                        router.push(`/student/exams/free-quiz/${quizId}`)
                                    }
                                    onViewSolutionAction={(quizId: number) =>
                                        router.push(`${process.env.NEXT_PUBLIC_SOLUTION_API_URL}/${quizId}`)
                                    }
                                />
                                <div className="flex justify-center mt-4">

                                        <CustomPagination
                                            totalPages={completedTotalPages}
                                            currentPage={completedPage}
                                            onPageChangeAction={(page) => setCompletedPage(page)} // ✅ correct
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
