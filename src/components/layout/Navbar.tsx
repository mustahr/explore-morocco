"use client"

import { useState, useEffect, useCallback } from "react"
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
  const [langOpen, setLangOpen] = useState(false)
  const [curOpen, setCurOpen] = useState(false)
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
        <div className="flex h-20 min-w-0 items-center justify-between gap-3 xl:h-24">
          <Link href="/" className="my-1 mr-4 flex shrink-0 items-center" aria-label="Dunexplore Morocco home">
            <ImageWithFallback
              src="/dunexplore-logo-transparent.png"
              alt="Dunexplore Morocco"
              width={1134}
              height={450}
              preload
              parallax={false}
              className="h-auto w-36 bg-transparent drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)] sm:w-44 xl:w-52"
            />
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
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

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <Link
              href="/trip-generator"
              className="hidden 2xl:flex btn-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              {t.nav.generateTrip}
            </Link>

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
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
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fffaf0]/95 p-1.5 shadow-2xl shadow-stone-950/20 backdrop-blur-xl"
                  >
                    {(["en", "fr", "ar"] as LanguageCode[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setLangOpen(false) }}
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
                onClick={() => setCurOpen(!curOpen)}
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
                {curOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    className="absolute right-0 top-full mt-3 w-40 overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fffaf0]/95 p-1.5 shadow-2xl shadow-stone-950/20 backdrop-blur-xl"
                  >
                    {(Object.keys(currencies) as CurrencyCode[]).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => { setCurrency(cur); setCurOpen(false) }}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                          currency === cur ? "bg-amber-100 text-stone-950 font-semibold" : "text-stone-600 hover:bg-white"
                        }`}
                      >
                        {currencies[cur].symbol} {cur}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          <motion.button
            type="button"
            aria-label={language === "ar" ? "فتح قائمة التنقل" : language === "fr" ? "Ouvrir le menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => setMobileMenuOpen(true)}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            className="flex h-12 shrink-0 items-center gap-3 rounded-full border border-[#e9ce83]/40 bg-gradient-to-br from-[#efdca0] to-[#d4af37] px-4 text-sm font-semibold text-stone-950 shadow-lg shadow-black/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 xl:hidden"
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
