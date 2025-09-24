"use client";

import {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import {AlertCircle, CheckCircle, MessageCircle, RefreshCw} from "lucide-react";

import {QuestionSchema} from "@/schema/authSchema";
import forumService from "@/services/ForumService";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription} from "@/components/ui/alert";
import RepliesCardSkeleton, {AnalyticsCard, RepliesCard} from "@/components/card/card";
import {StudentBannerHeader} from "@/components/banner/header";
import studentService from "@/services/StudentService";
import {ExamData} from "@/types/types";
import useMockCompletedQuizzes from "@/hooks/useMockCompletedQuizzes";
import CustomPagination from "@/components/Pagination";
import { toast } from "sonner";

interface Answer {
    id: number;
    created_at?: string;
    updated_at?: string;
    answer: string;
    student_profile: {
        id: number;
        name: string;
    };
}

interface DoubtData {
    id: number;
    question: string;
    view_count: number;
    student_profile: {
        id: number;
        name: string;
    };
    answers: Answer[];
    answers_count: number;
    created_at: string;
    is_solved: boolean;
}

interface ErrorState {
    hasError: boolean;
    message: string;
    type: 'fetch' | 'submit' | 'delete' | 'edit';
}

type Subject = {
  id: number;
  name: string;
};

const ITEMS_PER_PAGE = 10;

