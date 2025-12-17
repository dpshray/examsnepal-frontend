'use client';

import {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import {StudentBannerHeader} from '@/components/banner/header';
import {QuestionCard, QuestionCardSkeleton} from '@/components/Exams/QuestionCard';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import studentService from '@/services/StudentService';
import StudentScoreCard from '@/components/card/StudentScoreCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CreditCard, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface Option {
    id: number;
    question_id: number;
    option: string;
    value: number;
}

interface Question {
    id: number;
    question: string;
    explanation: string;
    options: Option[];
    token: string;
}

interface ErrorComponentProps {
    title: string;
    message: string;
    onViewScoreAction: () => void;
    allStudentsScore: any[];
    isScoreLoading: boolean;
    subscription?: boolean;
}

const MAX_WRONG_ATTEMPTS = 3;

const ErrorComponent = ({
                            title,
                            message,
                            onViewScoreAction,
                            allStudentsScore,
                            isScoreLoading,
                        }: ErrorComponentProps) => (
    <section className=" w-full max-w-7xl mx-auto font-poppins text-center">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="size-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription className="text-base">{message}</AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onViewScoreAction}
                disabled={isScoreLoading || allStudentsScore.length > 0}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <TrendingUp className="size-4" />
                {isScoreLoading ? "Loading..." : "View Score"}
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/student/subscription">
                  <CreditCard className="size-4" />
                  Upgrade Subscription
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>


        {allStudentsScore.length > 0 && (
            <div className="max-w-3xl mx-auto mt-10 mb-4">
                <h2 className="text-xl font-semibold mb-4">All Students&#39; Scores</h2>
                <div className="space-y-4">
                    {allStudentsScore.map((student, index) => (
                        <StudentScoreCard
                            key={student.id || index}
                            id={student.id}
                            student_id={student.student_id}
                            score={student.score}
                            student={student.student}
                            isTopThree={index < 3}
                        />
                    ))}
                </div>
            </div>
        )}
    </section>
);

export default function QuestionsPool() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [correctAnswerIds, setCorrectAnswerIds] = useState<number[]>([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showFinalScreen, setShowFinalScreen] = useState(false);
    const [allStudentsScore, setAllStudentsScore] = useState<any[]>([]);
    const [isScoreLoading, setIsScoreLoading] = useState(false);
    const didFetchRef = useRef(false);

    const fetchQuestion = async (token: string = process.env.NEXT_PUBLIC_POOL_TOKEN || '') => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const {data} = await studentService.getQuestionPoolRequest(token);
            const fetchedQuestion = data as Question;

            setQuestion(fetchedQuestion);
            setSelectedOptionId(null);
            setCorrectAnswerIds(
                fetchedQuestion.options.filter(opt => opt.value === 1).map(opt => opt.id)
            );
            setQuestionCount(prev => prev + 1);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to load Question Pool.';
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async () => {
        if (!question || selectedOptionId === null) {
            toast.error('Please select an option before submitting.');
            return;
        }

        const isCorrect = correctAnswerIds.includes(selectedOptionId);

        if (!isCorrect) {
            const updatedWrongAttempts = wrongAttempts + 1;
            setWrongAttempts(updatedWrongAttempts);

            if (updatedWrongAttempts >= MAX_WRONG_ATTEMPTS) {
                setShowFinalScreen(true);
                toast.error("You've reached the maximum number of wrong attempts.");
                return;
            }
        } else {
            setScore(prev => prev + 1);
        }

        try {
            const {data} = await studentService.sendQuestionPoolRequest({
                question_id: question.id,
                option_id: selectedOptionId,
            });

            await fetchQuestion(data.token);
            toast.success('Answer submitted successfully.');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Submission failed.';
            setErrorMessage(message);
            toast.error(message);
        }
    };

    const handleViewScore = async () => {
        setIsScoreLoading(true);
        try {
            const {data} = await studentService.getPoolScore();
            setAllStudentsScore(data?.data);
            toast.success('Score fetched successfully.');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to load scores.';
            toast.error(message);
        } finally {
            setIsScoreLoading(false);
        }
    };


    useEffect(() => {
        if (!didFetchRef.current) {
            fetchQuestion();
            didFetchRef.current = true;
        }
    }, []);

    if (showFinalScreen) {
        return (
            <ErrorComponent
                title="Game Over"
                message={`You have reached the maximum number of wrong attempts. Final Score: ${score}`}
                onViewScoreAction={handleViewScore}
                allStudentsScore={allStudentsScore}
                isScoreLoading={isScoreLoading}
            />
        );
    }

    return (
        <section className="max-w-7xl w-full mx-auto font-poppins px-4">
            <StudentBannerHeader
                title="Questions Pool"
                subtitle="Explore a wide range of questions to enhance your learning experience."
            />

            <div className="mt-8 text-center space-y-3">
                <h1 className="text-2xl font-bold">Questions Pool</h1>
                <p className="text-gray-700">
                    Play through MCQ questions until you reach 3 wrong attempts. Track your progress and learn as you
                    go.
                </p>
                <p className="text-gray-600 text-sm">
                    A fun, low-pressure way to sharpen your knowledge.
                </p>
            </div>

            {questionCount > 0 && (
                <div className="my-6">
                    <p className="text-sm text-gray-600 mb-1">
                        Wrong Attempts: {wrongAttempts} / {MAX_WRONG_ATTEMPTS}
                    </p>
                    <Progress value={(wrongAttempts / MAX_WRONG_ATTEMPTS) * 100} className="h-2"/>
                </div>
            )}

            <div className="mt-8">
                {isLoading ? (
                    <QuestionCardSkeleton/>
                ) : question ? (
                    <div className="shadow-md p-4 bg-white">
                        <QuestionCard
                            className="bg-transparent border-none shadow-none"
                            questionNumber={questionCount}
                            questionText={question.question}
                            options={question.options.map(opt => ({
                                label: opt.option,
                                value: String(opt.id),
                                isCorrect: opt.value === 1,
                            }))}
                            selectedValue={selectedOptionId?.toString() || ''}
                            onSelect={id => setSelectedOptionId(Number(id))}
                            showFeedback={false}
                            correctAnswers={correctAnswerIds.map(String)}
                            explanation={question.explanation}
                        />

                        <div className="mt-2 px-6">
                            <Button
                                variant="secondary"
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={!selectedOptionId || isLoading}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                ) : errorMessage ? (
                    <ErrorComponent
                        title="Oops!"
                        message={' You have reached the maximum number of wrong attempts. Please try again later after 24 hours.'}
                        subscription={true}
                        onViewScoreAction={handleViewScore}
                        allStudentsScore={allStudentsScore}
                        isScoreLoading={isScoreLoading}
                    />
                ) : null}
            </div>
        </section>
    );
}
