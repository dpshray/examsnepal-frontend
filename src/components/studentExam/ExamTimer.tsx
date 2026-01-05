"use client"

import { useEffect, useState, useRef } from "react"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ExamTimerProps {
  attemptId: number
  initialTime: number 
  onTimeUp?: () => void
}

export function ExamTimer({ attemptId, initialTime, onTimeUp }: ExamTimerProps) {
  const STORAGE_KEY = `exam_end_time_${attemptId}`
  const TIME_UP_KEY = `exam_time_up_${attemptId}`
  const [timeLeft, setTimeLeft] = useState<number>(initialTime)
  const hasTriggeredTimeUp = useRef(false)

  useEffect(() => {
    // Check if time was already up before
    const wasTimeUp = sessionStorage.getItem(TIME_UP_KEY)
    if (wasTimeUp === 'true') {
      setTimeLeft(0)
      if (!hasTriggeredTimeUp.current && onTimeUp) {
        hasTriggeredTimeUp.current = true
        onTimeUp()
      }
      return
    }

    let endTime = localStorage.getItem(STORAGE_KEY)

    // First load → set end time
    if (!endTime) {
      const calculatedEndTime = Date.now() + initialTime * 1000
      localStorage.setItem(STORAGE_KEY, calculatedEndTime.toString())
      endTime = calculatedEndTime.toString()
    }

    const interval = setInterval(() => {
      const remaining = Math.floor(
        (Number(endTime) - Date.now()) / 1000
      )

      if (remaining <= 0) {
        clearInterval(interval)
        // DON'T remove from localStorage yet - keep it for persistence
        // localStorage.removeItem(STORAGE_KEY)
        
        // Mark time as up in sessionStorage
        sessionStorage.setItem(TIME_UP_KEY, 'true')
        setTimeLeft(0)

        if (!hasTriggeredTimeUp.current && onTimeUp) {
          hasTriggeredTimeUp.current = true
          onTimeUp()
        }
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [attemptId, initialTime, onTimeUp, STORAGE_KEY, TIME_UP_KEY])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const isLowTime = timeLeft <= 300
  const isCritical = timeLeft <= 60

  return (
    <Badge
      variant={isCritical ? "destructive" : isLowTime ? "default" : "secondary"}
      className={`px-2 py-1 text-base transition-colors ${
        isCritical
          ? ""
          : isLowTime
          ? "bg-orange-500 hover:bg-orange-600 text-white"
          : "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
      }`}
    >
      <Clock className="h-5 w-5 mr-2" />
      <span className="font-mono text-xl font-semibold tabular-nums">
        {hours > 0 && `${String(hours).padStart(2, "0")}:`}
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </Badge>
  )
}