"use client"

import { useCallback } from "react"
import { useApp } from "./AppContext"
import { localeForLanguage, translate } from "@/lib/localization"

export function useTranslations() {
  const { language } = useApp()
  const tr = useCallback((text: string, values?: Record<string, string | number>) => translate(language, text, values), [language])
  return { tr, language, locale: localeForLanguage[language] }
}
