"use client"

import { Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExamHeaderProps {
  title: string
  timeRemaining: number
  lastSaveTime: Date | null
  onSubmit: () => void
}

export function ExamHeader({ title, timeRemaining, lastSaveTime, onSubmit }: ExamHeaderProps) {
  const hours = Math.floor(timeRemaining / 3600)
  const minutes = Math.floor((timeRemaining % 3600) / 60)
  const seconds = timeRemaining % 60

  const isLowTime = timeRemaining < 300 // Less than 5 minutes
  const isCriticalTime = timeRemaining < 60 // Less than 1 minute

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {lastSaveTime && (
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Save className="h-3 w-3" />
              <span>Last saved at {lastSaveTime.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-2 text-lg font-mono ${
              isCriticalTime ? "text-destructive animate-pulse" : isLowTime ? "text-amber-500" : "text-foreground"
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <Button onClick={onSubmit} size="lg">
            Submit Exam
          </Button>
        </div>
      </div>
    </header>
  )
}
