"use client"

import { useState } from "react"
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
import { AlertCircle, Loader2 } from "lucide-react"
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
  type: ExamType;
  examSlug: string
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
}: SubmissionDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitExamMutation = useSubmitExam()

  const unansweredCount = totalQuestions - answeredQuestions

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitExamMutation.mutateAsync({attemptId, type})
      toast.success("Exam submitted successfully!")
      router.push(`/exam/${examSlug}/completed`)
    } catch (error) {
      console.error("Failed to submit exam:", error)
      toast.error("Failed to submit exam. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Exam?</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit your exam? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Review Answers
          </Button>
          <Button onClick={handleConfirmSubmit} disabled={isSubmitting} variant="green">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Exam"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}