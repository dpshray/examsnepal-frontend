"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface QuestionNavigationProps {
  totalQuestions: number
  currentQuestionIndex: number
  answeredQuestions: number[]
  onQuestionClick: (index: number) => void
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionClick,
}: QuestionNavigationProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">Question Navigator</h3>
      </div>
      <div className="p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-green-500 shadow-sm" />
              <span className="text-gray-600 font-medium">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md border-2 border-gray-300 shadow-sm" />
              <span className="text-gray-600 font-medium">Not Answered</span>
            </div>
          </div>

          <ScrollArea className="max-h-105">
            <div className="pr-2">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 p-1">
                {Array.from({ length: totalQuestions }, (_, i) => {
                  const questionNumber = i + 1
                  const isAnswered = answeredQuestions.includes(i)
                  const isCurrent = i === currentQuestionIndex

                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      onClick={() => onQuestionClick(i)}
                      className={cn(
                        "h-10 w-10 rounded-md font-semibold text-sm transition-all",
                        "flex items-center justify-center",
                        isAnswered
                          ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                          : "border border-gray-300 text-gray-700 hover:border-green-400 hover:bg-gray-50",
                        isCurrent && "ring-2 ring-green-500 ring-offset-2",
                      )}
                    >
                      {questionNumber}
                    </Button>
                  )
                })}
              </div>
            </div>
          </ScrollArea>


          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Questions:</span>
                <span className="font-semibold text-gray-800 text-lg">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Answered:</span>
                <span className="font-semibold text-green-600 text-lg">{answeredQuestions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Not Answered:</span>
                <span className="font-semibold text-orange-600 text-lg">{totalQuestions - answeredQuestions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}