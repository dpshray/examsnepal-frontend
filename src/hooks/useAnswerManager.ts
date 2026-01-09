import { AnswerValue, ExamState } from "@/types/CorporateExamTypes"
import { useCallback, useMemo, useState } from "react"

export function useAnswerManager(
  selectedSection: string | null,
  answers: Map<string, Map<number, AnswerValue>>,
  updateState: (updates: Partial<ExamState>) => void
) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAnswersSaved, setIsAnswersSaved] = useState(false)

  const currentSectionAnswers = useMemo(() => 
    selectedSection ? answers.get(selectedSection) || new Map() : new Map(),
    [selectedSection, answers]
  )

  const handleAnswerChange = useCallback((questionId: number, value: AnswerValue) => {
    if (!selectedSection) return

    const sectionAnswers = new Map(answers.get(selectedSection) || new Map())
    sectionAnswers.set(questionId, value)
    
    const newAnswers = new Map(answers)
    newAnswers.set(selectedSection, sectionAnswers)
    
    updateState({ answers: newAnswers })
    setHasUnsavedChanges(true)
    setIsAnswersSaved(false)
  }, [selectedSection, answers, updateState])

  const resetSaveStatus = useCallback(() => {
    setIsAnswersSaved(false)
    setHasUnsavedChanges(false)
  }, [])

  const markAsSaved = useCallback(() => {
    setIsAnswersSaved(true)
    setHasUnsavedChanges(false)
  }, [])

  return {
    currentSectionAnswers,
    hasUnsavedChanges,
    isAnswersSaved,
    handleAnswerChange,
    resetSaveStatus,
    markAsSaved,
  }
}