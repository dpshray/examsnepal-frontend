"use client"

import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useQuery} from "@tanstack/react-query"
import {AlertCircle, CheckCircle2, Clock, Loader2} from "lucide-react"
import {useRouter} from "next/navigation"

import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {cn} from "@/lib/utils"
import CustomPagination from "@/components/Pagination"
import ExamQuestionCard from "@/app/student/exams/free-quiz/[id]/ExamQuestionCard"
import ExamQuestionSkeleton from "@/app/student/exams/free-quiz/[id]/ExamQuestionSkeleton"
import mockTestService from "@/services/ExamService/MockTest"
import {toast} from "sonner"
import {STUDENT_SCORE_ROUTE} from "@/config/app-constant"

export interface QuizOption {
    question_id: number
    id: number
    option: string
}

export interface QuizQuestion {
    id: number
    question: string
    options: QuizOption[]
    user_choosed?: number | null
}

interface QuizResponse {
    data: QuizQuestion[]
    total: number
    last_page: number
    duration?: number
    total_choosed_options?: number
    status?: boolean
    message?: string
}

interface ExamQuizEngineProps {
    examId: number
    title: string
    subtitle: string
    duration: number
    termsRoute?: string
    onFetchQuestionsAction: (examId: number, page: number) => Promise<QuizResponse>
    onSubmitAction?: (payload: {
        exam_id: number
        is_exam_completed: number
        question_id: number[]
        option_id: number[]
    }) => Promise<void>
}

