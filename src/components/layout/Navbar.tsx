"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe, ChevronDown } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations, type LanguageCode, type CurrencyCode, currencies } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import { MobileNavigation, MenuGlyph } from "./MobileNavigation"

const navLinks = [
  { href: "/", key: "home" },
  { href: "/trips", key: "trips" },
  { href: "/destinations", key: "destinations" },
  { href: "/experiences", key: "experiences" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const

export function Navbar() {
  const reduceMotion = useReducedMotion()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])
  const [openSelector, setOpenSelector] = useState<"language" | "currency" | null>(null)
  const selectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openSelector) return
    const closeOutside = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setOpenSelector(null)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      selectorRef.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus()
      setOpenSelector(null)
    }
    document.addEventListener("pointerdown", closeOutside)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOutside)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [openSelector])
  const { language, setLanguage, currency, setCurrency } = useApp()
  const pathname = usePathname()
  const t = translations[language]
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={reduceMotion ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isScrolled
            ? "bg-[#0D0D0D]/92 shadow-lg backdrop-blur-md"
            : "border-b border-[#D4AF37]/15 bg-[#0D0D0D]/78 shadow-2xl shadow-black/20 backdrop-blur-md"
          : "bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 min-w-0 items-center justify-between gap-2 lg:h-24">
          <Link href="/" className="my-1 flex shrink-0 items-center lg:mr-1" aria-label="Dunexplore Morocco home">
            <ImageWithFallback
              src="/dunexplore-logo-transparent.png"
              alt="Dunexplore Morocco"
              width={1134}
              height={450}
              preload
              parallax={false}
              className="h-auto w-24 bg-transparent drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)] sm:w-44 lg:w-28 xl:w-36 2xl:w-52"
            />
          </Link>

          <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-0.5 lg:flex xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-1 xl:px-2 py-2 rounded-full text-sm xl:text-base font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-primary-light"
                    : isHomePage
                      ? isScrolled
                        ? "text-white/80 hover:text-white"
                        : "text-white/90 hover:text-white"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {t.nav[link.key]}
              </Link>
            ))}
          </div>

          <div ref={selectorRef} className="hidden shrink-0 items-center gap-1 xl:gap-2 lg:flex"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenSelector(null)
            }}
          >
            <Link
              href="/trip-generator"
              aria-current={pathname === "/trip-generator" ? "page" : undefined}
              className="btn-primary inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-3 py-2.5 text-xs font-semibold text-stone-950 xl:text-sm"
            >
              {t.nav.generateTrip}
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-label="Select language"
                aria-expanded={openSelector === "language"}
                aria-controls="navbar-language-options"
                onClick={() => setOpenSelector(openSelector === "language" ? null : "language")}
                className={`flex items-center gap-1 p-2 rounded-full transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? "text-white/80 hover:text-white"
                      : "text-white/90 hover:text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Globe size={18} />
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {openSelector === "language" && (
                  <motion.div
                    id="navbar-language-options"
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fffaf0] p-1.5 shadow-2xl shadow-stone-950/20 backdrop-blur-xl"
                  >
                    {(["en", "fr", "ar"] as LanguageCode[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setOpenSelector(null) }}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                          language === lang ? "bg-amber-100 text-stone-950 font-semibold" : "text-stone-600 hover:bg-white"
                        }`}
                      >
                        {lang === "en" ? "English" : lang === "fr" ? "Fran\u00E7ais" : "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Select currency"
                aria-expanded={openSelector === "currency"}
                aria-controls="navbar-currency-options"
                onClick={() => setOpenSelector(openSelector === "currency" ? null : "currency")}
                className={`flex items-center gap-1 p-2 rounded-full text-sm font-medium transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? "text-white/80 hover:text-white"
                      : "text-white/90 hover:text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {currency}
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {openSelector === "currency" && (
                  <motion.div
                    id="navbar-currency-options"
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    className="absolute right-0 top-full mt-3 w-40 overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fffaf0] p-1.5 shadow-2xl shadow-stone-950/20 backdrop-blur-xl"
                  >
                    {(Object.keys(currencies) as CurrencyCode[]).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => { setCurrency(cur); setOpenSelector(null) }}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                          currency === cur ? "bg-amber-100 text-stone-950 font-semibold" : "text-stone-600 hover:bg-white"
                        }`}
                      >
                        {currencies[cur].symbol === cur ? cur : `${currencies[cur].symbol} ${cur}`}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          <Link href="/trip-generator" aria-label={t.nav.generateTrip} aria-current={pathname === "/trip-generator" ? "page" : undefined} className="ml-auto inline-flex min-h-11 shrink-0 items-center rounded-full border border-amber-200/40 bg-amber-100/10 px-3 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-100/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 lg:hidden">
            <span className="sm:hidden">{language === "ar" ? "خطط" : language === "fr" ? "Planifier" : "Plan"}</span>
            <span className="hidden sm:inline">{t.nav.generateTrip}</span>
          </Link>

          <motion.button
            type="button"
            aria-label={language === "ar" ? "فتح قائمة التنقل" : language === "fr" ? "Ouvrir le menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => setMobileMenuOpen(true)}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            className="flex h-12 shrink-0 items-center gap-3 rounded-full border border-[#e9ce83]/40 bg-gradient-to-br from-[#efdca0] to-[#d4af37] px-4 text-sm font-semibold text-stone-950 shadow-lg shadow-black/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 lg:hidden"
          >
            <span>{language === "ar" ? "القائمة" : "Menu"}</span>
            <MenuGlyph open={mobileMenuOpen} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNavigation
            links={navLinks.map((link) => ({ href: link.href, label: t.nav[link.key] }))}
            onClose={closeMobileMenu}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
