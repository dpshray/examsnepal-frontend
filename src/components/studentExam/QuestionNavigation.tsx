"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Circle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface QuestionNavigationProps {
  sections: Section[]
  currentSectionIndex: number
  currentQuestionIndex: number
  answers: Record<string, string>
  onNavigate: (sectionIndex: number, questionIndex: number) => void
  allowBackNavigation: boolean
}

export function QuestionNavigation({
  sections,
  currentSectionIndex,
  currentQuestionIndex,
  answers,
  onNavigate,
  allowBackNavigation,
}: QuestionNavigationProps) {
  let globalIndex = 0
  let currentGlobalIndex = 0

  // Calculate current global index
  for (let i = 0; i < currentSectionIndex; i++) {
    currentGlobalIndex += sections[i].questions.length
  }
  currentGlobalIndex += currentQuestionIndex

  return (
    <aside className="w-80 border-r border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Questions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {sections.length} {sections.length === 1 ? "Section" : "Sections"}
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-9rem)]">
        <div className="p-6 space-y-6">
          {sections.map((section, sectionIndex) => {
            const sectionStartIndex = globalIndex
            globalIndex += section.questions.length

            return (
              <div key={section.id}>
                <h3 className="text-sm font-medium text-foreground mb-3">{section.title}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {section.questions.map((question, questionIndex) => {
                    const qGlobalIndex = sectionStartIndex + questionIndex
                    const isAnswered = !!answers[question.id]
                    const isCurrent = sectionIndex === currentSectionIndex && questionIndex === currentQuestionIndex
                    const isLocked = !allowBackNavigation && qGlobalIndex < currentGlobalIndex

                    return (
                      <Button
                        key={question.id}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-10 w-full relative",
                          isAnswered && !isCurrent && "border-green-500 bg-green-500/10",
                          isLocked && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => onNavigate(sectionIndex, questionIndex)}
                        disabled={isLocked}
                      >
                        {isLocked && <Lock className="h-3 w-3 absolute top-1 right-1" />}
                        {isAnswered && !isCurrent && (
                          <Check className="h-3 w-3 absolute top-1 right-1 text-green-500" />
                        )}
                        {!isAnswered && !isCurrent && !isLocked && (
                          <Circle className="h-3 w-3 absolute top-1 right-1 text-muted-foreground" />
                        )}
                        <span>{questionIndex + 1}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
