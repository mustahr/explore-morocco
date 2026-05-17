"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/utils"
import { useState } from "react"

const SocialIcons = () => (
  <>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  </>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

export function Footer() {
  const { language } = useApp()
  const t = translations[language]
  const [email, setEmail] = useState("")

  return (
    <footer className="relative isolate overflow-hidden bg-[#0D0D0D] text-white md:fixed md:inset-x-0 md:bottom-0 md:z-0 md:h-[28rem]">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=80')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[#0D0D0D]/88" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0F3D2E]/55" aria-hidden="true" />

      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="mb-4 block w-56" aria-label="Saharavanta Morocco home">
              <Image
                src="/saharavanta-logo.png"
                alt="Saharavanta Morocco"
                width={1024}
                height={378}
                className="h-auto w-full bg-transparent"
                style={{ background: "none" }}
              />
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors">
                <SocialIcons />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors">
                <TwitterIcon />
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
                <span>hello@moroccoai.com</span>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Phone size={16} className="text-primary" />
                <span>+212 5XX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <MapPin size={16} className="text-primary" />
                <span>Marrakech, Morocco</span>
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
            &copy; 2026 MoroccoAI. {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-stone-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-stone-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
