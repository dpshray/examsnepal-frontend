'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {BookOpenIcon, ClipboardListIcon} from 'lucide-react';
import {FaStopwatch} from 'react-icons/fa6';

import useFreeCompletedQuizzes from '@/hooks/useFreeCompletedQuizzes';
import useSprintCompletedQuizzes from '@/hooks/useSprintCompletedQuizzes';
import useMockCompletedQuizzes from '@/hooks/useMockCompletedQuizzes';

import {TEST_TYPES, TestType} from '@/lib/Constan';
import {cn} from '@/lib/utils';

import {QuizCompletedCard, QuizTestCardSkeleton,} from '@/components/Exams/exam-card';
import Pagination from '@/components/Pagination';

const quizTypes = [
    {
        label: 'Free Quizzes',
        value: TEST_TYPES.FREE,
        icon: <BookOpenIcon className="me-1.5 opacity-60" size={16}/>,
        bgClass: 'data-[state=active]:bg-green-600 data-[state=active]:text-white',
        routeKey: 'free-quiz',
    },
    {
        label: 'Sprint Quizzes',
        value: TEST_TYPES.SPRINT,
        icon: <FaStopwatch className="me-1.5 opacity-60" size={16}/>,
        bgClass: 'data-[state=active]:bg-yellow-500 data-[state=active]:text-white',
        routeKey: 'sprint-quiz',
    },
    {
        label: 'Mock Tests',
        value: TEST_TYPES.MOCK,
        icon: <ClipboardListIcon className="me-1.5 opacity-60" size={16}/>,
        bgClass: 'data-[state=active]:bg-blue-500 data-[state=active]:text-white',
        routeKey: 'mock-test',
    },
];

export default function SolutionPage() {
    const router = useRouter();
    const [pages, setPages] = useState({free: 1, sprint: 1, mock: 1});
    const [selectedTab, setSelectedTab] = useState<TestType>(TEST_TYPES.FREE);

    const {
        completedQuizzes,
        completedTotalPages,
        loading: loadingFree,
        fetchCompletedQuizzes,
    } = useFreeCompletedQuizzes(pages.free);

    const {
        completedQuizzes: sprintQuizzes,
        completedSprintTotalPages,
        loading: loadingSprint,
        fetchCompletedSprintQuizzes,
    } = useSprintCompletedQuizzes(pages.sprint);

    const {
        completedMockQuizzes,
        completedMockTotalPages,
        loadingMock,
        fetchCompletedMockQuizzes,
    } = useMockCompletedQuizzes(pages.mock);

    const dataMap = {
        [TEST_TYPES.FREE]: {
            data: completedQuizzes,
            totalPages: completedTotalPages,
            loading: loadingFree,
            page: pages.free,
            setPage: (page: number) => {
                setPages((prev) => ({...prev, free: page}));
                fetchCompletedQuizzes(page);
            },
        },
        [TEST_TYPES.SPRINT]: {
            data: sprintQuizzes,
            totalPages: completedSprintTotalPages,
            loading: loadingSprint,
            page: pages.sprint,
            setPage: (page: number) => {
                setPages((prev) => ({...prev, sprint: page}));
                fetchCompletedSprintQuizzes(page);
            },
        },
        [TEST_TYPES.MOCK]: {
            data: completedMockQuizzes,
            totalPages: completedMockTotalPages,
            loading: loadingMock,
            page: pages.mock,
            setPage: (page: number) => {
                setPages((prev) => ({...prev, mock: page}));
                fetchCompletedMockQuizzes(page);
            },
        },
    };

    const handleViewSolution = (quizId: number) => {
        router.push(`${process.env.NEXT_PUBLIC_SOLUTION_API_URL}/${quizId}`);
    };

    const handleViewAllScores = (type: string) => {
        router.push(`/student/exams/${type}/scores`);
    };

    return (
        <>


            <main
                className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-poppins"
                aria-labelledby="solutions-heading"
            >
                <div className="text-center space-y-2 mb-8">
                    <h1 id="solutions-heading" className="text-3xl font-bold leading-tight">
                        Your Quiz Solutions
                    </h1>
                    <p className="text-gray-600 text-sm max-w-xl mx-auto">
                        Review solutions for completed quizzes and track your learning progress.
                    </p>
                </div>

                <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as TestType)} className="mt-6">
                    <ScrollArea aria-label="Quiz type tabs">
                        <TabsList
                            role="tablist"
                            className="relative mb-3 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border"
                        >
                            {quizTypes.map(({label, value, icon, bgClass}) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        'bg-muted overflow-hidden rounded-b-none border-x border-t py-2 px-3 text-sm font-medium transition-all',
                                        bgClass
                                    )}
                                    aria-label={`View ${label}`}
                                >
                                    {icon}
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>

                    {quizTypes.map(({value, routeKey}) => {
                        const {data, loading, totalPages, page, setPage} = dataMap[value];

                        return (
                            <TabsContent key={value} value={value} className="w-full">
                                {loading ? (
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
                                        {Array.from({length: 6}).map((_, index) => (
                                            <QuizTestCardSkeleton key={index}/>
                                        ))}
                                    </div>
                                ) : data.length > 0 ? (
                                    <>
                                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
                                            {data.map((quiz) => (
                                                <QuizCompletedCard
                                                    key={quiz.id}
                                                    title={quiz.exam_name}
                                                    provider={quiz.user?.fullname || 'ExamsNepal'}
                                                    questionCount={quiz.questions_count}
                                                    onViewSolutionAction={() => handleViewSolution(quiz.id)}
                                                    onViewAllScoresAction={() => handleViewAllScores(routeKey)}
                                                />
                                            ))}
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="flex justify-center my-4">
                                                <Pagination
                                                    totalPages={totalPages}
                                                    currentPage={page}
                                                    onPageChange={setPage}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-center text-sm py-10" role="status">
                                        No completed {value.toLowerCase()} found.
                                    </p>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </main>
        </>
    );
}
