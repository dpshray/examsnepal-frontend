"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer"
  text: string
  options?: string[]
}

interface Section {
  id: string
  title: string
  questions: Question[]
}

interface QuestionDisplayProps {
  section: Section
  question: Question
  questionNumber: number
  totalQuestions: number
  answer: string
  onAnswerChange: (answer: string) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  answeredCount: number
}

export function QuestionDisplay({
  section,
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  answeredCount,
}: QuestionDisplayProps) {
  return (
    <main className="flex-1 flex flex-col">
      <div className="border-b border-border px-8 py-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Section: {section.title}</p>
            <p className="text-sm font-medium text-foreground mt-1">
              Question {questionNumber} of {totalQuestions}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Answered: {answeredCount} / {totalQuestions}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-8">
        <Card className="max-w-4xl mx-auto p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-foreground leading-relaxed">{question.text}</h2>
            </div>

            {question.type === "multiple-choice" && question.options && (
              <RadioGroup value={answer} onValueChange={onAnswerChange}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "short-answer" && (
              <div>
                <Label htmlFor="answer" className="text-sm text-muted-foreground mb-2">
                  Your Answer
                </Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[200px] mt-2 text-base"
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="border-t border-border px-8 py-4 bg-card">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious} className="gap-2 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button onClick={onNext} disabled={!canGoNext} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
