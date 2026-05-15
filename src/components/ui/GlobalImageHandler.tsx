"use client"

import { useEffect } from "react"

export function GlobalImageHandler() {
  useEffect(() => {
    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement
      if (!img.dataset.fallbackHandled) {
        img.dataset.fallbackHandled = "true"
        const parent = img.parentElement
        if (parent) {
          parent.style.backgroundColor = "#e7e5e4"
          parent.style.backgroundImage = "linear-gradient(135deg, #d6d3d1 0%, #a8a29e 100%)"
          parent.style.display = "flex"
          parent.style.alignItems = "center"
          parent.style.justifyContent = "center"
        }
        img.style.display = "none"
      }
    }

    document.addEventListener("error", handleImageError, true)
    return () => document.removeEventListener("error", handleImageError, true)
  }, [])

  return null
}
