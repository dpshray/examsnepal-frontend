'use client';

import {useCallback, useState} from 'react';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {BookOpenIcon, ClipboardListIcon, FileX, RefreshCw, TrendingUp} from 'lucide-react';
import {FaStopwatch} from 'react-icons/fa6';

import useFreeCompletedQuizzes from '@/hooks/useFreeCompletedQuizzes';
import useSprintCompletedQuizzes from '@/hooks/useSprintCompletedQuizzes';
import useMockCompletedQuizzes from '@/hooks/useMockCompletedQuizzes';

import {TEST_TYPES, TestType} from '@/lib/Constan';
import {cn} from '@/lib/utils';

import {Exam, QuizCompletedCard, QuizTestCardSkeleton} from '@/components/Exams/exam-card';
import CustomPagination from "@/components/Pagination";
import ErrorComponent from "@/components/state/ErrorComponent";
import {SOLUTIONS_ROUTE, STUDENT_SCORE_ROUTE} from "@/config/app-constant";

interface TabData {
    data: Exam[];
    totalPages: number;
    loading: boolean;
    error?: string | null;
    page: number;
    setPage: (page: number) => void;
    retry?: () => void;
}

const quizTypes = [
    {
        label: 'Free Quizzes',
        value: TEST_TYPES.FREE,
        icon: <BookOpenIcon className="shrink-0" size={18} aria-hidden="true"/>,
        bgClass: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/30',
        routeKey: 'free-quiz',
    },
    {
        label: 'Sprint Quizzes',
        value: TEST_TYPES.SPRINT,
        icon: <FaStopwatch className="shrink-0" size={18} aria-hidden="true"/>,
        bgClass: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-yellow-500/30',
        routeKey: 'sprint-quiz',
    },
    {
        label: 'Mock Tests',
        value: TEST_TYPES.MOCK,
        icon: <ClipboardListIcon className="shrink-0" size={18} aria-hidden="true"/>,
        bgClass: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30',
        routeKey: 'mock-test',
    },
];

const EmptyState = ({type, onRetry}: { type: string; onRetry?: () => void }) => (
    <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.4}}
        className="flex flex-col items-center justify-center py-20 sm:py-32 px-4"
    >
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"/>
            <FileX className="relative h-20 w-20 sm:h-24 sm:w-24 text-gray-400 mb-6" aria-hidden="true"/>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
            No {type} Solutions Found
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-md mb-8 leading-relaxed">
            You haven&#39;t completed any {type.toLowerCase()} yet. Start taking quizzes to see your solutions here
            and track your progress.
        </p>
        {onRetry && (
            <Button
                variant="outline"
                onClick={onRetry}
                className="flex items-center gap-2.5 px-6 py-2.5 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2 group"
                aria-label="Retry loading quizzes"
            >
                <RefreshCw
                    className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500"
                    aria-hidden="true"
                />
                <span className="font-medium">Refresh</span>
            </Button>
        )}
    </motion.div>
);

const StatsCard = ({label, value, icon: Icon}: { label: string; value: number; icon: any }) => (
    <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
    >
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true"/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{label}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
        </div>
    </motion.div>
);

