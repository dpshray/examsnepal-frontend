"use client"

import { useEffect } from "react"

interface TabSwitchOptions {
  onSwitch: () => void
}

export const useTabSwitchDetection = ({ onSwitch }: TabSwitchOptions) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onSwitch()
      }
    }

    const handleBlur = () => {
      onSwitch()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [onSwitch])
}
