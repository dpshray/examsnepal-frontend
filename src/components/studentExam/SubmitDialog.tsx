"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answeredCount: number
  totalQuestions: number
  onConfirm: () => void
}

export function SubmitDialog({ open, onOpenChange, answeredCount, totalQuestions, onConfirm }: SubmitDialogProps) {
  const unansweredCount = totalQuestions - answeredCount

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to submit your exam?</p>
            <div className="bg-muted p-4 rounded-lg mt-4 space-y-2">
              <p className="text-foreground font-medium">
                Answered: {answeredCount} of {totalQuestions} questions
              </p>
              {unansweredCount > 0 && (
                <p className="text-amber-600 dark:text-amber-400">
                  Warning: {unansweredCount} {unansweredCount === 1 ? "question" : "questions"} not answered
                </p>
              )}
            </div>
            <p className="text-sm mt-4">Once submitted, you will not be able to change your answers.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Submit Exam</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
