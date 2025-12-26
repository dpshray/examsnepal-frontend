"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, TrendingUp } from "lucide-react"

export default function ExamCompletedPage() {
  const router = useRouter()
  const params = useParams()

  const examSlug = params?.examSlug as string

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

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> Your exam has been submitted for evaluation. Results will be available shortly. You
              will be notified via email once the evaluation is complete.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button variant="green" onClick={() => router.push(`/exam/${examSlug}/instruction`)}>
              Back to Instructions
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
