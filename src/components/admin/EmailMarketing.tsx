"use client"
import { useEffect, useRef, useState } from "react"
import type { CampaignDesign } from "@/lib/email-template"
import type { Campaign, EmailContact } from "@/lib/email-marketing"
import { formatMoroccoDateTime } from "@/lib/record-timestamps"

export function EmailMarketing() {
  const [contacts, setContacts] = useState<EmailContact[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [design, setDesign] = useState<CampaignDesign>({})
  const [renderedPreview, setRenderedPreview] = useState<{ id: string; html: string } | null>(null)
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop")
  const [audience, setAudience] = useState<"subscribers" | "all" | "single">("subscribers")
  const [clientEmail, setClientEmail] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)
  const clientEmailRef = useRef<HTMLInputElement>(null)
  const [permission, setPermission] = useState(false)
  const [testEmail, setTestEmail] = useState("contact@dunexplore-morocco.com")
  const [preview, setPreview] = useState<Campaign | null>(null)
  const campaignDialog = useRef<HTMLDialogElement>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const [configured, setConfigured] = useState(false)
  const previewId = preview?.id
  useEffect(() => {
    if (!previewId) return
    const dialog = campaignDialog.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [previewId])
  useEffect(() => {
    if (!preview) return
    let ignore = false
    api({ action: "preview", subject: preview.subject, message: preview.message, design: preview.design }).then((data) => {
      if (!ignore) setRenderedPreview({ id: preview.id, html: data.html })
    }).catch((error) => { if (!ignore) setNotice(error.message) })
    return () => { ignore = true }
  }, [preview])
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
  function emailClient(email = "") {
    setAudience("single"); setClientEmail(email); setPreview(null); setNotice("")
    requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      clientEmailRef.current?.focus({ preventScroll: true })
    })
  }
  const eligible = contacts.filter((contact) => !contact.unsubscribed && (audience === "single" ? contact.email === clientEmail.trim().toLowerCase() : audience === "all" || contact.subscribed))
  const recipientCount = audience === "single" ? (clientEmail.trim() ? 1 : 0) : eligible.length
  const visible = contacts.filter((contact) => `${contact.email} ${contact.name} ${contact.sources.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || (filter === "subscribers" ? contact.subscribed && !contact.unsubscribed : filter === "unsubscribed" ? contact.unsubscribed : contact.sources.includes(filter))))
  return <section className="mt-8 space-y-6">
    {notice && <p role="status" className="rounded-xl bg-stone-100 p-4 text-sm">{notice}</p>}
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Email audience</h2><button type="button" disabled={busy} onClick={() => emailClient()} className="btn-primary rounded-xl px-4 py-3 text-sm font-semibold">Email one client</button></div>
      <p className="mt-2 text-sm text-stone-600">Contacts from bookings, messages, and newsletter signups are collected here automatically. Duplicate addresses are combined. All dates use Morocco time.</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm"><span className="rounded-xl bg-stone-100 px-4 py-2">{contacts.length} contacts</span><span className="rounded-xl bg-emerald-50 px-4 py-2">{contacts.filter((item) => item.subscribed && !item.unsubscribed).length} newsletter subscribers</span><span className="rounded-xl bg-amber-50 px-4 py-2">{contacts.filter((item) => item.unsubscribed).length} unsubscribed</span></div>
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_14rem_auto] xl:items-end">
        <label className="grid min-w-0 gap-2 text-sm font-semibold">Search contacts<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search email, name, or source" className="admin-input min-w-0" /></label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold">Filter contacts<select value={filter} onChange={(event) => setFilter(event.target.value)} className="admin-input min-w-0">{["all", "subscribers", "Booking", "Message / enquiry", "Newsletter", "Individual email", "unsubscribed"].map((item) => <option key={item} value={item}>{item === "all" ? "All contacts" : item}</option>)}</select></label>
        <button type="button" disabled={busy} onClick={() => run(async () => { await load(); setNotice("Email contacts and campaign history refreshed.") })} className="min-h-12 shrink-0 rounded-xl border px-4 py-3 font-semibold disabled:opacity-50">{busy ? "Working…" : "Refresh"}</button>
      </div>
      <p className="mt-3 text-xs text-stone-500">{visible.length} matching contacts. A booking or message alone is not recorded as newsletter consent.</p>
      <div className="mt-4 max-h-[32rem] overflow-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="sticky top-0 bg-stone-100"><tr>{["Contact", "Sources", "Email preference", "First / latest activity", "Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{visible.map((contact) => <tr key={contact.id} className="border-b border-stone-100"><td className="p-3"><p className="font-semibold">{contact.email}</p><p className="text-stone-500">{contact.name}</p></td><td className="p-3">{contact.sources.join(", ")}</td><td className="p-3">{contact.unsubscribed ? "Unsubscribed — excluded" : contact.subscribed ? "Newsletter subscriber" : "No newsletter consent recorded"}</td><td className="p-3 text-xs leading-6">{formatMoroccoDateTime(contact.firstSeen)}<br />{formatMoroccoDateTime(contact.lastSeen)}</td><td className="p-3"><button type="button" disabled={busy || contact.unsubscribed} onClick={() => emailClient(contact.email)} className="mb-3 block rounded-lg border px-3 py-2 font-semibold disabled:opacity-50">Email client</button>{!contact.unsubscribed && <button disabled={busy} className="text-red-700 underline" onClick={() => run(async () => { await api({ action: "suppress", email: contact.email }); await load(); setNotice("Contact excluded from future newsletters and offers.") })}>Unsubscribe</button>}</td></tr>)}</tbody></table>{!visible.length && <p className="p-6 text-center text-stone-500">No matching email contacts.</p>}</div>
    </div>
    <div ref={editorRef} className="scroll-mt-28 rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-bold">{audience === "single" ? "Email one client" : "Newsletters & offers"}</h2>
      {!configured && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Sending needs RESEND_API_KEY in Vercel Production and a verified sender. You can collect contacts and prepare campaigns now.</p>}
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">Audience<select value={audience} onChange={(event) => { setAudience(event.target.value as "subscribers" | "all" | "single"); setPreview(null) }} className="admin-input"><option value="single">One client — individual email</option><option value="subscribers">Newsletter subscribers</option><option value="all">All contacts I have permission to email</option></select></label>
        {audience === "single" && <label className="grid gap-2 text-sm font-semibold">Client email<input ref={clientEmailRef} type="email" list="client-email-contacts" value={clientEmail} onChange={(event) => { setClientEmail(event.target.value); setPreview(null) }} placeholder="client@example.com" maxLength={254} className="admin-input" /><datalist id="client-email-contacts">{contacts.filter((contact) => !contact.unsubscribed).map((contact) => <option key={contact.id} value={contact.email}>{contact.name}</option>)}</datalist><span className="text-xs font-normal text-stone-500">Choose an existing contact or enter a new address. This email goes only to this client and uses the same branded template.</span></label>}
        {audience === "all" && <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={permission} onChange={(event) => setPermission(event.target.checked)} className="mt-1" />I confirm I have permission to send this newsletter or offer to these contacts. Unsubscribed contacts remain excluded.</label>}
        <p className="text-sm text-stone-500">{recipientCount} {audience === "single" ? "client selected" : "eligible recipients"}. Emails are sent individually; recipients cannot see other email addresses.</p>
        <label className="grid gap-2 text-sm font-semibold">Subject<input value={subject} maxLength={180} onChange={(event) => { setSubject(event.target.value); setPreview(null) }} className="admin-input" placeholder="Your next Morocco adventure awaits" /></label>
        <label className="grid gap-2 text-sm font-semibold">Message<textarea value={message} maxLength={20000} rows={9} onChange={(event) => { setMessage(event.target.value); setPreview(null) }} className="admin-input" placeholder="Write your newsletter or offer here. Include full website links and the offer conditions." /></label>
        <fieldset className="rounded-2xl border border-stone-200 p-4"><legend className="px-2 text-sm font-semibold">Email design</legend><p className="mb-4 text-xs leading-5 text-stone-500">Your logo and a Morocco photo are included automatically. Customize the image, button, and social profiles below. Instagram and Facebook appear only when their profile URLs are filled in.</p><div className="grid gap-4 md:grid-cols-2">{([
          ["imageUrl", "Hero image URL (optional)", "https://…/your-photo.jpg"],
          ["buttonLabel", "Button label", "Explore Morocco"],
          ["buttonUrl", "Button destination", "https://www.dunexplore-morocco.com/trips"],
          ["instagramUrl", "Instagram profile URL", "https://www.instagram.com/your-profile/"],
          ["facebookUrl", "Facebook page URL", "https://www.facebook.com/your-page/"],
        ] as const).map(([key, label, placeholder]) => <label key={key} className="grid min-w-0 gap-2 text-sm font-semibold">{label}<input type={key === "buttonLabel" ? "text" : "url"} value={design[key] || ""} maxLength={key === "buttonLabel" ? 60 : 2000} onChange={(event) => { setDesign((current) => ({ ...current, [key]: event.target.value })); setPreview(null) }} placeholder={placeholder} className="admin-input min-w-0" /></label>)}</div></fieldset>
        <div className="flex flex-col gap-3 sm:flex-row"><input type="email" aria-label="Test email recipient" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} className="admin-input min-w-0 flex-1" /><button disabled={busy || !configured || !subject.trim() || !message.trim()} onClick={() => run(async () => { const result = await api({ action: "test", subject, message, email: testEmail, design }); setNotice(result.message) })} className="rounded-xl border px-4 py-3 font-semibold disabled:opacity-50">Send test email</button><button disabled={busy || !subject.trim() || !message.trim() || !recipientCount || (audience === "all" && !permission)} onClick={() => run(async () => { const result = await api({ action: "create", subject, message, audience, email: clientEmail, permissionConfirmed: permission, design }); setPreview(result.campaign); await load() })} className="btn-primary rounded-xl px-5 py-3 font-semibold disabled:opacity-50">Save & preview</button></div>
      </div>
      {preview && <dialog ref={campaignDialog} aria-labelledby="campaign-preview-title" onCancel={(event) => { event.preventDefault(); if (!busy) setPreview(null) }} onClick={(event) => { if (event.target === event.currentTarget && !busy) setPreview(null) }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto overscroll-contain rounded-3xl border border-amber-200 bg-white p-5 text-stone-900 shadow-2xl backdrop:bg-black/60 sm:p-7"><div className="mb-5 flex items-start justify-between gap-4"><h2 id="campaign-preview-title" className="text-2xl font-bold">{preview.audience === "single" ? (preview.status === "complete" ? "Email details" : "Review email") : (preview.status === "complete" ? "Campaign details" : "Review campaign")}</h2><button type="button" disabled={busy} onClick={() => setPreview(null)} className="shrink-0 rounded-xl border px-4 py-2 font-semibold disabled:opacity-50">Close</button></div><p className="mb-3 text-xs text-stone-500">{preview.audience === "single" ? `To: ${preview.recipients[0]}` : `${preview.recipients.length} recipients · ${preview.audience}`} · {preview.subject}</p><div className="mb-3 flex gap-2"><button type="button" aria-pressed={previewWidth === "desktop"} onClick={() => setPreviewWidth("desktop")} className={`rounded-lg border px-3 py-2 text-sm ${previewWidth === "desktop" ? "bg-stone-950 text-white" : "bg-white"}`}>Desktop</button><button type="button" aria-pressed={previewWidth === "mobile"} onClick={() => setPreviewWidth("mobile")} className={`rounded-lg border px-3 py-2 text-sm ${previewWidth === "mobile" ? "bg-stone-950 text-white" : "bg-white"}`}>Mobile</button></div><div className="overflow-hidden rounded-xl border bg-stone-100">{renderedPreview?.id === preview.id ? <iframe title="Campaign email design preview" sandbox="" srcDoc={renderedPreview.html} className="mx-auto block h-[65dvh] max-h-[850px] w-full border-0" style={{ maxWidth: previewWidth === "mobile" ? 360 : "100%" }} /> : <p role="status" className="p-6">Loading email preview…</p>}</div><div className="mt-4 rounded-2xl bg-amber-50 p-5"><p className="mt-3 text-sm">{Object.values(preview.batches).reduce((sum, batch) => sum + batch.count, 0)} emails accepted by provider.</p>{preview.status !== "complete" && <button disabled={busy || !configured} onClick={() => run(() => send(preview))} className="mt-4 rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Working…" : preview.audience === "single" ? `Send email to ${preview.recipients[0]}` : `Send campaign to ${preview.recipients.length} contacts`}</button>}<p className="mt-3 text-xs text-stone-500">Keep this page open during sending. If interrupted, resume this saved campaign from history.</p>{preview.status === "complete" && <p className="mt-3 text-sm font-semibold text-emerald-800">Sending complete. Provider acceptance is recorded; check Resend for delivery status.</p>}</div>{notice && <p role="status" className="mt-4 rounded-xl bg-stone-100 p-4 text-sm">{notice}</p>}</dialog>}
    </div>
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">Email & campaign history</h2><div className="mt-4 space-y-3">{campaigns.map((campaign) => <div key={campaign.id} className="rounded-xl border p-4"><p className="font-semibold">{campaign.subject}</p><p className="mt-2 text-sm text-stone-600">{campaign.audience === "single" ? `To: ${campaign.recipients[0]} · ` : ""}{formatMoroccoDateTime(campaign.createdAt)} · {campaign.status} · {Object.values(campaign.batches).reduce((sum, batch) => sum + batch.count, 0)} accepted / {campaign.recipients.length} recipients</p>{campaign.lastError && <p className="mt-2 text-sm text-red-700">{campaign.lastError}</p>}<button disabled={busy} type="button" onClick={() => { setNotice(""); setPreview(campaign) }} className="mt-3 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-stone-100">{campaign.status === "complete" ? (campaign.audience === "single" ? "View email" : "View campaign") : "Review / resume"}</button></div>)}{!campaigns.length && <p className="text-sm text-stone-500">No campaigns yet. Save a preview to get started.</p>}</div></div>
  </section>
}
