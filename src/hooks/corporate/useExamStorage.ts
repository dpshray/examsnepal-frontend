'use client'

import { getStorageKeys, getTimerKeys } from "@/lib/utils"
import { ExamState } from "@/types/CorporateExamTypes"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function useExamStorage(examSlug: string) {
  const storageKeys = getStorageKeys(examSlug)
  const isClearing = useRef(false)
  
  const [state, setState] = useState<ExamState>({
    selectedSection: null,
    attemptIds: new Map(),
    answers: new Map(),
    currentPage: 1,
    tabSwitchCount: 0,
    submittedSections: new Set(),
  })

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const loadedState: Partial<ExamState> = {}

      const savedSection = localStorage.getItem(storageKeys.selectedSection)
      if (savedSection) loadedState.selectedSection = savedSection

      const savedAttemptIds = localStorage.getItem(storageKeys.attemptIds)
      if (savedAttemptIds) {
        const parsed = JSON.parse(savedAttemptIds)
        loadedState.attemptIds = new Map(Object.entries(parsed))
      }

      const savedAnswers = localStorage.getItem(storageKeys.answers)
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers)
        const answersMap = new Map()
        Object.entries(parsed).forEach(([section, sectionAnswers]: any) => {
          answersMap.set(section, new Map(Object.entries(sectionAnswers).map(([k, v]) => [Number(k), v])))
        })
        loadedState.answers = answersMap
      }

      const savedPage = localStorage.getItem(storageKeys.currentPage)
      if (savedPage) loadedState.currentPage = Number(savedPage)

      const savedTabCount = localStorage.getItem(storageKeys.tabSwitchCount)
      if (savedTabCount) loadedState.tabSwitchCount = Number(savedTabCount)

      const savedSubmitted = localStorage.getItem(storageKeys.submittedSections)
      if (savedSubmitted) {
        loadedState.submittedSections = new Set(JSON.parse(savedSubmitted))
      }

      setState(prev => ({ ...prev, ...loadedState }))
    } catch (error) {
      console.error("Error loading exam state from localStorage:", error)
      toast.error("Failed to load saved progress")
    }
  }, [examSlug])

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Don't persist if we're clearing storage
    if (isClearing.current) return

    try {
      if (state.selectedSection) {
        localStorage.setItem(storageKeys.selectedSection, state.selectedSection)
      }

      const attemptIdsObj = Object.fromEntries(state.attemptIds)
      localStorage.setItem(storageKeys.attemptIds, JSON.stringify(attemptIdsObj))

      const answersObj: any = {}
      state.answers.forEach((sectionAnswers, section) => {
        answersObj[section] = Object.fromEntries(sectionAnswers)
      })
      localStorage.setItem(storageKeys.answers, JSON.stringify(answersObj))

      localStorage.setItem(storageKeys.currentPage, state.currentPage.toString())
      localStorage.setItem(storageKeys.tabSwitchCount, state.tabSwitchCount.toString())
      localStorage.setItem(storageKeys.submittedSections, JSON.stringify(Array.from(state.submittedSections)))
    } catch (error) {
      console.error("Error saving exam state to localStorage:", error)
      toast.error("Failed to save progress")
    }
  }, [state, storageKeys])

  const updateState = useCallback((updates: Partial<ExamState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const clearStorage = useCallback(() => {
    // Set flag to prevent persistence effect from running
    isClearing.current = true
    
    try {
      // Clear all exam state storage items
      Object.values(storageKeys).forEach(key => {
        localStorage.removeItem(key)
      })
      
      // Clear timer keys from localStorage
      const timerKeys = getTimerKeys(examSlug)
      localStorage.removeItem(timerKeys.endTime)
      
      // Clear timer keys from sessionStorage
      sessionStorage.removeItem(timerKeys.timeUp)
      
      // console.log('Storage cleared successfully for exam:', examSlug)
      // console.log('Cleared keys:', {
      //   storage: Object.values(storageKeys),
      //   timer: [timerKeys.endTime, timerKeys.timeUp]
      // })
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
    
    // Reset flag after a brief delay
    setTimeout(() => {
      isClearing.current = false
    }, 100)
  }, [examSlug, storageKeys])

  return { state, updateState, clearStorage }
}