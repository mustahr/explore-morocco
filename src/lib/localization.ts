import messages from "./locales/public.json"
import type { LanguageCode } from "./utils"

export const publicMessages: Record<string, { fr: string; ar: string }> = messages
export const localeForLanguage = { en: "en-GB", fr: "fr-FR", ar: "ar-MA" } as const

// Translate display copy only. Catalog IDs, form values, URLs and API payloads remain stable.
// Newly authored content falls back to its original text until a translation is supplied.
export function translate(language: LanguageCode, text: string, values?: Record<string, string | number>): string {
  if (language !== "en") {
    const duration = text.match(/^(\d+(?:\.\d+)?)\s*(hours?|mins?|minutes?)$/i)
    if (duration) {
      const amount = Number(duration[1])
      const hour = duration[2].toLowerCase().startsWith("hour")
      return new Intl.NumberFormat(localeForLanguage[language], { style: "unit", unit: hour ? "hour" : "minute", unitDisplay: "long" }).format(amount)
    }
  }
  const message = language === "en" ? text : publicMessages[text]?.[language] ?? text
  return message.replace(/\{(\w+)\}/g, (token, key: string) => values?.[key] === undefined ? token : String(values[key]))
}

export function formatLocalizedDate(language: LanguageCode, value: string): string {
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(localeForLanguage[language], { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Casablanca" }).format(date)
}
