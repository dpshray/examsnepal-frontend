"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { BookOpen, ChevronRight } from "lucide-react"
import { Badge } from "../ui/badge"

interface Section {
  slug: string
  title: string
  detail?: string
  is_completed?: boolean
}

interface QuestionNavigationProps {
  totalQuestions: number
  currentQuestionIndex: number
  answeredQuestions: number[]
  onQuestionClick: (index: number) => void
  sections?: Section[]
  selectedSection?: string
  onSectionChange?: (sectionSlug: string) => void
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionClick,
  sections = [],
  selectedSection,
  onSectionChange,
}: QuestionNavigationProps) {
  console.log("sections", sections)
  return (
    <div className="space-y-4">
      {/* Section Selector */}
      {sections.length > 0 && onSectionChange && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sections
            </h3>
          </div>
          <ScrollArea className="max-h-60">
            <div className="p-2 space-y-1">
              {sections.map((section, index) => (
                <button
                  key={section.slug}
                  onClick={() => onSectionChange(section.slug)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all text-sm",
                    selectedSection === section.slug
                      ? "bg-green-50 border-2 border-green-500"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge variant={section.is_completed ? "green" : "destructive"}>
                      {section.is_completed ? "Completed" : "Not Completed"}
                    </Badge>
                    <span className="font-medium flex-1">{section.title}</span>
                    {selectedSection === section.slug && (
                      <ChevronRight className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Question Navigator */}
      {totalQuestions > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
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
      )}
    </div>
  )
}