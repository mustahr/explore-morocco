"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type LanguageCode, type CurrencyCode } from "@/lib/utils"

interface AppContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  currency: CurrencyCode
  setCurrency: (cur: CurrencyCode) => void
  wishlist: string[]
  toggleWishlist: (id: string) => void
  isWishlisted: (id: string) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en")
  const [currency, setCurrency] = useState<CurrencyCode>("MAD")
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("morocco-wishlist")
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("morocco-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const isWishlisted = (id: string) => wishlist.includes(id)

  return (
    <AppContext.Provider
      value={{ language, setLanguage, currency, setCurrency, wishlist, toggleWishlist, isWishlisted }}
    >
      <div dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
        {children}
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