export default function SolutionPage() {
    const router = useRouter();
    const [pages, setPages] = useState({free: 1, sprint: 1, mock: 1});
    const [selectedTab, setSelectedTab] = useState<TestType>(TEST_TYPES.FREE);
    const [errors, setErrors] = useState<Record<string, string | null>>({
        free: null,
        sprint: null,
        mock: null
    });

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

    const handleRetry = useCallback(async (type: TestType) => {
        setErrors(prev => ({...prev, [type]: null}));

        try {
            switch (type) {
                case TEST_TYPES.FREE:
                    await fetchCompletedQuizzes(pages.free);
                    break;
                case TEST_TYPES.SPRINT:
                    await fetchCompletedSprintQuizzes(pages.sprint);
                    break;
                case TEST_TYPES.MOCK:
                    await fetchCompletedMockQuizzes(pages.mock);
                    break;
            }
        } catch (error: any) {
            setErrors(prev => ({
                ...prev,
                [type]: error?.message || `Failed to load ${type} quizzes`
            }));
        }
    }, [pages, fetchCompletedQuizzes, fetchCompletedSprintQuizzes, fetchCompletedMockQuizzes]);

    const dataMap: Record<TestType, TabData> = {
        [TEST_TYPES.FREE]: {
            data: completedQuizzes,
            totalPages: completedTotalPages,
            loading: loadingFree,
            error: errors.free,
            page: pages.free,
            setPage: (page: number) => {
                setPages((prev) => ({...prev, free: page}));
                fetchCompletedQuizzes(page);
            },
            retry: () => handleRetry(TEST_TYPES.FREE),
        },
        [TEST_TYPES.SPRINT]: {
            data: sprintQuizzes,
            totalPages: completedSprintTotalPages,
            loading: loadingSprint,
            error: errors.sprint,
            page: pages.sprint,
            setPage: (page: number) => {
                setPages((prev) => ({...prev, sprint: page}));
                fetchCompletedSprintQuizzes(page);
            },
            retry: () => handleRetry(TEST_TYPES.SPRINT),
        },
        [TEST_TYPES.MOCK]: {
            data: completedMockQuizzes,
            totalPages: completedMockTotalPages,
            loading: loadingMock,
            error: errors.mock,
            page: pages.mock,
            setPage: (page: number) => {
                setPages((prev) => ({...prev, mock: page}));
                fetchCompletedMockQuizzes(page);
            },
            retry: () => handleRetry(TEST_TYPES.MOCK),
        },
    };

    const handleViewSolution = useCallback((quizId: number) => {
        router.push(`${SOLUTIONS_ROUTE}/${quizId}`);
    }, [router]);

    const handleViewAllScores = useCallback((quizId: number) => {
        router.push(`${STUDENT_SCORE_ROUTE}/${quizId}`);
    }, [router]);

    const handleTabChange = useCallback((value: string) => {
        setSelectedTab(value as TestType);
    }, []);


    return (
        <section className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
            <div className="border-b shadow-xl">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black py-12 sm:py-16 md:py-20">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.7, ease: "easeOut"}}
                        className="text-center space-y-4 sm:space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4">
                            <TrendingUp className="h-4 w-4" aria-hidden="true"/>
                            <span className="text-xs sm:text-sm font-medium">
                    Track Your Progress
                </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4">
                            Your Quiz Solutions
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4">
                            Review solutions for completed quizzes and track your learning progress across all test
                            types with detailed analytics
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.7, delay: 0.2}}
                        className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
                    >
                        <StatsCard label="Free Quizzes" value={completedQuizzes.length} icon={BookOpenIcon}/>
                        <StatsCard label="Sprint Quizzes" value={sprintQuizzes.length} icon={FaStopwatch}/>
                        <StatsCard label="Mock Tests" value={completedMockQuizzes.length} icon={ClipboardListIcon}/>
                    </motion.div>
                </div>
            </div>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 font-poppins">
                <Tabs value={selectedTab} onValueChange={handleTabChange}>
                    <ScrollArea className="w-full">
                        <TabsList
                            role="tablist"
                            className="relative mb-8 sm:mb-10 h-auto w-full gap-1 sm:gap-2 bg-gray-100/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-xl shadow-sm"
                            aria-label="Quiz type selection"
                        >
                            {quizTypes.map(({label, value, icon, bgClass}) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        'flex-1 flex items-center justify-center gap-2 rounded-lg  px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300',
                                        'hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                                        'data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900',
                                        bgClass
                                    )}
                                    aria-label={`View ${label}`}
                                >
                                    {icon}
                                    <span className="hidden xs:inline whitespace-nowrap">{label}</span>
                                    <span className="xs:hidden whitespace-nowrap">
                                        {label.split(' ')[0]}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal" className="h-2"/>
                    </ScrollArea>

                    <AnimatePresence mode="wait">
                        {quizTypes.map(({value, label}) => {
                            const {data, loading, totalPages, page, setPage, error, retry} = dataMap[value];

                            return (
                                <TabsContent key={value} value={value} className="mt-0 focus:outline-none">
                                    {error && retry && (
                                        <motion.div
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            className="mb-6"
                                        >
                                            <ErrorComponent error={error} onRetry={retry}/>
                                        </motion.div>
                                    )}

                                    {loading ? (
                                        <motion.div
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                            role="status"
                                            aria-label={`Loading ${label}`}
                                        >
                                            {Array.from({length: 6}).map((_, index) => (
                                                <QuizTestCardSkeleton key={`${value}-skeleton-${index}`}/>
                                            ))}
                                        </motion.div>
                                    ) : !error && data.length === 0 ? (
                                        <EmptyState type={label} onRetry={retry}/>
                                    ) : (
                                        <motion.div
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            transition={{duration: 0.4}}
                                        >
                                            <div
                                                className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                                {data.map((quiz, index) => (
                                                    <motion.div
                                                        key={`${value}-quiz-${quiz.id}`}
                                                        initial={{opacity: 0, y: 30}}
                                                        animate={{opacity: 1, y: 0}}
                                                        transition={{
                                                            duration: 0.5,
                                                            delay: Math.min(index * 0.08, 0.4),
                                                            ease: "easeOut"
                                                        }}
                                                    >
                                                        <QuizCompletedCard
                                                            exam={quiz}
                                                            onViewSolutionAction={handleViewSolution}
                                                            onViewAllScoresAction={handleViewAllScores}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {totalPages > 1 && (
                                                <motion.div
                                                    initial={{opacity: 0, y: 20}}
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{delay: 0.3}}
                                                    className="flex justify-center mt-10 sm:mt-14"
                                                >
                                                    <CustomPagination
                                                        totalPages={totalPages}
                                                        currentPage={page}
                                                        onPageChangeAction={setPage}
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </TabsContent>
                            );
                        })}
                    </AnimatePresence>
                </Tabs>
            </main>
        </section>
    );
}