'use client';

import {useCallback, useEffect, useState} from 'react';
import {QuestionCard, QuestionCardSkeleton} from '@/components/Exams/QuestionCard';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import Image from 'next/image';
import {cn, FormatExamTime} from "@/lib/utils";
import { toast } from 'sonner';
import { MdWarningAmber } from 'react-icons/md';

interface Option {
    id: number;
    label: string;
    option:string
    value: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    question: string;
    explanation: string;
    options: Option[];
}

interface QuizEngineProps {
    storageKey?: string;
    quiz: Question[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    onNextAction: () => void;
    onPrevAction: () => void;
    onSubmitAction: (payload: any) => Promise<any>;
    examId: number;
    duration?: number;
    totalQuestions?: number;
    correctAnswers?: number;
    setCurrentPageAction: (page: number) => void;
    className?: string;
}

export default function QuizEngine({
    storageKey,
    quiz,
    currentPage,
    totalPages,
    loading,
    onNextAction,
    onPrevAction,
    onSubmitAction,
    examId,
    duration = 3 * 60 * 60,
    totalQuestions = 0,
    correctAnswers = 0,
    setCurrentPageAction,
    className,
}: QuizEngineProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);

    useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        if (!isSubmitted) {
            event.preventDefault();
            event.returnValue = '';
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isSubmitted]);



    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!isSubmitted) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSubmitted]);


    const handleSelect = (qid: number) => (value: string) => {
        setSelectedAnswers(prev => ({...prev, [qid]: value}));
    };

    const handleSubmit = useCallback(async () => {
        if (isSubmitted) return;

        const payload = {
            exam_id: examId,
            question_ids: quiz.map(q => q.id),
            question_id: Object.keys(selectedAnswers).map(id => Number(id)),
            option_id: Object.values(selectedAnswers),
        };

        try {
            await onSubmitAction(payload);
            setIsSubmitted(true);
            setTimeLeft(0);
            toast.success('Exam submitted!');
            if (storageKey) localStorage.removeItem(storageKey);
        } catch {
            toast.error('Failed to submit exam. Please try again.');
        }
    }, [isSubmitted, examId, quiz, selectedAnswers, onSubmitAction]);

    useEffect(() => {
        if (timeLeft <= 0 && !isSubmitted) {
            handleSubmit();
        } else {
            const timer = setInterval(() => {
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, handleSubmit, isSubmitted]);

    const handleViewDetails = () => {
        setCurrentPageAction(1);
        setShowResult(true);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <section className={cn('w-full mx-auto my-6 md:my-10', className)}>
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-md text-sm font-medium">
                    <MdWarningAmber className='w-4 h-4'/> Once the exam starts, refreshing the page, closing the browser, or leaving this page will
                    automatically submit your exam.
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-6">
                    <div className="flex items-center gap-4">
                        <Image src="/book.svg" alt="Exam book icon" width={48} height={48} />
                        <article>
                            <span className="text-lg font-semibold">10 Questions Per Page</span>
                            <p className="text-sm text-muted-foreground">
                                Question {currentPage * 10 - 9} - {Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10}
                            </p>
                        </article>
                    </div>
                    <div className="text-center flex-1">
                        <p className="text-sm text-muted-foreground">Time Left:</p>
                        {timeLeft > 0 ? (
                            <p className="text-lg font-semibold text-red-500">{FormatExamTime(timeLeft)}</p>
                        ) : (
                            <p className="text-lg font-semibold text-red-500">Time&#39;s up!</p>
                        )}
                    </div>
                    <Image src="/exam.png" alt="Exam visual" width={48} height={48} />
                </div>

                {loading
                    ? [...Array(10)].map((_, i) => <QuestionCardSkeleton key={i} />)
                    : quiz.map((q, index) => {
                        const mappedOptions = q.options.map(opt => ({
                            label: opt.option,           
                            value: String(opt.id),      
                            isCorrect: Boolean(opt.value), 
                        }));

                        const correctValues = mappedOptions
                            .filter(o => o.isCorrect)
                            .map(o => o.value); 

                        return (
                            <QuestionCard
                                key={q.id}
                                questionNumber={(currentPage - 1) * 10 + index + 1}
                                questionText={q.question}
                                options={mappedOptions}
                                onSelect={handleSelect(q.id)}
                                selectedValue={selectedAnswers[q.id]}
                                showFeedback={showResult}
                                correctAnswers={correctValues} 
                                explanation={q.explanation}
                            />
                        );
                    })
                }

                <div className="flex justify-between mt-4">
                    <Button onClick={onPrevAction} disabled={currentPage === 1} variant="destructive">
                        Previous
                    </Button>
                    <Button onClick={onNextAction} disabled={currentPage === totalPages} className="primary-btn">
                        Next
                    </Button>
                </div>

                {currentPage === totalPages && !isSubmitted && (
                    <>
                        <div className="mt-4 flex items-center">
                            <Checkbox checked={isAgreedToTerms} onCheckedChange={() => setIsAgreedToTerms(v => !v)} className="mr-2" />
                            <span className="text-sm">
                                I agree to the <a href="#" className="text-green-600">terms and conditions</a>
                            </span>
                        </div>
                        <Button type="submit" onClick={handleSubmit} className="mt-4 primary-btn" disabled={!isAgreedToTerms}>
                            Submit Exam
                        </Button>
                    </>
                )}

                {isSubmitted && (
                    <div className="mt-6 text-center">
                        <h3 className="text-lg font-semibold">
                            Your Score: {correctAnswers} / {totalQuestions}
                        </h3>
                        <Button className="mt-4 primary-btn" onClick={handleViewDetails}>
                            View Details
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