export default function StudentDashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [questions, setQuestions] = useState<DoubtData[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'solved' | 'unsolved'>('all');
    const [errorState, setErrorState] = useState<ErrorState>({
        hasError: false,
        message: '',
        type: 'fetch'
    });
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectsLoading, setSubjectsLoading] = useState(true);
    const [subjectsError, setSubjectsError] = useState<string | null>(null);

    const DEFAULT_EXAM_COUNT: ExamData = {
        free: {total: 0, overall: 0},
        sprint: {total: 0, overall: 0},
        mock: {total: 0, overall: 0},
    };
    const [examCount, setExamCount] = useState<ExamData>(DEFAULT_EXAM_COUNT);
    const router = useRouter();

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        resolver: yupResolver(QuestionSchema),
    });

    const clearError = () => {
        setErrorState({hasError: false, message: '', type: 'fetch'});
    };

    const handleError = (error: any, type: ErrorState['type']) => {
        const errorMessage = error?.data?.errors || error?.message || 'An unexpected error occurred';

        if (typeof errorMessage === 'object') {
            const firstError = Object.values(errorMessage)[0] as string[];
            setErrorState({
                hasError: true,
                message: firstError?.[0] || 'Something went wrong',
                type
            });
            toast.error(firstError?.[0] || 'Something went wrong');
        } else {
            setErrorState({
                hasError: true,
                message: errorMessage,
                type
            });
            toast.error(errorMessage);
        }
    };

    const handleQuestionSubmit = async (data: any) => {
        setSubmitting(true);
        clearError();

        try {
            const response = await forumService.addForumQuestion(data);
            if (response) {
                toast.success(response?.message || "Question submitted successfully");
                reset();
                await handleAllQuestions(1);
                setCurrentPage(1);
            }
        } catch (error: any) {
            handleError(error, 'submit');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredQuestions = questions.filter(question => {
        if (activeTab === 'solved') return question.is_solved;
        if (activeTab === 'unsolved') return !question.is_solved;
        return true;
    });

    const handleAllQuestions = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            clearError();

            const response = await forumService.getAllForumQuestions(page);
            const questionsData = response?.data?.data || [];

            setQuestions(questionsData);
            setTotalPages(Math.ceil(response?.data?.total / ITEMS_PER_PAGE));
        } catch (error: any) {
            handleError(error, 'fetch');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteAction = async (id: number) => {
        try {
            clearError();
            const response = await forumService.deleteOwnForumQuestion(id);
            if (response) {
                toast.success(response?.message || "Question deleted successfully");
                await handleAllQuestions(currentPage);
            }
        } catch (error: any) {
            handleError(error, 'delete');
        }
    };

    const handleEditAction = async (id: number, updatedQuestion: string) => {
        try {
            clearError();
            const response = await forumService.editOwnForumQuestion(id, {question: updatedQuestion});
            toast.success(response?.message || "Question updated successfully");
            await handleAllQuestions(currentPage);
        } catch (error: any) {
            handleError(error, 'edit');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        handleAllQuestions(page);
    };

    const handleTabChange = (tab: 'all' | 'solved' | 'unsolved') => {
        setActiveTab(tab);
        clearError();
    };

    const handleRetry = async () => {
        clearError();
        await handleAllQuestions(currentPage);
    };

    useEffect(() => {
        handleAllQuestions(currentPage);
    }, [handleAllQuestions, currentPage]);

    const handleExamCount = async () => {
        try {
            const response = await studentService.totalExamCount();
            setExamCount(response?.data || DEFAULT_EXAM_COUNT);
        } catch (error: any) {
            console.error('Failed to fetch exam count:', error);
        }
    };

    const examData = [
        {title: 'Free Quizzes', ...examCount.free},
        {title: 'Sprint Quizzes', ...examCount.sprint},
        {title: 'Mock Tests', ...examCount.mock},
    ];

    useEffect(() => {
        handleExamCount();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setSubjectsLoading(true);
                setSubjectsError(null);
                const response = await studentService.getTotalSubjects();
                const list = response?.data ?? [];
                setSubjects(list);
            } catch (error: any) {
                console.error("Failed to fetch subjects", error);
                setSubjectsError("Could not load subjects.");
                setSubjects([]);
            } finally {
                setSubjectsLoading(false);
            }
        };
        fetchSubjects();
    }, []);


    const {completedMockQuizzes} = useMockCompletedQuizzes();

    const EmptyState = ({type}: { type: 'all' | 'solved' | 'unsolved' }) => {
        const config = {
            all: {
                icon: MessageCircle,
                title: "No Questions Yet",
                message: "Be the first to ask a question and start the conversation!",
                actionText: "Ask Your First Question"
            },
            solved: {
                icon: CheckCircle,
                title: "No Solved Questions",
                message: "Your solved questions will appear here once they're answered.",
                actionText: "View All Questions"
            },
            unsolved: {
                icon: AlertCircle,
                title: "No Pending Questions",
                message: "Great! All your questions have been answered.",
                actionText: "Ask New Question"
            }
        };

        const {icon: Icon, title, message, actionText} = config[type];

        return (
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="text-center py-12 px-4"
            >
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-10 h-10 text-gray-400"/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
                <Button
                    onClick={handleRetry}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    <RefreshCw className="w-4 h-4 mr-2"/>
                    {actionText}
                </Button>
            </motion.div>
        );
    };

    const ErrorAlert = () => (
        <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className="mb-4"
        >
            <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600"/>
                <AlertDescription className="text-red-800 flex items-center justify-between">
                    <span>{errorState.message}</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRetry}
                        className="ml-4 h-8 px-3 border-red-300 text-red-700 hover:bg-red-100"
                    >
                        <RefreshCw className="w-3 h-3 mr-1"/>
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        </motion.div>
    );

    const formatDate = (isoString: string): string =>{
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
    }

  
    // const subject = ['LokSewa', 'Nursing', 'Engineering', 'MBBS', 'Dental', 'Medical', 'Pharmacy', 'Others']
    console.log("subjects", subjects);
    
    return (
        <div className="w-full max-w-7xl px-4 mx-auto space-y-6">
            <StudentBannerHeader
                title="Student Dashboard"
                subtitle="This is the student dashboard where you can ask questions and get answers from the community."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-semibold font-poppins text-black mb-3">Subject</h3>
                        {subjectsLoading ? (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                        key={i}
                                        className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : subjectsError ? (
                                <p className="text-red-600 text-sm">{subjectsError}</p>
                            ) : (
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                                {subjects.map((subject, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-green-600 border-green-600 text-white text-xs font-poppins whitespace-nowrap"
                                    >
                                        {subject.name}
                                    </Badge>
                                ))}
                                </div>
                            )}
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="space-y-4 bg-gray-100 p-4 sm:p-6 rounded-xl shadow-sm"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold font-poppins text-black">Got a question? Drop it
                            here!</h3>

                        <AnimatePresence>
                            {errorState.hasError && errorState.type === 'submit' && <ErrorAlert/>}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit(handleQuestionSubmit)} className="space-y-4">
                            <div>
                                <Textarea
                                    disabled={submitting}
                                    placeholder="Type your question here..."
                                    {...register("question")}
                                    className="w-full h-20 sm:h-24 border bg-white border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                                />
                                {errors.question && (
                                    <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.question.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-poppins font-semibold text-sm sm:text-base px-4 py-2"
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin"/>
                                            Posting...
                                        </>
                                    ) : 'Post'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-poppins font-semibold text-sm sm:text-base px-4 py-2"
                                    onClick={() => router.push("/student/pins?tab=my")}
                                >
                                    My Pins
                                </Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-poppins font-semibold text-sm sm:text-base px-4 py-2"
                                    onClick={() => router.push("/student/pins?tab=all")}
                                >
                                    All Pins
                                </Button>
                            </div>
                        </form>
                    </motion.div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="text-lg sm:text-xl font-semibold font-poppins text-black">Community Questions</h3>

                            <div className="flex overflow-x-auto bg-gray-100 rounded-lg p-1">
                                {(['all', 'solved', 'unsolved'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                                            activeTab === tab
                                                ? 'bg-white text-green-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab === 'all' ? 'All Questions' :
                                            tab === 'solved' ? 'Solved' : 'Pending'}
                                        {tab !== 'all' && (
                                            <span
                                                className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                                {tab === 'solved' ?
                                                    questions.filter(q => q.is_solved).length :
                                                    questions.filter(q => !q.is_solved).length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence>
                            {errorState.hasError && errorState.type === 'fetch' && <ErrorAlert/>}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    className="space-y-4"
                                >
                                    {Array.from({length: 5}).map((_, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{delay: index * 0.1}}
                                        >
                                            <RepliesCardSkeleton/>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : filteredQuestions.length === 0 ? (
                                <EmptyState type={activeTab}/>
                            ) : (
                                <motion.div
                                    key="questions"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    className="space-y-4"
                                >
                                    {filteredQuestions.map((question, index) => (
                                        <motion.div
                                            key={`${question.id}-${activeTab}`}
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{delay: index * 0.05}}
                                        >
                                            <RepliesCard
                                                name={question?.student_profile?.name}
                                                question={question?.question}
                                                viewCount={question?.view_count}
                                                createdAt={formatDate(question?.created_at)}
                                                replies={question?.answers_count}
                                                replyId={question?.id}
                                                studentId={question?.student_profile?.id}
                                                onDeleteAction={handleDeleteAction}
                                                onEditAction={handleEditAction}
                                                isSolved={question?.is_solved }
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!loading && filteredQuestions.length > 0 && totalPages > 1 && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="flex justify-center mt-6"
                            >
                                <CustomPagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChangeAction={handlePageChange}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.2}}
                    >
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold font-poppins text-black mb-4">Overall
                            Performance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {examData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.3 + index * 0.1}}
                                >
                                    <AnalyticsCard
                                        title={item.title}
                                        total={item.total}
                                        percentage={item.overall}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.4}}
                        className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-3"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Pinned Questions</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/student/pins")}
                                className="w-fit text-xs sm:text-sm"
                            >
                                View All
                            </Button>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm font-poppins font-medium text-gray-700">
                            <li className="p-2 bg-white rounded-md">Lok Sewa General Awareness and Aptitude Quiz</li>
                            <li className="p-2 bg-white rounded-md">Nursing quiz for MN - Adult Health Nursing</li>
                            <li className="p-2 bg-white rounded-md">Nursing MCQs Quiz</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.5}}
                        className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-3"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Mock Test</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/student/mock-tests")}
                                className="w-fit text-xs sm:text-sm"
                            >
                                View All
                            </Button>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm font-poppins font-medium text-gray-700">
                            <li className="p-2 bg-white rounded-md">Lok Sewa General Awareness and Aptitude Quiz</li>
                            <li className="p-2 bg-white rounded-md">Nursing quiz for MN - Adult Health Nursing</li>
                            <li className="p-2 bg-white rounded-md">Nursing MCQs Quiz</li>
                        </ul>
                    </motion.div>

                    {/* <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.6}}
                        className="bg-white p-4 rounded-xl shadow-sm"
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Updates</h3>
                        <div
                            className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-md p-4 sm:p-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-600"></div>
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"></div>
                                <h4 className="text-sm sm:text-lg font-semibold text-gray-800">Offered Packages</h4>
                            </div>
                            <div>
                                <span
                                    className="text-green-600 font-bold text-2xl sm:text-3xl lg:text-4xl">Rs 1200.00</span>
                                <p className="text-gray-500 text-sm sm:text-lg lg:text-xl mt-1">Per month</p>
                            </div>
                        </div>
                    </motion.div> */}
                </div>
            </div>
        </div>
    );
}