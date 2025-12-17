"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Clock, FileText, AlertCircle } from "lucide-react"

const MOCK_EXAM = {
    id: "exam-1",
    title: "Computer Science Fundamentals",
    slug: "cs-fundamentals",
    duration: 60, // minutes
    instructions: [
        "Read each question carefully before answering.",
        "You cannot go back to previous questions once you move forward.",
        "Your answers are auto-saved every 5 seconds.",
        "Make sure you have a stable internet connection.",
        "Click 'Submit Exam' when you're done or time runs out.",
    ],
    sections: [
        {
        id: "section-1",
        title: "Multiple Choice",
        description: "15 questions on basic concepts",
        questionCount: 15,
        duration: 30, // minutes
        },
        {
        id: "section-2",
        title: "Short Answer",
        description: "5 questions requiring detailed responses",
        questionCount: 5,
        duration: 30, // minutes
        },
        {
        id: "section-3",
        title: "Programming",
        description: "3 coding problems",
        questionCount: 3,
        duration: 45, // minutes
        },
    ],
}

export default function InstructionsPage() {
  const router = useRouter()
  const [selectedSections, setSelectedSections] = useState<string[]>(MOCK_EXAM.sections.map((s) => s.id))

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const handleStartExam = () => {
    if (selectedSections.length === 0) {
      return
    }

    // Generate attempt ID (in real app, this would come from API)
    const attemptId = `attempt-${Date.now()}`

    // In real app, you would save selected sections to backend
    sessionStorage.setItem("selectedSections", JSON.stringify(selectedSections))

    router.push(`exam/${MOCK_EXAM.slug}/attempt/${attemptId}`)
  }

  const totalDuration = MOCK_EXAM.sections
    .filter((s) => selectedSections.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0)

  const totalQuestions = MOCK_EXAM.sections
    .filter((s) => selectedSections.includes(s.id))
    .reduce((sum, s) => sum + s.questionCount, 0)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-5xl font-bold text-gray-900">{MOCK_EXAM.title}</h1>
          <p className="text-xl text-gray-600">Exam Instructions</p>
        </div>

        <div className="mb-8 rounded-2xl bg-white/80 backdrop-blur-sm border-l-4 border-green-500 p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <AlertCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Important Instructions</h2>
          </div>
          <ul className="space-y-4">
            {MOCK_EXAM.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4 text-gray-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {index + 1}
                </span>
                <span className="pt-0.5">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section Selection */}
        <div className="mb-8 rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Select Sections</h2>
          </div>
          <p className="mb-6 text-gray-600">Choose which sections you want to attempt in this exam</p>
          <div className="space-y-4">
            {MOCK_EXAM.sections.map((section) => (
              <label
                key={section.id}
                className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all hover:shadow-md ${
                  selectedSections.includes(section.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <Checkbox
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="mb-2 text-lg font-bold text-gray-900">{section.title}</div>
                  <div className="mb-3 text-gray-600">{section.description}</div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="font-medium">{section.questionCount} questions</span>
                    <span>•</span>
                    <span className="font-medium">{section.duration} minutes</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedSections.length > 0 && (
          <div className="mb-8 rounded-2xl bg-linear-to-br p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Exam Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-sm">Selected Sections</div>
                <div className="text-3xl font-bold">{selectedSections.length}</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-sm">Total Questions</div>
                <div className="text-3xl font-bold">{totalQuestions}</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-sm">Total Duration</div>
                <div className="text-3xl font-bold">{totalDuration} min</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-sm">Navigation</div>
                <div className="text-3xl font-bold">Forward Only</div>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStartExam}
            disabled={selectedSections.length === 0}
            className="rounded-xl bg-green-600 px-16 py-6 text-xl font-bold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl disabled:bg-gray-300 disabled:text-gray-500"
          >
            Start Exam
          </Button>
        </div>

        {selectedSections.length === 0 && (
          <p className="mt-4 text-center text-red-600 font-medium">
            Please select at least one section to start the exam
          </p>
        )}
      </div>
    </div>
  )
}
