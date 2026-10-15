"use client"

import { useTranslations } from "@/context/useTranslations"
import { useState } from "react"
import Link from "next/link"
export function UnsubscribeForm({ token }: { token: string }) {
  const { tr } = useTranslations()
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  async function unsubscribe() {
    setBusy(true)
    try {
      const response = await fetch("/api/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setMessage(result.message); setDone(true)
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again.") }
    finally { setBusy(false) }
  }
  return <div className="px-4 pb-24 pt-36 lg:pt-40"><div className="mx-auto max-w-lg rounded-3xl border border-stone-200 bg-white p-8"><h1 className="text-3xl font-bold">{tr("Email preferences")}</h1><p className="mt-4 text-stone-600">{tr("Stop receiving travel newsletters and offers from Dunexplore Morocco. Messages about your booking can still be sent separately.")}</p>{!done && <button disabled={!token || busy} onClick={unsubscribe} className="btn-primary mt-6 rounded-xl px-5 py-3 font-semibold disabled:opacity-50">{busy ? tr("Saving…") : tr("Unsubscribe")}</button>}<p role="status" className="mt-4">{message || (!token ? tr("Open the unsubscribe link in your email, or contact our team for help.") : "")}</p><Link href="/contact" className="mt-5 inline-block underline">{tr("Contact our team")}</Link></div></div>
}
