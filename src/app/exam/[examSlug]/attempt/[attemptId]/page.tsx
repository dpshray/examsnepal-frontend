"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { ExamHeader } from "@/components/studentExam/ExamHeader"
import { QuestionNavigation } from "@/components/studentExam/QuestionNavigation"
import { QuestionDisplay } from "@/components/studentExam/QuestionDisplay"
import { SubmitDialog } from "@/components/studentExam/SubmitDialog"

const MOCK_EXAM = {
  id: "exam-1",
  slug: "computer-science-fundamentals",
  title: "Computer Science Fundamentals",
  duration: 3600, 
  sections: [
    {
      id: "section-1",
      title: "Multiple Choice",
      questions: Array.from({ length: 15 }, (_, i) => ({
        id: `q-${i + 1}`,
        type: "multiple-choice" as const,
        text: `Question ${i + 1}: What is the time complexity of binary search?`,
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      })),
    },
    {
      id: "section-2",
      title: "Short Answer",
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: `q-${i + 16}`,
        type: "short-answer" as const,
        text: `Question ${i + 16}: Explain the concept of polymorphism in object-oriented programming.`,
      })),
    },
    {
      id: "section-3",
      title: "Programming",
      questions: Array.from({ length: 3 }, (_, i) => ({
        id: `q-${i + 21}`,
        type: "short-answer" as const,
        text: `Question ${i + 21}: Write a function to reverse a linked list.`,
      })),
    },
  ],
  allowBackNavigation: false,
}

export default function ExamAttemptPage() {
  const router = useRouter()
  const params = useParams()
  const attemptId = params.attemptId as string

  const [filteredSections, setFilteredSections] = useState(MOCK_EXAM.sections)

  useEffect(() => {
    const selectedSectionsStr = sessionStorage.getItem("selectedSections")
    if (selectedSectionsStr) {
      const selectedSectionIds = JSON.parse(selectedSectionsStr) as string[]
      const filtered = MOCK_EXAM.sections.filter((s) => selectedSectionIds.includes(s.id))
      setFilteredSections(filtered)
    }
  }, [])

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(MOCK_EXAM.duration)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)

  const allQuestions = filteredSections.flatMap((section) => section.questions as any)
  const currentSection = filteredSections[currentSectionIndex]
  const currentQuestion = currentSection?.questions[currentQuestionIndex]

  // Auto-save functionality
  const saveAnswers = useCallback(async () => {
    try {
      setLastSaveTime(new Date())
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Error saving answers:", error)
    }
  }, [])

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        saveAnswers()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [answers, saveAnswers])

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const navigateToQuestion = (sectionIndex: number, questionIndex: number) => {
    if (!MOCK_EXAM.allowBackNavigation) {
      const currentGlobalIndex =
        filteredSections.slice(0, currentSectionIndex).reduce((sum, s) => sum + s.questions.length, 0) +
        currentQuestionIndex

      const targetGlobalIndex =
        filteredSections.slice(0, sectionIndex).reduce((sum, s) => sum + s.questions.length, 0) + questionIndex

      if (targetGlobalIndex < currentGlobalIndex) {
        toast.error("You cannot go back to previous questions.")
        return
      }
    }

    setCurrentSectionIndex(sectionIndex)
    setCurrentQuestionIndex(questionIndex)
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentSectionIndex < filteredSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const handlePrevious = () => {
    if (!MOCK_EXAM.allowBackNavigation) {
    toast.error("You cannot go back to previous questions.")
      return
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      setCurrentQuestionIndex(filteredSections[currentSectionIndex - 1].questions.length - 1)
    }
  }

  const handleSubmit = async () => {
    await saveAnswers()
    router.push(`/exam/${MOCK_EXAM.slug}/completed`)
  }

  const answeredCount = allQuestions.filter((q: any) => answers[q.id]).length
  const currentGlobalQuestionNumber =
    filteredSections.slice(0, currentSectionIndex).reduce((sum, s) => sum + s.questions.length, 0) +
    currentQuestionIndex +
    1

  if (!currentSection) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-lg">Loading exam...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ExamHeader
        title={MOCK_EXAM.title}
        timeRemaining={timeRemaining}
        lastSaveTime={lastSaveTime}
        onSubmit={() => setIsSubmitDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <QuestionNavigation
          sections={filteredSections}
          currentSectionIndex={currentSectionIndex}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onNavigate={navigateToQuestion}
          allowBackNavigation={MOCK_EXAM.allowBackNavigation}
        />

        <QuestionDisplay
          section={currentSection}
          question={currentQuestion}
          questionNumber={currentGlobalQuestionNumber}
          totalQuestions={allQuestions.length}
          answer={answers[currentQuestion.id] || ""}
          onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={currentGlobalQuestionNumber < allQuestions.length}
          canGoPrevious={MOCK_EXAM.allowBackNavigation && currentGlobalQuestionNumber > 1}
          answeredCount={answeredCount}
        />
      </div>

      <SubmitDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        answeredCount={answeredCount}
        totalQuestions={allQuestions.length}
        onConfirm={handleSubmit}
      />
    </div>
  )
}
