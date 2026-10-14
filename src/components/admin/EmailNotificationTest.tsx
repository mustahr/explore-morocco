"use client"

import { useState } from "react"

export function EmailNotificationTest() {
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ status: string; message: string; id?: string } | null>(null)
  async function sendTest() {
    setSending(true)
    setResult(null)
    try {
      const response = await fetch("/api/admin/test-email", { method: "POST" })
      const data = await response.json()
      setResult(response.status === 401 ? { status: "failed", message: "Your admin session expired. Sign in again." } : data)
    } catch {
      setResult({ status: "failed", message: "Could not run the email test. Check your connection and try again." })
    } finally { setSending(false) }
  }
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
      <h3 className="text-xl font-bold text-stone-900">Email notifications</h3>
      <p className="mt-3 text-sm text-stone-600">Test the same email service used for booking requests and contact messages. This sends one email to your configured notification inbox without creating a booking.</p>
      <button type="button" disabled={sending} onClick={sendTest} className="mt-4 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-stone-950 disabled:opacity-60">
        {sending ? "Sending test…" : "Send test email"}
      </button>
      {result && <div role="status" className={`mt-4 rounded-xl p-4 text-sm ${result.status === "sent" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
        <p>{result.message}</p>
        {result.id && <p className="mt-2 break-all">Resend email ID: {result.id}</p>}
      </div>}
      <p className="mt-4 text-sm text-stone-500">WhatsApp copies let visitors send their saved booking themselves. Automatic alerts require the WhatsApp Business settings listed in System status.</p>
    </div>
  )
}
