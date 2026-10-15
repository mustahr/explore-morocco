"use client"

import Link from "next/link"
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE, CONTACT_PHONE_HREF, contactEmailHref, contactWhatsAppHref } from "@/lib/contact"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/utils"
import { useState } from "react"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export function Footer() {
  const { language } = useApp()
  const t = translations[language]
  const [email, setEmail] = useState("")

  return (
    <footer className="relative isolate overflow-hidden bg-[#0D0D0D] text-white md:fixed md:inset-x-0 md:bottom-0 md:z-0 md:h-[28rem]">
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

      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="my-2 mb-6 mr-4 block w-56" aria-label="Dunexplore Morocco home">
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
              <a href={contactWhatsAppHref()} target="_blank" rel="noopener noreferrer" aria-label="Contact Dunexplore Morocco on WhatsApp (opens in a new tab)" className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 transition-colors hover:bg-primary hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <MessageCircle size={18} aria-hidden="true" />
              </a>
              <a href={contactEmailHref()} aria-label="Email Dunexplore Morocco" className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 transition-colors hover:bg-primary hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <Mail size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
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
                <a href={CONTACT_PHONE_HREF} className="hover:text-white transition-colors">{CONTACT_PHONE}</a>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <MapPin size={16} className="text-primary" />
                <span>{CONTACT_LOCATION}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.footer.newsletter}</h3>
            <p className="text-stone-400 text-sm mb-4">
              Get travel inspiration and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletterPlaceholder}
                className="flex-1 bg-stone-800 border-0 rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary px-4 text-stone-950 transition-colors hover:bg-primary-light">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            &copy; 2026 Dunexplore Morocco. {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-stone-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-stone-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