export default function ExamQuizEngine({
                                           examId,
                                           title,
                                           subtitle,
                                           duration = 30,
                                           termsRoute,
                                           onFetchQuestionsAction,
                                           onSubmitAction
                                       }: ExamQuizEngineProps) {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [time, setTime] = useState(duration * 60)
    const [agreed, setAgreed] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const autoSaveLock = useRef(false)
    const finalSubmitted = useRef(false)

    const {data, isLoading, isError, error} = useQuery<QuizResponse>({
        queryKey: ["exam-quiz", examId, page],
        queryFn: () => onFetchQuestionsAction(examId, page),
        enabled: Number.isFinite(examId),
        retry: 1,
        refetchOnWindowFocus: true,
    })

    useEffect(() => {
        if (data?.duration) setTime(data.duration * 60)
    }, [data?.duration])

    console.log('Data',data)
    const questions = useMemo(() => data?.data ?? [], [data])
    const totalPages = data?.last_page ?? 1
    const totalQuestions = data?.total ?? 0
    const answered = (data?.total_choosed_options ?? 0) + Object.keys(answers).length

    console.log('Answer', answered)
    const progress = totalQuestions ? Math.round((answered / totalQuestions) * 100) : 0

    const selectOption = useCallback((qid: number, oid: number) => {
        setAnswers(prev => ({...prev, [qid]: oid}))
    }, [])

    const submit = useCallback(
        async (completed: boolean) => {
            if (!answered) return
            if (completed && finalSubmitted.current) return

            const payload = {
                exam_id: examId,
                is_exam_completed: completed ? 1 : 0,
                question_id: Object.keys(answers).map(Number),
                option_id: Object.values(answers)
            }

            try {
                const res = await mockTestService.submitExam(payload)

                if (completed) {
                    finalSubmitted.current = true
                    toast.success(res.message || "Exam submitted successfully")
                    router.push(`${STUDENT_SCORE_ROUTE}/${examId}`)
                }

                await onSubmitAction?.(payload)
            } catch {
                if (completed) toast.error("Exam submission failed")
            }
        },
        [answered, answers, examId, onSubmitAction, router]
    )

    const autoSave = useCallback(() => {
        if (autoSaveLock.current || finalSubmitted.current || !answered) return
        autoSaveLock.current = true
        submit(false)
        setTimeout(() => {
            autoSaveLock.current = false
        }, 500)
    }, [answered, submit])


    useEffect(() => {
        const interval = setInterval(() => {
            setTime(t => {
                if (t <= 1) {
                    submit(true)
                    return 0
                }
                if (t % 30 === 0) autoSave()
                return t - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [autoSave, submit])

    const finalSubmit = useCallback(() => {
        if (!answered || submitting || !agreed) return
        setSubmitting(true)
        submit(true)
        setTimeout(() => setSubmitting(false), 800)
    }, [answered, submitting, agreed, submit])

    const handlePageChange = useCallback((p: number) => {
        setPage(p)
        window.scrollTo({top: 0, behavior: "smooth"})
    }, [])

    const formatTime = useCallback((seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
    }, [])

    const isLowTime = time <= 300

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="h-7 w-64 bg-white/20 rounded animate-pulse mb-2"/>
                        <div className="h-4 w-48 bg-white/20 rounded animate-pulse"/>
                    </div>
                </header>

                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-3 items-center">
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"/>
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"/>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="h-2 flex-1 bg-gray-200 rounded animate-pulse"/>
                        </div>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 py-6 space-y-4" role="main" aria-busy="true"
                      aria-label="Loading exam questions">
                    <ExamQuestionSkeleton/>
                    <ExamQuestionSkeleton/>
                    <ExamQuestionSkeleton/>
                </main>
            </div>
        )
    }

    if (isError || data?.status === false) {
        const errorMessage = data?.message || error?.message || "Unable to load exam"

        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center space-y-4" role="alert"
                     aria-live="assertive">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto" aria-hidden="true"/>
                    <h2 className="text-xl font-bold text-gray-900">Exam Not Available</h2>
                    <p className="text-sm text-gray-600">{errorMessage}</p>
                    <Button onClick={() => window.history.back()} className="w-full bg-green-600 hover:bg-green-700">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow" role="banner">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-xl font-bold">{title}</h1>
                    <p className="text-sm opacity-90">{subtitle}</p>
                </div>
            </header>

            <div className="sticky top-0 z-40 bg-white border-b shadow-sm" role="navigation" aria-label="Exam progress">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded border" role="status"
                             aria-label={`${answered} of ${totalQuestions} questions answered`}>
                            <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true"/>
                            <span className="text-sm font-semibold">
                                {answered}/{totalQuestions}
                            </span>
                        </div>

                        <div
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded border",
                                isLowTime ? "bg-red-50 border-red-300 animate-pulse" : "bg-gray-50"
                            )}
                            role="timer"
                            aria-label={`Time remaining: ${formatTime(time)}`}
                            aria-live="polite"
                        >
                            <Clock className={cn("h-4 w-4", isLowTime ? "text-red-600" : "text-gray-600")}
                                   aria-hidden="true"/>
                            <span className="font-mono font-bold text-sm">
                                {formatTime(time)}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Progress value={progress}
                                  className={cn("h-3 rounded-full",
                                      '[&>div]:bg-green-500'
                                  )}
                                  aria-label={`Exam progress: ${progress}%`}/>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-4" role="main">
                {questions.map((q, i) => (
                    <ExamQuestionCard
                        key={q.id}
                        questionNumber={i + 1 + (page - 1) * questions.length}
                        questionText={q.question}
                        options={q.options}
                        selectedValue={answers[q.id] ?? q.user_choosed}
                        onSelectAction={v => selectOption(q.id, v)}

                    />
                ))}

                {page === totalPages && (
                    <div className="bg-white rounded border p-4 space-y-3" role="region" aria-label="Submit exam">
                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="terms-checkbox"
                                checked={agreed}
                                onCheckedChange={v => setAgreed(Boolean(v))}
                                aria-describedby="terms-label"
                                className={cn("mt-1",
                                    'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600',
                                    !termsRoute && "cursor-not-allowed opacity-50")}
                            />
                            <Label htmlFor="terms-checkbox" id="terms-label" className="text-sm cursor-pointer">
                                I agree to the{" "}
                                <a href={termsRoute} target="_blank" rel="noopener noreferrer"
                                   className="underline text-green-600 hover:text-green-700">
                                    terms of service
                                </a>
                            </Label>
                        </div>
                        <Button
                            disabled={!agreed || submitting || !answered}
                            onClick={finalSubmit}
                            className="w-full bg-green-600 hover:bg-green-700"
                            aria-label={!agreed ? "Please agree to terms first" : submitting ? "Submitting exam" : "Submit exam"}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true"/>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                "Submit Exam"
                            )}
                        </Button>
                    </div>
                )}

                <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChangeAction={handlePageChange}
                />
            </main>
        </div>
    )
}