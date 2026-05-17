"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Heart, Globe, ChevronDown } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations, type LanguageCode, type CurrencyCode, currencies } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
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
            ? "bg-[#0D0D0D]/92 shadow-lg backdrop-blur-md"
            : "border-b border-[#D4AF37]/15 bg-[#0D0D0D]/78 shadow-2xl shadow-black/20 backdrop-blur-md"
          : "bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between lg:h-24">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Saharavanta Morocco home">
            <ImageWithFallback
              src="/saharavanta-logo.png"
              alt="Saharavanta Morocco"
              width={1024}
              height={378}
              preload
              parallaxOffset={4}
              parallaxStrength={0.4}
              className="h-auto w-44 bg-transparent drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)] sm:w-56 lg:w-64"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white lg:hidden"
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
