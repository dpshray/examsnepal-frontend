"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Question } from "@/types/CorporateExamTypes"
import Link from "next/link"
import Image from "next/image"

interface QuestionDisplayProps {
  question: Question
  questionNumber: number
  // selectedOptionId: number | null
  selectedAnswer: number | string | null
  onAnswerChange: (questionId: number, value: number | string | null) => void
}

export function QuestionDisplay({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerChange,
}: QuestionDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* HEADER */}
      <div className="border-b bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-green-600 text-white text-sm font-semibold">
                {questionNumber}
              </span>
              <span className="text-xs font-medium text-green-600 uppercase px-2.5 py-1 bg-indigo-100 rounded-full">
                {question.question_type}
              </span>
            </div>

            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
          </div>

          <div className="text-right bg-white rounded-lg px-3 py-2 shadow-sm">
            <div className="text-sm font-semibold">
              Marks: <span className="text-green-600">{question.full_marks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6">
        {/* IMAGE */}
        {question.image_url && (
          <Image
            src={question.image_url}
            alt="Question image"
            width={800}
            height={256}
            className="w-full h-64 object-contain mb-6"
          />
        )}

        {/* MCQ */}
        {question.question_type === "mcq" && (
  <RadioGroup
    value={typeof selectedAnswer === "number" ? selectedAnswer.toString() : ""}
    onValueChange={(val) =>
      onAnswerChange(question.id, val ? Number(val) : null)
    }
  >
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = selectedAnswer === option.id

        return (
          <div
            key={option.id}
            onClick={() => onAnswerChange(question.id, option.id)}
            className={`flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition
              ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
          >
            {/* VISIBLE RADIO */}
            <div
              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center
                ${
                  isSelected
                    ? "border-green-600"
                    : "border-gray-400"
                }`}
            >
              {isSelected && (
                <div className="h-3 w-3 rounded-full bg-green-600" />
              )}
            </div>

            {/* HIDDEN REAL RADIO */}
            <RadioGroupItem
              value={option.id.toString()}
              id={`q${question.id}-option${option.id}`}
              className="sr-only"
            />

            <Label className="flex-1 cursor-pointer">
              {String.fromCharCode(65 + index)}. {option.option}
            </Label>
          </div>
        )
      })}
    </div>
  </RadioGroup>
)}


        {/* SUBJECTIVE */}
        {question.question_type === "subjective" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Your Answer
            </Label>

            <textarea
              value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
              onChange={(e) =>
                onAnswerChange(question.id, e.target.value)
              }
              placeholder="Write your answer here..."
              rows={6}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
      </div>
    </div>
  )
}
