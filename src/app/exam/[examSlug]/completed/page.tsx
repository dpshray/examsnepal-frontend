"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, TrendingUp } from "lucide-react"

export default function ExamCompletedPage() {
  const router = useRouter()
  const params = useParams()
  const attemptId = params.attemptId as string
  const slug = params.slug as string

  // Mock data - replace with real data from API
  const examResult = {
    examTitle: "Computer Science Fundamentals",
    submittedAt: new Date().toLocaleString(),
    totalQuestions: 20,
    answeredQuestions: 18,
    score: 85, // Optional: Remove if you don't want to show scores
    grade: "B+", // Optional: Remove if you don't want to show grades
    timeTaken: "42 minutes",
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-500/10 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Exam Submitted Successfully!</h1>
            <p className="text-muted-foreground">Your answers have been recorded and submitted for evaluation.</p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">{examResult.examTitle}</h2>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Questions Answered</div>
                  <div className="text-lg font-semibold text-foreground">
                    {examResult.answeredQuestions}/{examResult.totalQuestions}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                  <div className="text-lg font-semibold text-foreground">{examResult.timeTaken}</div>
                </div>
              </div>

              {/* Optional: Show score and grade if available */}
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-lg font-semibold text-foreground">{examResult.score}%</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Grade</div>
                  <div className="text-lg font-semibold text-foreground">{examResult.grade}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">Submitted on</div>
              <div className="text-base font-medium text-foreground">{examResult.submittedAt}</div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> Your exam has been submitted for evaluation. Results will be available shortly. You
              will be notified via email once the evaluation is complete.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Instructions
            </Button>
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
