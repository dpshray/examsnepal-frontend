"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Save, X } from "lucide-react"
import { Question } from "@/types/CorporateExamTypes"
import { useGetExamDetails, useGetExamType, useGetQuestions, useSaveAnswer, useStartExam } from "@/hooks/useCorporateExam"
import { SubmissionDialog } from "@/components/studentExam/SubmissionDialog"
import { ExamTimer } from "@/components/studentExam/ExamTimer"
import { QuestionDisplay } from "@/components/studentExam/QuestionDisplay"
import { QuestionNavigation } from "@/components/studentExam/QuestionNavigation"
import { toast } from "sonner"
import { usePreventUnload } from "@/hooks/usePreventUnload"
import { useClipboardProtection } from "@/hooks/useClipboardProtection"
import { useTabSwitchDetection } from "@/hooks/useTabSwitchDetection"
import { ExamLoadingSkeleton } from "@/components/skeleton/ExamLoadingSkeleton"
import { useExamStorage } from "@/hooks/useExamStorage"
import { useAnswerManager } from "@/hooks/useAnswerManager"
import { getTimerKeys } from "@/lib/utils"
import { SectionSelector } from "@/components/studentExam/SectionSelector"

export default function ExamAttemptPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const examSlug = params.examSlug as string

  // Storage and state management
  const { state, updateState, clearStorage } = useExamStorage(examSlug)
  const { 
    selectedSection, 
    attemptIds, 
    answers, 
    currentPage, 
    tabSwitchCount, 
    submittedSections 
  } = state

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [isExamComplete, setIsExamComplete] = useState(false) 
  const [questionNumberMap, setQuestionNumberMap] = useState<Map<number, number>>(new Map())
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const QUESTIONS_PER_PAGE = 2
  const DEFAULT_EXAM_DURATION = 60 * 60 

  // API hooks
  const { data: examType } = useGetExamType(examSlug)
  const examTypeData = examType?.exam_type
  const { data: getExamDetails } = useGetExamDetails({examSlug, type: examTypeData})
  const examData = getExamDetails?.data
  const { mutate: startExam, isPending: isStartingExam } = useStartExam()
  const saveAnswerMutation = useSaveAnswer()

  const currentAttemptId = selectedSection ? attemptIds.get(selectedSection) || null : null

  const { data: questionsData, isLoading, isError, error } = useGetQuestions(
    currentAttemptId || 0, 
    examTypeData, 
    { page: currentPage, per_page: QUESTIONS_PER_PAGE },
  )

  // Answer management
  const {
    currentSectionAnswers,
    hasUnsavedChanges,
    isAnswersSaved,
    handleAnswerChange,
    resetSaveStatus,
    markAsSaved,
  } = useAnswerManager(selectedSection, answers, updateState)

  const questions = useMemo(() => questionsData?.data?.data || [], [questionsData?.data?.data])
  const sectionName = questionsData?.data?.title || ""
  const currentPageApi = questionsData?.data?.current_page || 1
  const totalPages = questionsData?.data?.last_page || 1
  const totalQuestions = questionsData?.data?.total || 0
  const examDuration = examData?.duration ? examData.duration * 60 : DEFAULT_EXAM_DURATION

  // Sync URL with current page
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get('page')) || 1
    if (pageFromUrl !== currentPage) {
      updateState({ currentPage: pageFromUrl })
    }
  }, [searchParams])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', currentPage.toString())
    router.replace(url.pathname + url.search, { scroll: false })
  }, [currentPage, router])

  // Check for time up state
  useEffect(() => {
    if (currentAttemptId) {
      const { timeUp } = getTimerKeys(examSlug)
      const savedTimeUpState = sessionStorage.getItem(timeUp)
      
      if (savedTimeUpState === 'true') {
        setIsTimeUp(true)
        setShowSubmitDialog(true)
      }
    }
  }, [currentAttemptId, examSlug])

  // Build question number map
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

  // Scroll to active question
  useEffect(() => {
    const el = questionRefs.current[activeQuestionIndex]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [activeQuestionIndex, currentPage])

  // Security hooks
  usePreventUnload(!!selectedSection)
  useClipboardProtection()
  useTabSwitchDetection({
    onSwitch: () => {
      updateState({ tabSwitchCount: tabSwitchCount + 1 })
      setShowTabWarning(true)
    },
  })

  // Answered questions tracking
  const answeredQuestionIndices = useMemo(() => {
    const indices: number[] = []
    
    currentSectionAnswers.forEach((value, questionId) => {
      if (value !== null && value !== '') {
        const questionNumber = questionNumberMap.get(questionId)
        if (questionNumber) {
          indices.push(questionNumber - 1)
        }
      }
    })
    
    return indices
  }, [currentSectionAnswers, questionNumberMap])

  // Event handlers
  const handleSectionSelect = useCallback((sectionSlug: string) => {
    if (isStartingExam) return

    const sectionData = examData?.sections?.find((s: any) => s.slug === sectionSlug)
    const isSubmittedInBackend = sectionData?.is_completed === true
    const isSubmittedInState = submittedSections.has(sectionSlug)

    if (isSubmittedInBackend || isSubmittedInState) {
      toast.error("This section has already been submitted")
      return
    }

    if (attemptIds.has(sectionSlug)) {
      updateState({ selectedSection: sectionSlug, currentPage: 1 })
      toast.success("Section loaded!")
      return
    }

    if (attemptIds.size === 0) {
      const { endTime, timeUp } = getTimerKeys(examSlug)
      localStorage.removeItem(endTime)
      sessionStorage.removeItem(timeUp)
    }

    startExam(
      { examSlug, sectionSlug, type: examTypeData },
      {
        onSuccess: (response) => {
          const newAttemptId = response.data.attempt_id
          const newAttemptIds = new Map(attemptIds)
          newAttemptIds.set(sectionSlug, newAttemptId)
          
          const newAnswers = new Map(answers)
          if (!newAnswers.has(sectionSlug)) {
            newAnswers.set(sectionSlug, new Map())
          }
          
          updateState({ 
            attemptIds: newAttemptIds,
            selectedSection: sectionSlug,
            currentPage: 1,
            answers: newAnswers
          })
          
          toast.success("Section loaded successfully!")
        },
        onError: (err: any) => {
          toast.error(err?.data?.message || "Error loading section!")
        },
      }
    )
  }, [isStartingExam, submittedSections, attemptIds, answers, examSlug, examTypeData, startExam, updateState, examData?.sections])

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateState({ currentPage: page })
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [totalPages, updateState])

  const handleQuestionJump = useCallback((questionIndex: number) => {
    const page = Math.floor(questionIndex / QUESTIONS_PER_PAGE) + 1
    updateState({ currentPage: page })
    setActiveQuestionIndex(questionIndex)
  }, [updateState])

  const handleSaveAnswers = useCallback(async () => {
    if (!selectedSection) {
      toast.error("No section selected")
      return
    }

    if (!currentSectionAnswers || currentSectionAnswers.size === 0) {
      toast.error("No answers to save")
      return
    }

    if (!currentAttemptId) {
      toast.error("No active attempt")
      return
    }

    try {
      const formattedAnswers = Array.from(currentSectionAnswers.entries()).map(([questionId, value]) => {
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
        attemptId: currentAttemptId,
        data: { answer: formattedAnswers },
        type: examTypeData
      })

      markAsSaved()
      toast.success("Answers saved successfully!")
    } catch (error) {
      console.error("Failed to save answers:", error)
      toast.error("Failed to save answers. Please try again.")
    }
  }, [selectedSection, currentSectionAnswers, currentAttemptId, examTypeData, saveAnswerMutation, markAsSaved])

  const handleSubmit = useCallback(() => {
    if (!isAnswersSaved) {
      toast.error("Please save your answers before submitting the section")
      return
    }
    setShowSubmitDialog(true)
  }, [isAnswersSaved])

  const handleSectionSubmitted = useCallback(() => {
    if (!selectedSection) return

    const newSubmittedSections = new Set(submittedSections)
    newSubmittedSections.add(selectedSection)
    updateState({ submittedSections: newSubmittedSections })

    const totalSections = examData?.sections?.length || 0
    if (newSubmittedSections.size === totalSections) {
      setIsExamComplete(true)
      
      setTimeout(() => {
        clearStorage()
        router.replace(`/exam/${examSlug}/completed`)
      }, 100)
    } else {
      updateState({ selectedSection: null })
      toast.success("Section submitted! Please complete remaining sections.")
      resetSaveStatus()
    }
  }, [selectedSection, submittedSections, examData, clearStorage, router, examSlug, updateState, resetSaveStatus])

  const handleTimeUp = useCallback(() => {
    const { timeUp } = getTimerKeys(examSlug)
    sessionStorage.setItem(timeUp, 'true')
    
    setIsTimeUp(true)
    if (hasUnsavedChanges && selectedSection) {
      if (currentSectionAnswers && currentSectionAnswers.size > 0) {
        handleSaveAnswers().then(() => {
          setShowSubmitDialog(true)
        })
      } else {
        setShowSubmitDialog(true)
      }
    } else {
      setShowSubmitDialog(true)
    }
  }, [examSlug, hasUnsavedChanges, selectedSection, currentSectionAnswers, handleSaveAnswers])

  if (isLoading && selectedSection) {
    return <ExamLoadingSkeleton />
  }

  if (isError && selectedSection) {
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
              <h1 className="text-xl font-bold text-gray-800">
                {examData?.title || "Loading..."}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedSection ? `${sectionName} - Page ${currentPageApi} of ${totalPages}` : `${submittedSections.size} of ${examData?.sections?.length || 0} sections completed`}
              </p>
            </div>
            {!isExamComplete && (
              <ExamTimer examSlug={examSlug} initialTime={examDuration} onTimeUp={handleTimeUp} />
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {!selectedSection ? (
              <SectionSelector
                sections={examData?.sections || []}
                submittedSections={submittedSections}
                isStartingExam={isStartingExam}
                onSectionSelect={handleSectionSelect}
              />
            ) : (
              <>
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
                        selectedAnswer={currentSectionAnswers.get(question.id) || null}
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
                    Submit Section
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {selectedSection && totalQuestions > 0 ? (
              <QuestionNavigation
                totalQuestions={totalQuestions}
                currentQuestionIndex={activeQuestionIndex}
                answeredQuestions={answeredQuestionIndices}
                onQuestionClick={handleQuestionJump}
                sections={examData?.sections || []}
                selectedSection={selectedSection}
                onSectionChange={handleSectionSelect}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
                <div className="space-y-2">
                  {examData?.sections.map((section: any, index: number) => {
                    const isSubmittedInBackend = section.is_completed === true
                    const isSubmittedInState = submittedSections.has(section.slug)
                    const isSubmitted = isSubmittedInBackend || isSubmittedInState
                    
                    return (
                      <button
                        key={section.slug}
                        onClick={() => handleSectionSelect(section.slug)}
                        disabled={isStartingExam || isSubmitted}
                        className={`w-full text-left p-3 border rounded-lg transition-all disabled:cursor-not-allowed ${
                          selectedSection === section.slug
                            ? "border-green-500 bg-green-50"
                            : isSubmitted
                            ? "border-green-300 bg-green-50 opacity-75"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-medium">{section.title}</span>
                          </div>
                          {isSubmitted && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {currentAttemptId && (
        <SubmissionDialog
          open={showSubmitDialog}
          onOpenChange={setShowSubmitDialog}
          attemptId={currentAttemptId}
          totalQuestions={totalQuestions}
          answeredQuestions={currentSectionAnswers.size}
          answers={currentSectionAnswers}
          type={examTypeData}
          examSlug={examSlug}
          isTimeUp={isTimeUp}
          tabSwitchCount={tabSwitchCount}
          onSectionSubmitted={handleSectionSubmitted}
        />
      )}
    </div>
  )
}