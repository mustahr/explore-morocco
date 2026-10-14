"use client"
import { useState } from "react"
import Link from "next/link"
import { contactWhatsAppHref } from "@/lib/contact"
import { EmailNotificationTest } from "./EmailNotificationTest"

const checks = [
  { id: "configuration", title: "Environment settings", detail: "Checks required settings without showing secrets." },
  { id: "database", title: "Database read/write", detail: "Writes, reads, and removes an isolated probe." },
  { id: "catalog", title: "Catalog data", detail: "Reads all six content collections." },
  { id: "booking", title: "Booking submission", detail: "Creates a marked TEST reservation through the real booking endpoint and attempts email/push notifications." },
  { id: "message", title: "Contact submission", detail: "Creates a marked TEST message through the real contact endpoint and attempts email/push notifications." },
  { id: "storage", title: "Image uploads", detail: "Uploads a tiny image, checks public access, then deletes it." },
  { id: "whatsapp", title: "Automatic WhatsApp alert", detail: "Sends a marked test through your configured WhatsApp Business sender and approved booking template." },
  { id: "push", title: "Browser notifications", detail: "Sends a test to subscribed admin devices. Enable notifications in the header first." },
  { id: "webhook", title: "Operations webhook", detail: "Sends a marked test to the optional connected automation." },
  { id: "cleanup", title: "Remove test records", detail: "Deletes only reservations and messages created by these test buttons." },
]
export function ProjectDiagnostics() {
  const [running, setRunning] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { status: string; message: string }>>({})
  async function run(id: string) {
    setRunning(id)
    try {
      const response = await fetch(id === "configuration" ? "/api/admin/system-status" : "/api/admin/diagnostics", id === "configuration" ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: id }) })
      const data = await response.json()
      let result = data
      if (response.status === 401) result = { status: "failed", message: "Your admin session expired. Sign in again." }
      else if (id === "configuration" && response.ok) {
        const missing = data.variables.filter((item: { configured: boolean }) => !item.configured).map((item: { name: string }) => item.name)
        const emailKey = data.optionalVariables.find((item: { name: string }) => item.name === "RESEND_API_KEY")
        result = { status: missing.length || !emailKey?.configured ? "blocked" : "passed", message: `${missing.length ? `Missing required settings: ${missing.join(", ")}.` : "All required settings are present."} ${emailKey?.configured ? "Email API key is present; run the email test to verify sending." : "RESEND_API_KEY is missing; email cannot send yet."}` }
      }
      setResults((current) => ({ ...current, [id]: result }))
    } catch { setResults((current) => ({ ...current, [id]: { status: "failed", message: "Could not complete the test. Check your connection and retry." } })) }
    finally { setRunning(null) }
  }
  return <div className="lg:col-span-2 space-y-6">
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
      <h3 className="text-xl font-bold">Project tests</h3>
      <p className="mt-2 text-sm text-stone-600">Run each check individually. Submission tests create test records and may send notifications.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {checks.map((check) => <div key={check.id} className="rounded-2xl border border-stone-200 p-4">
          <h4 className="text-base font-semibold">{check.title}</h4>
          <p className="mt-2 text-sm text-stone-500">{check.detail}</p>
          <button type="button" onClick={() => run(check.id)} disabled={running !== null} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-stone-950 disabled:opacity-50">{running === check.id ? "Testing…" : check.id === "cleanup" ? "Remove test records" : "Run test"}</button>
          {results[check.id] && <p role="status" className={`mt-3 rounded-xl p-3 text-sm ${results[check.id].status === "passed" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{results[check.id].message}</p>}
        </div>)}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-primary">
        <Link href="/admin?section=bookings">View bookings</Link><Link href="/admin?section=leads">View messages</Link><Link href="/admin?section=content">Check content health</Link>
        <a href={contactWhatsAppHref("TEST — checking the Dunexplore Morocco WhatsApp link.")} target="_blank" rel="noopener noreferrer">Test WhatsApp link</a>
      </div>
      <p className="mt-3 text-sm text-stone-500">The WhatsApp test opens a prepared message; press Send in WhatsApp. It does not test automatic WhatsApp alerts.</p>
    </div>
    <EmailNotificationTest />
  </div>
}
