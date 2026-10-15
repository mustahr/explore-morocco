"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ArrowRight, Globe, Wallet } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations, type LanguageCode, type CurrencyCode } from "@/lib/utils"

export function MenuGlyph({ open }: { open: boolean }) {
  const reduceMotion = useReducedMotion()
  return (
    <span aria-hidden="true" className="relative block h-5 w-5">
      <motion.span
        className="absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current"
        animate={{ y: open ? 5 : 0, rotate: open ? 45 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
      />
      <motion.span
        className="absolute left-0 top-2.5 block h-0.5 w-3.5 rounded-full bg-current"
        animate={{ opacity: open ? 0 : 1, x: open ? 5 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15 }}
      />
      <motion.span
        className="absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-current"
        animate={{ y: open ? -7 : 0, rotate: open ? -45 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
      />
    </span>
  )
}

export function MobileNavigation({ links, onClose }: {
  links: Array<{ href: string; label: string }>
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const pathname = usePathname()
  const { language, setLanguage, currency, setCurrency } = useApp()
  const t = translations[language]
  const labels = {
    en: { title: "Explore Morocco", close: "Close menu", preferences: "Travel preferences", language: "Language", currency: "Currency" },
    fr: { title: "Explorer le Maroc", close: "Fermer le menu", preferences: "Préférences de voyage", language: "Langue", currency: "Devise" },
    ar: { title: "اكتشف المغرب", close: "إغلاق القائمة", preferences: "تفضيلات السفر", language: "اللغة", currency: "العملة" },
  }[language]

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    closeRef.current?.focus()
    document.body.style.overflow = "hidden"
    const desktop = window.matchMedia("(min-width: 1024px)")
    const handleResize = () => { if (desktop.matches) onClose() }
    desktop.addEventListener("change", handleResize)
    window.addEventListener("popstate", onClose)
    return () => {
      desktop.removeEventListener("change", handleResize)
      window.removeEventListener("popstate", onClose)
      document.body.style.overflow = previousOverflow
      dialog?.close()
      previousFocus?.focus({ preventScroll: true })
    }
  }, [onClose])

  return (
    <motion.dialog
      ref={dialogRef}
      id="mobile-navigation"
      aria-labelledby="mobile-menu-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-white backdrop:bg-black/50"
    >
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      />
      <motion.div
        dir={language === "ar" ? "rtl" : "ltr"}
        initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
        animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }}
        className="relative ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto overscroll-contain border-l border-amber-100/15 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.16),transparent_55%),linear-gradient(160deg,#18251e,#0d1210_65%)] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e9ce83]">Dunexplore</p>
            <h2 id="mobile-menu-title" className="mt-1 text-xl font-semibold text-[#fff7e4]">{labels.title}</h2>
          </div>
          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e9ce83]/40 bg-[#e9ce83]/10 text-[#e9ce83] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
          >
            <MenuGlyph open />
          </motion.button>
        </div>

        <Link
          href="/trip-generator"
          onClick={onClose}
          className="mt-5 flex min-h-14 shrink-0 items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#efdca0] px-5 py-4 font-semibold text-stone-950 shadow-lg shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
        >
          {t.nav.generateTrip}<ArrowRight size={19} aria-hidden="true" />
        </Link>

        <motion.nav
          aria-label={labels.title}
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.045, delayChildren: reduceMotion ? 0 : 0.08 } } }}
          className="my-5 space-y-1"
        >
          {links.map((link, index) => {
            const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <motion.div
                key={link.href}
                variants={{ hidden: { opacity: 0, x: reduceMotion ? 0 : 18 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
              >
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className={`group flex min-h-12 items-center gap-4 rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 ${active ? "border-[#e9ce83]/25 bg-[#e9ce83]/10 text-[#efdca0]" : "border-transparent text-white/85 hover:border-white/10 hover:bg-white/5"}`}
                >
                  <span aria-hidden="true" className="w-5 text-[10px] font-medium tabular-nums text-white/35">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg font-medium">{link.label}</span>
                  <ArrowUpRight aria-hidden="true" size={18} className="text-[#e9ce83]/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </motion.div>
            )
          })}
        </motion.nav>



        <section aria-label={labels.preferences} className="mt-6 border-t border-white/10 pt-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">{labels.preferences}</p>
          <div className="space-y-3">
            <div role="group" aria-label={labels.language} className="flex items-center gap-2">
              <Globe size={16} aria-hidden="true" className="mr-2 shrink-0 text-[#e9ce83]/70" />
              {(["en", "fr", "ar"] as LanguageCode[]).map((value) => (
                <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)}
                  className={`min-h-11 flex-1 rounded-xl border px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber-200 ${language === value ? "border-[#e9ce83]/35 bg-[#e9ce83]/15 text-[#efdca0]" : "border-white/10 text-white/60 hover:bg-white/5"}`}>
                  {value === "en" ? "English" : value === "fr" ? "Français" : "العربية"}
                </button>
              ))}
            </div>
            <div role="group" aria-label={labels.currency} className="flex items-center gap-2">
              <Wallet size={16} aria-hidden="true" className="mr-2 shrink-0 text-[#e9ce83]/70" />
              {(["MAD", "EUR", "USD"] as CurrencyCode[]).map((value) => (
                <button key={value} type="button" aria-pressed={currency === value} onClick={() => setCurrency(value)}
                  className={`min-h-11 flex-1 rounded-xl border px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber-200 ${currency === value ? "border-[#e9ce83]/35 bg-[#e9ce83]/15 text-[#efdca0]" : "border-white/10 text-white/60 hover:bg-white/5"}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </motion.dialog>
  )
}
