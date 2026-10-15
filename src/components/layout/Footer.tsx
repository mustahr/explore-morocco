"use client"

import { useTranslations } from "@/context/useTranslations"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE, CONTACT_PHONE_HREF, contactEmailHref, contactWhatsAppHref } from "@/lib/contact"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/utils"
import { NewsletterForm } from "./NewsletterForm"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export function Footer({ onRevealHeightChange }: { onRevealHeightChange: (height: number) => void }) {
  const { tr } = useTranslations()
  const footerRef = useRef<HTMLElement>(null)
  const [reveal, setReveal] = useState(false)
  const { language } = useApp()
  const t = translations[language]

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return
    const update = () => {
      const height = Math.ceil(footer.getBoundingClientRect().height)
      // Keep every link reachable when columns stack, text grows, or the viewport is short.
      const canReveal = window.matchMedia("(min-width: 1024px)").matches && height > 0 && height <= window.innerHeight - 120
      setReveal(canReveal)
      onRevealHeightChange(canReveal ? height : 0)
    }
    const observer = new ResizeObserver(update)
    observer.observe(footer)
    window.addEventListener("resize", update)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
      onRevealHeightChange(0)
    }
  }, [onRevealHeightChange])

  return (
    <footer ref={footerRef} onFocusCapture={() => {
      if (reveal) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
    }} className={`isolate overflow-hidden bg-[#0D0D0D] text-white ${reveal ? "fixed inset-x-0 bottom-0 z-0" : "relative"}`}>
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          quality={80}
          parallaxOffset={76}
          className="object-cover"
          fallbackClassName="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[#0D0D0D]/88" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0F3D2E]/55" aria-hidden="true" />

      <div className="mx-auto flex max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:gap-12 [&>div]:min-w-0">
          <div>
            <Link href="/" className="my-2 mb-6 mr-4 block w-56 max-w-full" aria-label={tr("Dunexplore Morocco home")}>
              <ImageWithFallback
                src="/dunexplore-logo-transparent.png"
                alt="Dunexplore Morocco"
                width={1134}
                height={450}
                parallax={false}
                className="h-auto w-full bg-transparent"
              />
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a href={contactWhatsAppHref()} target="_blank" rel="noopener noreferrer" aria-label={tr("Contact Dunexplore Morocco on WhatsApp (opens in a new tab)")} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 transition-colors hover:bg-primary hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <MessageCircle size={18} aria-hidden="true" />
              </a>
              <a href={contactEmailHref()} aria-label={tr("Email Dunexplore Morocco")} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 transition-colors hover:bg-primary hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <Mail size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><Link href="/trip-generator" className="text-sm font-semibold text-amber-200 transition-colors hover:text-white">{t.nav.generateTrip}</Link></li>
              {["trips", "destinations", "experiences", "blog", "about", "contact"].map((link) => (
                <li key={link}>
                  <Link href={`/${link}`} className="text-stone-400 hover:text-white transition-colors text-sm">
                    {t.nav[link as keyof typeof t.nav]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.footer.support}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Mail size={16} className="text-primary" />
                <a href={contactEmailHref()} className="min-w-0 break-all hover:text-white transition-colors">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Phone size={16} className="text-primary" />
                <a href={CONTACT_PHONE_HREF} dir="ltr" className="hover:text-white transition-colors">{CONTACT_PHONE}</a>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <MapPin size={16} className="text-primary" />
                <span>{tr(CONTACT_LOCATION)}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.footer.newsletter}</h3>
            <p className="text-stone-400 text-sm mb-4">{tr("Get travel inspiration and exclusive offers.")}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            &copy; 2026 Dunexplore Morocco. {t.footer.rights}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link href="/privacy" className="text-stone-500 hover:text-white text-sm transition-colors">{tr("Privacy Policy")}</Link>
            <Link href="/terms" className="text-stone-500 hover:text-white text-sm transition-colors">{tr("Terms of Service")}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
