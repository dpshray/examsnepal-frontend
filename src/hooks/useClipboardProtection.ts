"use client"

import { useEffect } from "react"

export const useClipboardProtection = () => {
  useEffect(() => {
    const prevent = (e: Event) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("copy", prevent)
    document.addEventListener("paste", prevent)
    document.addEventListener("cut", prevent)
    document.addEventListener("contextmenu", prevent)

    return () => {
      document.removeEventListener("copy", prevent)
      document.removeEventListener("paste", prevent)
      document.removeEventListener("cut", prevent)
      document.removeEventListener("contextmenu", prevent)
    }
  }, [])
}
