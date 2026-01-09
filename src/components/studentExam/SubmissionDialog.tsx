"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"
import { useSubmitExam } from "@/hooks/useCorporateExam"
import { ExamType } from "@/types/CorporateExamTypes"

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attemptId: number
  totalQuestions: number
  answeredQuestions: number
  answers: Map<number, number | string | null>
  type: ExamType
  examSlug: string
  isTimeUp?: boolean
  tabSwitchCount: number
  onSectionSubmitted: () => void
}

export function SubmissionDialog({
  open,
  onOpenChange,
  attemptId,
  totalQuestions,
  answeredQuestions,
  answers,
  type,
  examSlug,
  isTimeUp = false,
  tabSwitchCount,
  onSectionSubmitted,
}: SubmissionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(5)
  const submitExamMutation = useSubmitExam()
  const hasSubmittedRef = useRef(false)

  const unansweredCount = totalQuestions - answeredQuestions

  const handleConfirmSubmit = useCallback(async () => {
    if (hasSubmittedRef.current || isSubmitting) {
      return
    }

    hasSubmittedRef.current = true
    setIsSubmitting(true)
    
    try {
      // Submit with tab switch count
      await submitExamMutation.mutateAsync({ 
        attemptId, 
        type,
        data: {
          tab_switch_count: tabSwitchCount
        }
      })
      
      toast.success("Section submitted successfully!")
      
      // Clean up time up flag for this section
      const timeUpKey = `exam_time_up_${examSlug}`
      sessionStorage.removeItem(timeUpKey)
      
      // Call the callback to handle section completion
      onSectionSubmitted()
      
      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to submit section:", error)
      toast.error("Failed to submit section. Please try again.")
      hasSubmittedRef.current = false
      setIsSubmitting(false)
    }
  }, [attemptId, type, tabSwitchCount, submitExamMutation, onSectionSubmitted, onOpenChange, isSubmitting, examSlug])

  useEffect(() => {
    if (isTimeUp && open && !hasSubmittedRef.current) {
      const countdownInterval = setInterval(() => {
        setAutoSubmitCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            handleConfirmSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [isTimeUp, open, handleConfirmSubmit])

  useEffect(() => {
    if (!open) {
      hasSubmittedRef.current = false
      // Reset countdown when dialog closes
      setAutoSubmitCountdown(5)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={isTimeUp ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={isTimeUp ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isTimeUp && <Clock className="h-5 w-5 text-red-600" />}
            {isTimeUp ? "Time's Up!" : "Submit Section?"}
          </DialogTitle>
          <DialogDescription>
            {isTimeUp
              ? "Your exam time has expired. This section will be automatically submitted."
              : "Are you sure you want to submit this section? You cannot return to it after submission."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isTimeUp && (
            <Alert className="border-red-600 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Auto-submitting in <span className="font-bold text-lg">{autoSubmitCountdown}</span> seconds...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-semibold">{totalQuestions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Answered</p>
              <p className="text-2xl font-semibold text-green-600">{answeredQuestions}</p>
            </div>
          </div>

          {tabSwitchCount > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tab switches detected: <span className="font-bold">{tabSwitchCount}</span>
              </AlertDescription>
            </Alert>
          )}

          {unansweredCount > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}. These will be marked
                as incorrect.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Once submitted, you will not be able to change your answers or return to this section.
          </div>
        </div>

        <DialogFooter className="gap-2">
          {!isTimeUp && (
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Review Answers
            </Button>
          )}
          <Button onClick={handleConfirmSubmit} disabled={isSubmitting} variant="green">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}