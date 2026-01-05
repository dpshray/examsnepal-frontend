"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
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
}: SubmissionDialogProps) {
  const router = useRouter()
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
      await submitExamMutation.mutateAsync({ attemptId, type })
      
      // Clean up storage after successful submission
      const timeUpKey = `exam_time_up_${attemptId}`
      const endTimeKey = `exam_end_time_${attemptId}`
      sessionStorage.removeItem(timeUpKey)
      localStorage.removeItem(endTimeKey)
      
      router.push(`/exam/${examSlug}/completed`)
      toast.success("Exam submitted successfully!")
    } catch (error) {
      console.error("Failed to submit exam:", error)
      toast.error("Failed to submit exam. Please try again.")
      hasSubmittedRef.current = false
      setIsSubmitting(false)
    }
  }, [attemptId, type, router, submitExamMutation, examSlug, isSubmitting])

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
            {isTimeUp ? "Time's Up!" : "Submit Exam?"}
          </DialogTitle>
          <DialogDescription>
            {isTimeUp
              ? "Your exam time has expired. Your exam will be automatically submitted."
              : "Are you sure you want to submit your exam? This action cannot be undone."}
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
            Once submitted, you will not be able to change your answers or return to the exam.
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