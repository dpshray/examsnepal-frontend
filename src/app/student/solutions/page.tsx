'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {motion} from 'framer-motion';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {BookOpenIcon, ClipboardListIcon, FileX, RefreshCw} from 'lucide-react';
import {FaStopwatch} from 'react-icons/fa6';

import useFreeCompletedQuizzes from '@/hooks/useFreeCompletedQuizzes';
import useSprintCompletedQuizzes from '@/hooks/useSprintCompletedQuizzes';
import useMockCompletedQuizzes from '@/hooks/useMockCompletedQuizzes';

import {TEST_TYPES, TestType} from '@/lib/Constan';
import {cn} from '@/lib/utils';

import {QuizCompletedCard, QuizTestCardSkeleton} from '@/components/Exams/exam-card';
import CustomPagination from "@/components/Pagination";
import ErrorComponent from "@/components/state/ErrorComponent";

interface QuizData {
    id: number;
    exam_name: string;
    user?: {
        fullname: string;
    };
    questions_count: number;
}

interface TabData {
    data: QuizData[];
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
        icon: <BookOpenIcon className="me-1.5 text-white" size={16}/>,
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

const EmptyState = ({
                        type,
                        onRetry
                    }: {
    type: string;
    onRetry?: () => void;
}) => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
        <FileX className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"/>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            No {type} Solutions Found
        </h3>
        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md px-4 mb-6">
            You haven&#39;t completed any {type.toLowerCase()} yet. Start taking quizzes to see your solutions here.
        </p>
        {onRetry && (
            <Button
                variant="outline"
                onClick={onRetry}
                className="flex items-center gap-2"
            >
                <RefreshCw className="h-4 w-4"/>
                Refresh
            </Button>
        )}
    </div>
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

    const handleRetry = async (type: TestType) => {
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
    };

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

    const handleViewSolution = (quizId: number) => {
        router.push(`${process.env.NEXT_PUBLIC_SOLUTION_API_URL}/${quizId}`);
    };

    const handleViewAllScores = (type: string) => {
        router.push(`/student/exams/${type}/scores`);
    };

    const handleTabChange = (value: string) => {
        setSelectedTab(value as TestType);
    };

    return (
        <section className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center space-y-3"
                    >
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                            Your Quiz Solutions
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Review solutions for completed quizzes and track your learning progress across all test
                            types.
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-poppins">
                <Tabs value={selectedTab} onValueChange={handleTabChange}>
                    <ScrollArea className="w-full">
                        <TabsList
                            role="tablist"
                            className="relative mb-6 sm:mb-8 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border"
                        >
                            {quizTypes.map(({label, value, icon, bgClass}) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        'bg-muted overflow-hidden rounded-b-none border-x border-t  px-4 sm:px-6 text-sm sm:text-base font-medium transition-all duration-200',
                                        bgClass
                                    )}
                                    aria-label={`View ${label}`}
                                >
                                    {icon}
                                    <span className="hidden xs:inline">{label}</span>
                                    <span className="xs:hidden">
                                        {label.split(' ')[0]}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>

                    {quizTypes.map(({value, label, routeKey}) => {
                        const {data, loading, totalPages, page, setPage, error, retry} = dataMap[value];

                        return (
                            <TabsContent key={value} value={value} className="mt-0">
                                {error && retry && (
                                    <ErrorComponent error={error} onRetry={retry}/>
                                )}

                                {loading ? (
                                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {Array.from({length: 6}).map((_, index) => (
                                            <QuizTestCardSkeleton key={`${value}-skeleton-${index}`}/>
                                        ))}
                                    </div>
                                ) : !error && data.length === 0 ? (
                                    <EmptyState type={label} onRetry={retry}/>
                                ) : (
                                    <>
                                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                            {data.map((quiz, index) => (
                                                <motion.div
                                                    key={quiz.id}
                                                    initial={{opacity: 0, y: 20}}
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: index * 0.1
                                                    }}
                                                >
                                                    <QuizCompletedCard
                                                        title={quiz.exam_name}
                                                        provider={quiz.user?.fullname || 'ExamsNepal'}
                                                        questionCount={quiz.questions_count}
                                                        onViewSolutionAction={() => handleViewSolution(quiz.id)}
                                                        onViewAllScoresAction={() => handleViewAllScores(routeKey)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="flex justify-center mt-8 sm:mt-12">
                                            <CustomPagination
                                                totalPages={totalPages}
                                                currentPage={page}
                                                onPageChangeAction={setPage}
                                            />
                                        </div>
                                    </>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </main>
        </section>
    );
}