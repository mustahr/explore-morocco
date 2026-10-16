"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { parseFavoriteKey } from "@/lib/favorite-keys"
import { currencies, translations, type CurrencyCode, type LanguageCode } from "@/lib/utils"

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

const LANGUAGE_STORAGE_KEY = "morocco-language"
const CURRENCY_STORAGE_KEY = "morocco-currency"
const WISHLIST_STORAGE_KEY = "morocco-wishlist"
const PREFERENCES_CHANGE_EVENT = "morocco-preferences-change"
const EMPTY_WISHLIST: string[] = []

const languageCodes = Object.keys(translations) as LanguageCode[]
const currencyCodes = Object.keys(currencies) as CurrencyCode[]

function isBrowser() {
  return typeof window !== "undefined"
}

function emitPreferencesChange(key: string) {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(PREFERENCES_CHANGE_EVENT, { detail: { key } }))
}

function subscribeToStorageKey(key: string, callback: () => void) {
  if (!isBrowser()) return () => {}

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key) callback()
  }

  const handlePreferencesChange = (event: Event) => {
    if (event instanceof CustomEvent && event.detail?.key === key) {
      callback()
    }
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(PREFERENCES_CHANGE_EVENT, handlePreferencesChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(PREFERENCES_CHANGE_EVENT, handlePreferencesChange)
  }
}

function subscribeToHydration(callback: () => void) {
  if (!isBrowser()) return () => {}

  const timeout = window.setTimeout(callback, 0)
  return () => window.clearTimeout(timeout)
}

function readStoredOption<T extends string>(key: string, fallback: T, options: readonly T[]) {
  if (!isBrowser()) return fallback

  const saved = localStorage.getItem(key)
  return options.includes(saved as T) ? (saved as T) : fallback
}

function readStoredWishlistSnapshot() {
  if (!isBrowser()) return "[]"

  return localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]"
}

function parseWishlist(snapshot: string) {
  try {
    const parsed = JSON.parse(snapshot)

    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : EMPTY_WISHLIST
  } catch {
    return EMPTY_WISHLIST
  }
}

function writeStorage(key: string, value: string) {
  if (!isBrowser()) return
  localStorage.setItem(key, value)
  emitPreferencesChange(key)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const storedLanguage = useSyncExternalStore<LanguageCode>(
    useCallback((callback) => subscribeToStorageKey(LANGUAGE_STORAGE_KEY, callback), []),
    () => readStoredOption(LANGUAGE_STORAGE_KEY, "en", languageCodes),
    () => "en"
  )

  const storedCurrency = useSyncExternalStore<CurrencyCode>(
    useCallback((callback) => subscribeToStorageKey(CURRENCY_STORAGE_KEY, callback), []),
    () => readStoredOption(CURRENCY_STORAGE_KEY, "MAD", currencyCodes),
    () => "MAD"
  )

  const wishlistSnapshot = useSyncExternalStore(
    useCallback((callback) => subscribeToStorageKey(WISHLIST_STORAGE_KEY, callback), []),
    readStoredWishlistSnapshot,
    () => "[]"
  )

  const storedWishlist = useMemo(() => parseWishlist(wishlistSnapshot), [wishlistSnapshot])
  const hasHydrated = useSyncExternalStore(
    useCallback((callback) => subscribeToHydration(callback), []),
    () => true,
    () => false
  )

  const language = hasHydrated ? storedLanguage : "en"
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const currency = hasHydrated ? storedCurrency : "MAD"
  const wishlist = hasHydrated ? storedWishlist : EMPTY_WISHLIST

  const syncQueue = useRef<Promise<void>>(Promise.resolve())
  useEffect(() => {
    if (!hasHydrated) return
    const keys = wishlist.filter((key) => parseFavoriteKey(key)).slice(0, 200)
    if (!keys.length && !localStorage.getItem("morocco-favorites-synced")) return
    // Remember sync intent before the request: a fast unsave or offline reload
    // must still send the empty snapshot and clear any server-side saves.
    localStorage.setItem("morocco-favorites-synced", "true")
    let cancelled = false
    const enqueue = () => {
      syncQueue.current = syncQueue.current.catch(() => {}).then(async () => {
        if (cancelled) return
        for (let attempt = 0; attempt < 3; attempt++) {
          if (cancelled) return
          try {
            const response = await fetch("/api/favorites", {
              method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keys }), signal: AbortSignal.timeout(15000),
            })
            if (response.ok) { localStorage.setItem("morocco-favorites-synced", "true"); return }
          } catch { /* Local favorites remain available while offline. */ }
          if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 1000 * (attempt + 1)))
        }
      })
    }
    const timer = window.setTimeout(enqueue, 300)
    window.addEventListener("online", enqueue)
    return () => { cancelled = true; window.clearTimeout(timer); window.removeEventListener("online", enqueue) }
  }, [hasHydrated, wishlist])

  const setLanguage = useCallback((lang: LanguageCode) => {
    writeStorage(LANGUAGE_STORAGE_KEY, lang)
  }, [])

  const setCurrency = useCallback((cur: CurrencyCode) => {
    writeStorage(CURRENCY_STORAGE_KEY, cur)
  }, [])

  const toggleWishlist = useCallback((id: string) => {
    const current = parseWishlist(readStoredWishlistSnapshot())
    const nextWishlist = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    writeStorage(WISHLIST_STORAGE_KEY, JSON.stringify(nextWishlist))
  }, [])

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist])

  const contextValue = useMemo<AppContextType>(
    () => ({ language, setLanguage, currency, setCurrency, wishlist, toggleWishlist, isWishlisted }),
    [currency, isWishlisted, language, setCurrency, setLanguage, toggleWishlist, wishlist]
  )

  return (
    <AppContext.Provider value={contextValue}>
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
