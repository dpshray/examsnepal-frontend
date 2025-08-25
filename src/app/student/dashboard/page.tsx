"use client";

import {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";

import {QuestionSchema} from "@/schema/authSchema";
import forumService from "@/services/ForumService";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Badge} from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import RepliesCardSkeleton, {AnalyticsCard, RepliesCard} from "@/components/card/card";
import {StudentBannerHeader} from "@/components/banner/header";
import studentService from "@/services/StudentService";
import {ExamData} from "@/types/types";
import useMockCompletedQuizzes from "@/hooks/useMockCompletedQuizzes";

export default function StudentDashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const DEFAULT_EXAM_COUNT: ExamData = {
        free: {total: 0, overall: 0},
        sprint: {total: 0, overall: 0},
        mock: {total: 0, overall: 0},
    };
    const [examCount, setExamCount] = useState<ExamData>(DEFAULT_EXAM_COUNT);
    const router = useRouter();

    const {register, handleSubmit} = useForm({
        resolver: yupResolver(QuestionSchema),
    });

    const handleQuestionSubmit = async (data: any) => {
        setLoading(true);
        try {
            console.log(` data`, data);
            const response = await forumService.addForumQuestion(data);
            if (response) toast.success(response?.message || "Question submitted successfully");
            handleAllQuestions(currentPage);
        } catch (error: any) {
            const errorMessage = error?.data?.errors;
            Object.keys(errorMessage).forEach((key: string) => {
                toast.error(errorMessage[key][0]);
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAllQuestions = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await forumService.getAllForumQuestions(page);
            setQuestions(response?.data?.data || []);
            setTotalPages(Math.ceil(response?.data?.total / 10));
            console.log(`All Post from student dashboard ${currentPage}`, response?.data?.data);
        } catch (error: any) {
            const errorMessage = error?.data?.errors;

            Object.keys(errorMessage).forEach((key) => {
                toast.error(errorMessage[key][0]);
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const handleDeleteAction = async (id: number) => {
        try {
            console.log(`delete id of reply card`, id);
            const response = await forumService.deleteOwnForumQuestion(id);
            if (response) toast.success(response?.message || "Question deleted successfully");
            handleAllQuestions(currentPage);
        } catch (error: any) {
            console.log(` error`, error);
            const errorMessage = error?.data?.errors;
            Object.keys(errorMessage).forEach((key: string) => {
                toast.error(errorMessage[key][0]);
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        handleAllQuestions(page);
    }
    useEffect(() => {
        handleAllQuestions(currentPage);
    }, [handleAllQuestions, currentPage]);

    const handleEditAction = async (id: number, updatedQuestion: string) => {
        try {
            const response = await forumService.editOwnForumQuestion(id, {question: updatedQuestion});
            toast.success(response?.message || "Question updated successfully");
            handleAllQuestions(currentPage); // Refresh list
        } catch (error: any) {
            const errorMessage = error?.data?.errors;
            Object.keys(errorMessage).forEach((key: string) => {
                toast.error(errorMessage[key][0]);
            });
        }
    };


    const handleExamCount = async () => {
        try {
            const response = await studentService.totalExamCount()
            console.log(`Exam Count`, response);
            setExamCount(response?.data || {free: {}, sprint: {}, mock: {}});
            toast.success(response?.message || "Exam count fetched successfully");
        } catch (error: any) {
            const errorMessage = error?.data?.errors;
            Object.keys(errorMessage).forEach((key: string) => {
                toast.error(errorMessage[key][0]);
            });
        }
    }

    const examData = [
        {title: 'Free Quizzes', ...examCount.free},
        {title: 'Sprint Quizzes', ...examCount.sprint},
        {title: 'Mock Tests', ...examCount.mock},
    ];
    useEffect(() => {
        handleExamCount();
    }, []);
    const {completedMockQuizzes} = useMockCompletedQuizzes()
    return (
        <div className="w-full max-w-7xl px-4 mx-auto space-y-6">
            <StudentBannerHeader
                title="Student Dashboard"
                subtitle="This is the student dashboard where you can ask questions and get answers from the community."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Subject Badges */}
                    <div>
                        <h3 className="text-2xl font-semibold font-poppins text-black mb-2">Subject</h3>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {['LokSewa', 'Nursing', 'Engineering', 'MBBS', 'Dental', 'Medical', 'Pharmacy', 'Others'].map((subject, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-green-600 border-green-600 text-white text-sm font-poppins"
                                >
                                    {subject}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Post Question Form */}
                    <div className="space-y-4 bg-gray-100 p-4 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold font-poppins text-black">Got a question? Drop it here!</h3>
                        <form onSubmit={handleSubmit(handleQuestionSubmit)} className="space-y-4">
                            <Textarea
                                disabled={loading}
                                placeholder="Type your question here..."
                                {...register("question")}
                                className="w-full h-24 border bg-white border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    variant="default"
                                    className="bg-primaryGreen hover:bg-green-700 text-white font-poppins font-semibold"
                                >
                                    Post
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-amber-600 hover:bg-amber-700 !text-white font-poppins font-semibold"
                                    onClick={() => router.push("/student/pins?tab=my")}
                                >
                                    My Pins
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white font-poppins font-semibold"
                                    onClick={() => router.push("/student/pins?tab=all")}
                                >
                                    All Pins
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Question List */}
                    <div className="space-y-4">
                        {loading ? (
                            Array.from({length: 5}).map((_, index) => <RepliesCardSkeleton key={index}/>)
                        ) : (
                            questions?.map((question, index) => (
                                <RepliesCard
                                    key={index}
                                    name={question?.student_profile?.name}
                                    question={question?.question}
                                    replies={question?.answers_count}
                                    replyId={question?.id}
                                    studentId={question?.student_profile?.id}
                                    onDeleteAction={handleDeleteAction}
                                    onEditAction={handleEditAction}
                                />
                            ))
                        )}

                        <div className="flex justify-center mt-4">
                            <Pagination totalPages={totalPages} currentPage={currentPage}
                                        onPageChange={handlePageChange}/>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Performance */}
                    <div>
                        <h2 className="text-2xl font-semibold font-poppins text-black mb-4">Overall Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            {examData.map((item, index) => (
                                <AnalyticsCard
                                    key={index}
                                    title={item.title}
                                    total={item.total}
                                    percentage={item.overall}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Pinned Questions */}
                    <div className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Pinned Questions</h3>
                            <Button variant="ghost" onClick={() => toast.success("View All Pinned Questions")}>
                                View All
                            </Button>
                        </div>
                        <ul className="space-y-1 text-sm font-poppins font-medium text-gray-700">
                            <li>Lok Sewa General Awareness and Aptitude Quiz</li>
                            <li>Nursing quiz for MN - Adult Health Nursing</li>
                            <li>Nursing MCQs Quiz</li>
                        </ul>
                    </div>

                    {/* Mock Tests */}
                    <div className="bg-gray-100 p-4 rounded-xl shadow-sm space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Mock Test</h3>
                            <Button variant="ghost" onClick={() => toast.success("View All Mock Tests")}>
                                View All
                            </Button>
                        </div>
                        <ul className="space-y-1 text-sm font-poppins font-medium text-gray-700">
                            <li>Lok Sewa General Awareness and Aptitude Quiz</li>
                            <li>Nursing quiz for MN - Adult Health Nursing</li>
                            <li>Nursing MCQs Quiz</li>
                        </ul>
                    </div>

                    {/* Subscription Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Updates</h3>
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-md p-6 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-600"></div>
                                <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                <h4 className="text-lg font-semibold text-gray-800">Offered Packages</h4>
                            </div>
                            <div>
                                <span className="text-green-600 font-bold text-4xl">Rs 1200.00</span>
                                <p className="text-gray-500 text-xl mt-1">Per month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
