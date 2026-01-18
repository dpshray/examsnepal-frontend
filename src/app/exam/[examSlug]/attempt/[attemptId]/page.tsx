"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Save, X } from "lucide-react"
import { Question } from "@/types/CorporateExamTypes"
import { useGetExamType, useGetQuestions, useSaveAnswer } from "@/hooks/corporate/useCorporateExam"
import { SubmissionDialog } from "@/components/studentExam/SubmissionDialog"
import { ExamTimer } from "@/components/studentExam/ExamTimer"
import { QuestionDisplay } from "@/components/studentExam/QuestionDisplay"
import { QuestionNavigation } from "@/components/studentExam/QuestionNavigation"
import { toast } from "sonner"
import { usePreventUnload } from "@/hooks/corporate/usePreventUnload"
import { useClipboardProtection } from "@/hooks/corporate/useClipboardProtection"
import { useTabSwitchDetection } from "@/hooks/corporate/useTabSwitchDetection"
import { ExamLoadingSkeleton } from "@/components/skeleton/ExamLoadingSkeleton"

type AnswerValue = number | string | null

export default function ExamAttemptPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const attemptId = Number.parseInt(params.attemptId as string)
  const examSlug = params.examSlug as string

  const QUESTIONS_PER_PAGE = 2
  const pageFromUrl = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const [answers, setAnswers] = useState<Map<number, AnswerValue>>(new Map())
  const [questionNumberMap, setQuestionNumberMap] = useState<Map<number, number>>(new Map())
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const [isAnswersSaved, setIsAnswersSaved] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const { data: examType } = useGetExamType(examSlug)
  const examTypeData = examType?.exam_type 
  const { data: questionsData, isLoading, isError, error } = useGetQuestions(attemptId, examTypeData, { page: currentPage, per_page: QUESTIONS_PER_PAGE })
  const saveAnswerMutation = useSaveAnswer()

  // Memoize questions to prevent dependency changes
  const questions = useMemo(() => questionsData?.data?.data || [], [questionsData?.data?.data])
  
  const sectionName = questionsData?.data?.title || ""
  const currentPageApi = questionsData?.data?.current_page || 1
  const totalPages = questionsData?.data?.last_page || 1
  const totalQuestions = questionsData?.data?.total || 0
  const examDuration = questionsData?.data?.duration 
    ? questionsData.data.duration * 60 
    : 60 * 60 

  useEffect(() => {
    const timeUpKey = `exam_time_up_${attemptId}`
    const savedTimeUpState = sessionStorage.getItem(timeUpKey)
    
    if (savedTimeUpState === 'true') {
      setIsTimeUp(true)
      setShowSubmitDialog(true)
    }
  }, [attemptId])

  // Store question numbers in the map when questions load
  useEffect(() => {
    if (questions.length > 0) {
      setQuestionNumberMap((prevMap) => {
        const newMap = new Map(prevMap)
        questions.forEach((question: Question) => {
          if (question.number && question.id) {
            newMap.set(question.id, question.number)
          }
        })
        return newMap
      })
    }
  }, [questions])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', currentPage.toString())
    router.replace(url.pathname + url.search, { scroll: false })
  }, [currentPage, router])
  
  usePreventUnload(true)
  useClipboardProtection()

  useTabSwitchDetection({
    onSwitch: () => {
      setTabSwitchCount(prev => prev + 1)
      setShowTabWarning(true)
    },
  })

  useEffect(() => {
    const el = questionRefs.current[activeQuestionIndex]
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [activeQuestionIndex, currentPage])

  const handleAnswerChange = (questionId: number, value: number | string | null) => {
    setAnswers(new Map(answers.set(questionId, value)))
    setHasUnsavedChanges(true)
    setIsAnswersSaved(false)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleQuestionJump = (questionIndex: number) => {
    const page = Math.floor(questionIndex / QUESTIONS_PER_PAGE) + 1
    
    setCurrentPage(page)
    setActiveQuestionIndex(questionIndex)
  }

  const handleSaveAnswers = async () => {
    if (answers.size === 0) {
      toast.error("No answers to save")
      return
    }

    try {
      const formattedAnswers = Array.from(answers.entries()).map(([questionId, value]) => {
        const isSubjective = typeof value === 'string'
        const isOption = typeof value === 'number'

        return {
          question_id: questionId,
          option_id: isOption ? value : null,
          subjective_answer: isSubjective ? value : null
        }
      }).filter(answer => 
        answer.option_id !== null || answer.subjective_answer !== null
      )

      await saveAnswerMutation.mutateAsync({
        attemptId: attemptId,
        data: { answer: formattedAnswers },
        type: examTypeData
      })

      setIsAnswersSaved(true)
      setHasUnsavedChanges(false)
      toast.success("Answers saved successfully!")
    } catch (error) {
      console.error("Failed to save answers:", error)
      toast.error("Failed to save answers. Please try again.")
    }
  }

  const handleSubmit = () => {
    if (!isAnswersSaved) {
      toast.error("Please save your answers before submitting the exam")
      return
    }
    setShowSubmitDialog(true)
  }

  const handleTimeUp = () => {
    // Persist time up state to survive reloads
    const timeUpKey = `exam_time_up_${attemptId}`
    sessionStorage.setItem(timeUpKey, 'true')
    
    setIsTimeUp(true)
    if (hasUnsavedChanges && answers.size > 0) {
      handleSaveAnswers().then(() => {
        setShowSubmitDialog(true)
      })
    } else {
      setShowSubmitDialog(true)
    }
  }

  const answeredQuestionIndices = useMemo(() => {
    const indices: number[] = []
    
    answers.forEach((value, questionId) => {
      if (value !== null && value !== '') {
        const questionNumber = questionNumberMap.get(questionId)
        if (questionNumber) {
          // Convert to 0-based index for the navigation component
          indices.push(questionNumber - 1)
        }
      }
    })
    
    return indices
  }, [answers, questionNumberMap])

  if (isLoading) {
    return <ExamLoadingSkeleton />
  }

  if (isError) {
    const errorMessage = (error as any)?.data?.message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg">Failed to load exam. Please try again.</div>
        <div className="text-red-500 mt-2">{errorMessage}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showTabWarning && (
        <div className="fixed top-0 left-0 right-0 z-100 bg-red-600 text-white px-4 py-3 shadow-lg animate-slide-down">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                Warning: Tab switch detected! ({tabSwitchCount} time{tabSwitchCount !== 1 ? "s" : ""}). 
                Repeated tab switching may lead to exam suspension.
              </span>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowTabWarning(false)}
              className="text-black"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{sectionName}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Page {currentPageApi} of {totalPages} · Total {totalQuestions} questions
              </p>
            </div>
            {/* <ExamTimer attemptId={attemptId} initialTime={examDuration} onTimeUp={handleTimeUp} /> */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {questions.map((question: Question) => {
              const questionIndex = question.number - 1

              return (
                <div
                  key={question.id}
                  ref={(el) => {
                    questionRefs.current[questionIndex] = el
                  }}
                  className="scroll-mt-28"
                >
                  <QuestionDisplay
                    question={question}
                    questionNumber={question.number}
                    selectedAnswer={answers.get(question.id) || null}
                    onAnswerChange={handleAnswerChange}
                  />
                </div>
              )
            })}

            {totalPages > 1 && (
              <div className="p-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  disabled={currentPageApi === 1}
                  onClick={() => handlePageChange(currentPageApi - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {currentPageApi} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={currentPageApi === totalPages}
                  onClick={() => handlePageChange(currentPageApi + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleSaveAnswers}
                disabled={saveAnswerMutation.isPending || !hasUnsavedChanges}
              >
                {saveAnswerMutation.isPending ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : isAnswersSaved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Answers Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Answers
                  </>
                )}
              </Button>
              <Button 
                size="lg" 
                variant="green" 
                onClick={handleSubmit}
                disabled={!isAnswersSaved}
              >
                Submit Exam
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <QuestionNavigation
              totalQuestions={totalQuestions}
              currentQuestionIndex={activeQuestionIndex}
              answeredQuestions={answeredQuestionIndices}
              onQuestionClick={handleQuestionJump}
            />
          </div>
        </div>
      </div>

      {/* <SubmissionDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        attemptId={attemptId}
        totalQuestions={totalQuestions}
        answeredQuestions={answers.size}
        answers={answers}
        type={examTypeData}
        examSlug={examSlug}
        isTimeUp={isTimeUp}
      /> */}
    </div>
  )
}