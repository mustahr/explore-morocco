"use client"
import { useEffect, useState } from "react"
import type { Campaign, EmailContact } from "@/lib/email-marketing"
import { formatMoroccoDateTime } from "@/lib/record-timestamps"

export function EmailMarketing() {
  const [contacts, setContacts] = useState<EmailContact[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<"subscribers" | "all">("subscribers")
  const [permission, setPermission] = useState(false)
  const [testEmail, setTestEmail] = useState("contact@dunexplore-morocco.com")
  const [preview, setPreview] = useState<Campaign | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const [configured, setConfigured] = useState(false)
  async function api(body?: Record<string, unknown>) {
    const response = await fetch("/api/admin/email-marketing", body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Could not complete this action.")
    return data
  }
  async function load() {
    const data = await api()
    setContacts(data.contacts); setCampaigns(data.campaigns); setConfigured(data.configured)
  }
  useEffect(() => { let active = true; api().then((data) => { if (active) { setContacts(data.contacts); setCampaigns(data.campaigns); setConfigured(data.configured) } }).catch((error) => { if (active) setNotice(error.message) }); return () => { active = false } }, [])
  async function run(action: () => Promise<void>) {
    setBusy(true); setNotice("")
    try { await action() } catch (error) { setNotice(error instanceof Error ? error.message : "Could not complete this action.") }
    finally { setBusy(false) }
  }
  async function send(campaign: Campaign) {
    setPreview(campaign)
    let current = campaign
    while (current.status !== "complete") {
      const data = await api({ action: "send", id: current.id })
      current = data.campaign
      setPreview(current)
      setCampaigns((items) => [current, ...items.filter((item) => item.id !== current.id)])
      if (current.status !== "complete") await new Promise((resolve) => setTimeout(resolve, 700))
    }
    setNotice(`Campaign complete: ${Object.values(current.batches).reduce((sum, batch) => sum + batch.count, 0)} emails accepted by Resend. Check Resend for delivery and bounce status.`)
  }
  const eligible = contacts.filter((contact) => !contact.unsubscribed && (audience === "all" || contact.subscribed))
  const visible = contacts.filter((contact) => `${contact.email} ${contact.name} ${contact.sources.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || (filter === "subscribers" ? contact.subscribed && !contact.unsubscribed : filter === "unsubscribed" ? contact.unsubscribed : contact.sources.includes(filter))))
  return <section className="mt-8 space-y-6">
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-bold">Email audience</h2>
      <p className="mt-2 text-sm text-stone-600">Contacts from bookings, messages, and newsletter signups are collected here automatically. Duplicate addresses are combined. All dates use Morocco time.</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm"><span className="rounded-xl bg-stone-100 px-4 py-2">{contacts.length} contacts</span><span className="rounded-xl bg-emerald-50 px-4 py-2">{contacts.filter((item) => item.subscribed && !item.unsubscribed).length} newsletter subscribers</span><span className="rounded-xl bg-amber-50 px-4 py-2">{contacts.filter((item) => item.unsubscribed).length} unsubscribed</span></div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row"><input aria-label="Search email contacts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search email, name, or source" className="admin-input min-w-0 flex-1" /><select aria-label="Filter email contacts" value={filter} onChange={(event) => setFilter(event.target.value)} className="admin-input sm:w-auto">{["all", "subscribers", "Booking", "Message / enquiry", "Newsletter", "unsubscribed"].map((item) => <option key={item} value={item}>{item}</option>)}</select><button disabled={busy} onClick={() => run(load)} className="rounded-xl border px-4 py-2">Refresh</button></div>
      <p className="mt-3 text-xs text-stone-500">{visible.length} matching contacts. A booking or message alone is not recorded as newsletter consent.</p>
      <div className="mt-4 max-h-[32rem] overflow-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="sticky top-0 bg-stone-100"><tr>{["Contact", "Sources", "Email preference", "First / latest activity", "Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{visible.map((contact) => <tr key={contact.id} className="border-b border-stone-100"><td className="p-3"><p className="font-semibold">{contact.email}</p><p className="text-stone-500">{contact.name}</p></td><td className="p-3">{contact.sources.join(", ")}</td><td className="p-3">{contact.unsubscribed ? "Unsubscribed — excluded" : contact.subscribed ? "Newsletter subscriber" : "No newsletter consent recorded"}</td><td className="p-3 text-xs leading-6">{formatMoroccoDateTime(contact.firstSeen)}<br />{formatMoroccoDateTime(contact.lastSeen)}</td><td className="p-3">{!contact.unsubscribed && <button disabled={busy} className="text-red-700 underline" onClick={() => run(async () => { await api({ action: "suppress", email: contact.email }); await load(); setNotice("Contact excluded from future newsletters and offers.") })}>Unsubscribe</button>}</td></tr>)}</tbody></table>{!visible.length && <p className="p-6 text-center text-stone-500">No matching email contacts.</p>}</div>
    </div>
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-bold">Newsletters & offers</h2>
      {!configured && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Sending needs RESEND_API_KEY in Vercel Production and a verified sender. You can collect contacts and prepare campaigns now.</p>}
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">Audience<select value={audience} onChange={(event) => { setAudience(event.target.value as "subscribers" | "all"); setPreview(null) }} className="admin-input"><option value="subscribers">Newsletter subscribers</option><option value="all">All contacts I have permission to email</option></select></label>
        {audience === "all" && <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={permission} onChange={(event) => setPermission(event.target.checked)} className="mt-1" />I confirm I have permission to send this newsletter or offer to these contacts. Unsubscribed contacts remain excluded.</label>}
        <p className="text-sm text-stone-500">{eligible.length} eligible recipients. Emails are sent individually; recipients cannot see other email addresses.</p>
        <label className="grid gap-2 text-sm font-semibold">Subject<input value={subject} maxLength={180} onChange={(event) => { setSubject(event.target.value); setPreview(null) }} className="admin-input" placeholder="Your next Morocco adventure awaits" /></label>
        <label className="grid gap-2 text-sm font-semibold">Message<textarea value={message} maxLength={20000} rows={9} onChange={(event) => { setMessage(event.target.value); setPreview(null) }} className="admin-input" placeholder="Write your newsletter or offer here. Include full website links and the offer conditions." /></label>
        <div className="flex flex-col gap-3 sm:flex-row"><input type="email" aria-label="Test email recipient" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} className="admin-input min-w-0 flex-1" /><button disabled={busy || !configured || !subject.trim() || !message.trim()} onClick={() => run(async () => { const result = await api({ action: "test", subject, message, email: testEmail }); setNotice(result.message) })} className="rounded-xl border px-4 py-3 font-semibold disabled:opacity-50">Send test email</button><button disabled={busy || !subject.trim() || !message.trim() || !eligible.length || (audience === "all" && !permission)} onClick={() => run(async () => { const result = await api({ action: "create", subject, message, audience, permissionConfirmed: permission }); setPreview(result.campaign); await load() })} className="btn-primary rounded-xl px-5 py-3 font-semibold disabled:opacity-50">Save & preview</button></div>
      </div>
      {preview && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-xs uppercase tracking-wider">Saved campaign · {preview.recipients.length} recipients · {preview.audience}</p><h3 className="mt-3 text-xl font-bold">{preview.subject}</h3><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">{preview.message}</p><p className="mt-6 text-xs text-stone-600">Dunexplore Morocco · Marrakech, Morocco<br />An unsubscribe link is included in every email.</p><p className="mt-3 text-sm">{Object.values(preview.batches).reduce((sum, batch) => sum + batch.count, 0)} emails accepted by provider.</p>{preview.status !== "complete" && <button disabled={busy || !configured} onClick={() => run(() => send(preview))} className="mt-4 rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Working…" : `Send campaign to ${preview.recipients.length} contacts`}</button>}<p className="mt-3 text-xs text-stone-500">Keep this page open during sending. If interrupted, resume this saved campaign from history.</p></div>}
      {notice && <p role="status" className="mt-5 rounded-xl bg-stone-100 p-4 text-sm">{notice}</p>}
    </div>
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">Campaign history</h2><div className="mt-4 space-y-3">{campaigns.map((campaign) => <div key={campaign.id} className="rounded-xl border p-4"><p className="font-semibold">{campaign.subject}</p><p className="mt-2 text-sm text-stone-600">{formatMoroccoDateTime(campaign.createdAt)} · {campaign.status} · {Object.values(campaign.batches).reduce((sum, batch) => sum + batch.count, 0)} accepted / {campaign.recipients.length} recipients</p>{campaign.lastError && <p className="mt-2 text-sm text-red-700">{campaign.lastError}</p>}<button disabled={busy} onClick={() => setPreview(campaign)} className="mt-3 text-sm font-semibold underline">{campaign.status === "complete" ? "View campaign" : "Review / resume"}</button></div>)}{!campaigns.length && <p className="text-sm text-stone-500">No campaigns yet. Save a preview to get started.</p>}</div></div>
  </section>
}
