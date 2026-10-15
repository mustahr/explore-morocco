"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { useApp } from "@/context/AppContext"

const copy = {
  en: { email: "Email address", placeholder: "Enter your email", submit: "Subscribe", sending: "Saving…", consent: "Send me travel inspiration and offers.", privacy: "Privacy Policy", success: "Thank you! Your subscription has been saved.", error: "Could not save your subscription. Please try again." },
  fr: { email: "Adresse e-mail", placeholder: "Entrez votre e-mail", submit: "S’abonner", sending: "Enregistrement…", consent: "Je souhaite recevoir des idées de voyage et des offres.", privacy: "Confidentialité", success: "Merci ! Votre inscription a été enregistrée.", error: "Impossible d’enregistrer votre inscription. Réessayez." },
  ar: { email: "البريد الإلكتروني", placeholder: "أدخل بريدك الإلكتروني", submit: "اشترك", sending: "جارٍ الحفظ…", consent: "أرغب في تلقي أفكار وعروض السفر.", privacy: "سياسة الخصوصية", success: "شكراً! تم حفظ اشتراكك.", error: "تعذر حفظ اشتراكك. يرجى المحاولة مجدداً." },
}

export function NewsletterForm() {
  const { language } = useApp()
  const t = copy[language]
  const id = useId()
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return
    const form = event.currentTarget
    setStatus("sending")
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website: new FormData(form).get("website") }),
      })
      const result = await response.json()
      if (!response.ok || result.subscribed !== true) throw new Error("Subscription failed")
      setStatus("success"); setEmail(""); setConsent(false)
    } catch { setStatus("error") }
  }

  return (
    <form onSubmit={submit} className="min-w-0">
      <label htmlFor={id} className="sr-only">{t.email}</label>
      <div className="flex min-w-0">
        <input id={id} type="email" name="email" autoComplete="email" required maxLength={254} disabled={status === "sending"} value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle") }} placeholder={t.placeholder} className="min-w-0 flex-1 rounded-s-xl border-0 bg-stone-800 px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary" />
        <button type="submit" disabled={status === "sending"} aria-label={status === "sending" ? t.sending : t.submit} className="shrink-0 rounded-e-xl bg-primary px-4 text-stone-950 transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"><Send size={18} aria-hidden="true" /></button>
      </div>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-stone-300"><input type="checkbox" required checked={consent} disabled={status === "sending"} onChange={(event) => setConsent(event.target.checked)} className="mt-1 shrink-0 accent-primary" /><span>{t.consent} <Link href="/privacy" className="underline underline-offset-2 hover:text-white">{t.privacy}</Link></span></label>
      <p role={status === "error" ? "alert" : "status"} aria-live="polite" className={`mt-2 text-xs leading-5 ${status === "error" ? "text-red-300" : "text-amber-200"}`}>{status === "sending" ? t.sending : status === "success" ? t.success : status === "error" ? t.error : ""}</p>
    </form>
  )
}
