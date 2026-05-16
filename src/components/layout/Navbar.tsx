"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Heart, Globe, ChevronDown } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations, type LanguageCode, type CurrencyCode, currencies } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
          : "bg-stone-900/95 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className={`text-xl lg:text-2xl font-bold ${isHomePage ? (isScrolled ? "text-primary" : "text-white") : "text-white"}`}>
              Morocco<span className="text-accent">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? isHomePage
                      ? "text-primary"
                      : "text-primary-light"
                    : isHomePage
                      ? isScrolled
                        ? "text-stone-600 hover:text-primary"
                        : "text-white/90 hover:text-white"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {t.nav[link.key]}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/trip-generator"
              className="hidden sm:flex btn-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              {t.nav.generateTrip}
            </Link>

            <Link
              href="/trip-generator"
              className="sm:hidden btn-primary text-white p-2 rounded-full"
            >
              <Heart size={20} />
            </Link>

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 p-2 rounded-full transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? "text-stone-600 hover:text-primary"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-stone-200 py-2 w-40"
                  >
                    {(["en", "fr", "ar"] as LanguageCode[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setLangOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${
                          language === lang ? "text-primary font-semibold" : "text-stone-600"
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
                      ? "text-stone-600 hover:text-primary"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-stone-200 py-2 w-36"
                  >
                    {(Object.keys(currencies) as CurrencyCode[]).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => { setCurrency(cur); setCurOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${
                          currency === cur ? "text-primary font-semibold" : "text-stone-600"
                        }`}
                      >
                        {currencies[cur].symbol} {cur}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full ${isHomePage ? (isScrolled ? "text-stone-800" : "text-white") : "text-white"}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-stone-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {t.nav[link.key]}
                </Link>
              ))}
              <Link
                href="/trip-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="block btn-primary text-white px-4 py-3 rounded-xl text-sm font-semibold text-center mt-3"
              >
                {t.nav.generateTrip}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
