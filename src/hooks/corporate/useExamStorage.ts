'use client'

import { getStorageKeys, getTimerKeys } from "@/lib/utils"
import { ExamState } from "@/types/CorporateExamTypes"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function useExamStorage(examSlug: string) {
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
      // ✅ Compute fresh keys at load time
      const storageKeys = getStorageKeys(examSlug)
      const loadedState: Partial<ExamState> = {}

      const savedSection = localStorage.getItem(storageKeys.selectedSection)
      if (savedSection) loadedState.selectedSection = savedSection

      const savedAttemptIds = localStorage.getItem(storageKeys.attemptIds)
      if (savedAttemptIds) {
        const parsed = JSON.parse(savedAttemptIds)
        loadedState.attemptIds = new Map(Object.entries(parsed).map(([k, v]) => [k, Number(v)]))
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
    if (isClearing.current) return  // skip persist while clearing

    try {
      // ✅ Compute fresh keys at persist time
      const storageKeys = getStorageKeys(examSlug)

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
  }, [state, examSlug])

  const updateState = useCallback((updates: Partial<ExamState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const clearStorage = useCallback(() => {
    isClearing.current = true

    try {
      // ✅ Nuclear clear — wipe everything related to this exam slug
      // This catches ALL key formats (old, new, scoped, unscoped)
      Object.keys(localStorage)
        .filter(key => key.includes(examSlug))
        .forEach(key => localStorage.removeItem(key))

      // Clear timer from sessionStorage too
      Object.keys(sessionStorage)
        .filter(key => key.includes(examSlug))
        .forEach(key => sessionStorage.removeItem(key))

    } catch (error) {
      console.error('Error clearing storage:', error)
    }

    // ✅ Keep flag true longer to prevent persist effect re-writing data
    setTimeout(() => {
      isClearing.current = false
    }, 500) // increased from 100ms
  }, [examSlug])

  return { state, updateState, clearStorage }
}