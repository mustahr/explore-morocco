"use client"
import { useEffect, useRef, useState } from "react"
import type { CampaignDesign } from "@/lib/email-template"
import type { Campaign, EmailContact } from "@/lib/email-marketing"
import { ClientEmailPicker } from "./ClientEmailPicker"
import { defaultSiteUrl } from "@/lib/site"
import { formatMoroccoDateTime } from "@/lib/record-timestamps"

const mainPages = [
  { path: "/trips", title: "Trips & Tours" },
  { path: "/trip-generator", title: "Trip Planner" },
  { path: "/destinations", title: "All Destinations" },
  { path: "/experiences", title: "All Experiences" },
  { path: "/blog", title: "Travel Blog" },
  { path: "/contact", title: "Contact Us" },
  { path: "/about", title: "About Us" },
  { path: "/", title: "Home" },
]

export function EmailMarketing() {
  const [siteUrl, setSiteUrl] = useState(defaultSiteUrl)
  const [pageGroups, setPageGroups] = useState<Array<{ label: string; pages: Array<{ path: string; title: string }> }>>([])
  const [pagesLoading, setPagesLoading] = useState(true)
  const [pagesError, setPagesError] = useState(false)
  const [contacts, setContacts] = useState<EmailContact[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [design, setDesign] = useState<CampaignDesign>({})
  const [renderedPreview, setRenderedPreview] = useState<{ id: string; html: string } | null>(null)
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop")
  const [audience, setAudience] = useState<"subscribers" | "all" | "selected">("subscribers")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
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
    setContacts(data.contacts); setCampaigns(data.campaigns); setConfigured(data.configured); if (data.siteUrl) setSiteUrl(data.siteUrl)
  }
  useEffect(() => { let active = true; api().then((data) => { if (active) { setContacts(data.contacts); setCampaigns(data.campaigns); setConfigured(data.configured); if (data.siteUrl) setSiteUrl(data.siteUrl) } }).catch((error) => { if (active) setNotice(error.message) }); return () => { active = false } }, [])
  useEffect(() => {
    const controller = new AbortController()
    const catalogs = [
      { endpoint: "/api/trips", key: "trips", label: "Individual trips", prefix: "/trips/", id: "id", title: "title" },
      { endpoint: "/api/destinations", key: "destinations", label: "Individual destinations", prefix: "/destinations/", id: "slug", title: "name" },
      { endpoint: "/api/experiences", key: "experiences", label: "Individual experiences", prefix: "/experiences/", id: "id", title: "title" },
      { endpoint: "/api/blog", key: "posts", label: "Blog posts", prefix: "/blog/", id: "slug", title: "title" },
    ]
    Promise.allSettled(catalogs.map(async (catalog) => {
      const response = await fetch(catalog.endpoint, { signal: controller.signal })
      if (!response.ok) throw new Error("Could not load pages")
      const data = await response.json()
      if (!Array.isArray(data[catalog.key])) throw new Error("Invalid pages")
      return { label: catalog.label, pages: (data[catalog.key] as Array<Record<string, unknown>>).filter((item) => typeof item[catalog.id] === "string" && typeof item[catalog.title] === "string").map((item) => ({ path: `${catalog.prefix}${encodeURIComponent(String(item[catalog.id]))}`, title: String(item[catalog.title]) })) }
    })).then((results) => {
      if (controller.signal.aborted) return
      setPageGroups(results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []))
      setPagesError(results.some((result) => result.status === "rejected"))
      setPagesLoading(false)
    })
    return () => controller.abort()
  }, [])
  async function run(action: () => Promise<void>) {
    setBusy(true); setNotice("")
    try { await action() } catch (error) { setNotice(error instanceof Error ? error.message : "Could not complete this action.") }
    finally { setBusy(false) }
  }
  async function send(campaign: Campaign) {
    setEditingId(null)
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
    setEditingId(null); setAudience("selected"); setSelectedEmails(email ? [email] : []); setClientEmail(""); setPreview(null); setNotice("")
    requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      clientEmailRef.current?.focus({ preventScroll: true })
    })
  }
  function editCampaign(campaign: Campaign) {
    const canEdit = campaign.status === "draft" && !Object.keys(campaign.batches).length && !campaign.lastError
    setEditingId(canEdit ? campaign.id : null)
    setAudience(campaign.audience === "single" ? "selected" : campaign.audience); setSelectedEmails(["single", "selected"].includes(campaign.audience) ? campaign.recipients : []); setClientEmail("")
    setSubject(campaign.subject); setMessage(campaign.message); setDesign(campaign.design || {})
    setPermission(false); setPreview(null)
    setNotice(canEdit ? "Editing the saved draft. Save changes to update it." : "A new draft has been prepared from this email. The original history is unchanged.")
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }
  async function deleteCampaign(campaign: Campaign) {
    if (!window.confirm(`Delete “${campaign.subject}” from history? This does not recall emails already sent or remove contacts.`)) return
    await run(async () => {
      await api({ action: "delete", id: campaign.id })
      setCampaigns((items) => items.filter((item) => item.id !== campaign.id))
      if (preview?.id === campaign.id) setPreview(null)
      if (editingId === campaign.id) setEditingId(null)
      setNotice("History entry deleted. Contacts and previously sent emails are unchanged.")
    })
  }
  const eligible = contacts.filter((contact) => !contact.unsubscribed && (audience === "selected" ? selectedEmails.includes(contact.email) : audience === "all" || contact.subscribed))
  const recipientCount = audience === "selected" ? selectedEmails.length : eligible.length
  const visible = contacts.filter((contact) => `${contact.email} ${contact.name} ${contact.sources.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || (filter === "subscribers" ? contact.subscribed && !contact.unsubscribed : filter === "unsubscribed" ? contact.unsubscribed : contact.sources.includes(filter))))
  return <section className="mt-8 space-y-6">
    {notice && <p role="status" className="rounded-xl bg-stone-100 p-4 text-sm">{notice}</p>}
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Email audience</h2><button type="button" disabled={busy} onClick={() => emailClient()} className="btn-primary rounded-xl px-4 py-3 text-sm font-semibold">Email clients</button></div>
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
      <h2 className="text-2xl font-bold">{audience === "selected" ? "Email selected clients" : "Newsletters & offers"}</h2>
      {editingId && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50 p-4 text-sm"><p>Editing saved draft</p><button type="button" disabled={busy} onClick={() => { setEditingId(null); setSubject(""); setMessage(""); setDesign({}); setPreview(null); setNotice("Draft editing cancelled. Saved history was not changed.") }} className="font-semibold underline">Cancel editing</button></div>}
      {!configured && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Sending needs RESEND_API_KEY in Vercel Production and a verified sender. You can collect contacts and prepare campaigns now.</p>}
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">Audience<select value={audience} onChange={(event) => { setAudience(event.target.value as "subscribers" | "all" | "selected"); setPreview(null) }} className="admin-input"><option value="selected">Selected clients — one or more</option><option value="subscribers">Newsletter subscribers</option><option value="all">All contacts I have permission to email</option></select></label>
        {audience === "selected" && <ClientEmailPicker contacts={contacts} value={clientEmail} selectedEmails={selectedEmails} onToggle={(email) => { setSelectedEmails((current) => current.includes(email) ? current.filter((item) => item !== email) : [...current, email]); setPreview(null) }} inputRef={clientEmailRef} onChange={(value) => { setClientEmail(value); setPreview(null) }} />}
        {audience === "all" && <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={permission} onChange={(event) => setPermission(event.target.checked)} className="mt-1" />I confirm I have permission to send this newsletter or offer to these contacts. Unsubscribed contacts remain excluded.</label>}
        <p className="text-sm text-stone-500">{recipientCount} {audience === "selected" ? "clients selected" : "eligible recipients"}. Emails are sent individually; recipients cannot see other email addresses.</p>
        <label className="grid gap-2 text-sm font-semibold">Subject<input value={subject} maxLength={180} onChange={(event) => { setSubject(event.target.value); setPreview(null) }} className="admin-input" placeholder="Your next Morocco adventure awaits" /></label>
        <label className="grid gap-2 text-sm font-semibold">Message<textarea value={message} maxLength={20000} rows={9} onChange={(event) => { setMessage(event.target.value); setPreview(null) }} className="admin-input" placeholder="Write your newsletter or offer here. Include full website links and the offer conditions." /></label>
        <fieldset className="rounded-2xl border border-stone-200 p-4"><legend className="px-2 text-sm font-semibold">Email design</legend><p className="mb-4 text-xs leading-5 text-stone-500">Your logo and a Morocco photo are included automatically. Customize the image and button below. Instagram and Facebook icons use placeholder links for now.</p><div className="grid gap-4 md:grid-cols-2">{([
          ["imageUrl", "Hero image URL (optional)", "https://…/your-photo.jpg"],
          ["buttonLabel", "Button label", "Explore Morocco"],
        ] as const).map(([key, label, placeholder]) => <label key={key} className="grid min-w-0 gap-2 text-sm font-semibold">{label}<input type={key === "buttonLabel" ? "text" : "url"} value={design[key] || ""} maxLength={key === "buttonLabel" ? 60 : 2000} onChange={(event) => { setDesign((current) => ({ ...current, [key]: event.target.value })); setPreview(null) }} placeholder={placeholder} className="admin-input min-w-0" /></label>)}<label className="grid min-w-0 gap-2 text-sm font-semibold">Button destination<select value={design.buttonUrl || `${siteUrl}/trips`} onChange={(event) => { setDesign((current) => ({ ...current, buttonUrl: event.target.value })); setPreview(null) }} className="admin-input min-w-0"><optgroup label="Main pages">{mainPages.map((page) => <option key={page.path} value={`${siteUrl}${page.path}`}>{page.title}</option>)}</optgroup>{pageGroups.filter((group) => group.pages.length).map((group) => <optgroup key={group.label} label={group.label}>{group.pages.map((page) => <option key={page.path} value={`${siteUrl}${page.path}`}>{page.title}</option>)}</optgroup>)}</select><span className="text-xs font-normal text-stone-500">{pagesLoading ? "Loading individual page options…" : pagesError ? "Some individual pages could not load. Main pages are available; reload to try again." : "Choose the page clients should visit when they click the email button."}</span></label></div></fieldset>
        <div className="flex flex-col gap-3 sm:flex-row"><input type="email" aria-label="Test email recipient" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} className="admin-input min-w-0 flex-1" /><button disabled={busy || !configured || !subject.trim() || !message.trim()} onClick={() => run(async () => { const result = await api({ action: "test", subject, message, email: testEmail, design }); setNotice(result.message) })} className="rounded-xl border px-4 py-3 font-semibold disabled:opacity-50">Send test email</button><button disabled={busy || !subject.trim() || !message.trim() || !recipientCount || (audience === "all" && !permission)} onClick={() => run(async () => { const result = await api({ action: editingId ? "update" : "create", id: editingId, subject, message, audience, emails: selectedEmails, permissionConfirmed: permission, design }); setPreview(result.campaign); await load() })} className="btn-primary rounded-xl px-5 py-3 font-semibold disabled:opacity-50">{editingId ? "Save changes & preview" : "Save & preview"}</button></div>
      </div>
      {preview && <dialog ref={campaignDialog} aria-labelledby="campaign-preview-title" onCancel={(event) => { event.preventDefault(); if (!busy) setPreview(null) }} onClick={(event) => { if (event.target === event.currentTarget && !busy) setPreview(null) }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto overscroll-contain rounded-3xl border border-amber-200 bg-white p-5 text-stone-900 shadow-2xl backdrop:bg-black/60 sm:p-7"><div className="mb-5 flex items-start justify-between gap-4"><h2 id="campaign-preview-title" className="text-2xl font-bold">{["single", "selected"].includes(preview.audience) ? (preview.status === "complete" ? "Email details" : "Review email") : (preview.status === "complete" ? "Campaign details" : "Review campaign")}</h2><button type="button" disabled={busy} onClick={() => setPreview(null)} className="shrink-0 rounded-xl border px-4 py-2 font-semibold disabled:opacity-50">Close</button></div><p className="mb-3 text-xs text-stone-500">{["single", "selected"].includes(preview.audience) ? `To: ${preview.recipients.join(", ")}` : `${preview.recipients.length} recipients · ${preview.audience}`} · {preview.subject}</p><div className="mb-3 flex gap-2"><button type="button" aria-pressed={previewWidth === "desktop"} onClick={() => setPreviewWidth("desktop")} className={`rounded-lg border px-3 py-2 text-sm ${previewWidth === "desktop" ? "bg-stone-950 text-white" : "bg-white"}`}>Desktop</button><button type="button" aria-pressed={previewWidth === "mobile"} onClick={() => setPreviewWidth("mobile")} className={`rounded-lg border px-3 py-2 text-sm ${previewWidth === "mobile" ? "bg-stone-950 text-white" : "bg-white"}`}>Mobile</button></div><div className="overflow-hidden rounded-xl border bg-stone-100">{renderedPreview?.id === preview.id ? <iframe title="Campaign email design preview" sandbox="" srcDoc={renderedPreview.html} className="mx-auto block h-[65dvh] max-h-[850px] w-full border-0" style={{ maxWidth: previewWidth === "mobile" ? 360 : "100%" }} /> : <p role="status" className="p-6">Loading email preview…</p>}</div><div className="mt-4 rounded-2xl bg-amber-50 p-5"><p className="mt-3 text-sm">{Object.values(preview.batches).reduce((sum, batch) => sum + batch.count, 0)} emails accepted by provider.</p>{preview.status !== "complete" && <button disabled={busy || !configured} onClick={() => run(() => send(preview))} className="mt-4 rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Working…" : ["single", "selected"].includes(preview.audience) ? `Send email to ${preview.recipients.length} ${preview.recipients.length === 1 ? "client" : "clients"}` : `Send campaign to ${preview.recipients.length} contacts`}</button>}<p className="mt-3 text-xs text-stone-500">Keep this page open during sending. If interrupted, resume this saved campaign from history.</p>{preview.status === "complete" && <p className="mt-3 text-sm font-semibold text-emerald-800">Sending complete. Provider acceptance is recorded; check Resend for delivery status.</p>}</div>{notice && <p role="status" className="mt-4 rounded-xl bg-stone-100 p-4 text-sm">{notice}</p>}</dialog>}
    </div>
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">Email & campaign history</h2><div className="mt-4 space-y-3">{campaigns.map((campaign) => <div key={campaign.id} className="rounded-xl border p-4"><p className="font-semibold">{campaign.subject}</p><p className="mt-2 text-sm text-stone-600">{["single", "selected"].includes(campaign.audience) ? `To: ${campaign.recipients.join(", ")} · ` : ""}{formatMoroccoDateTime(campaign.createdAt)}{campaign.draftEditedAt ? ` · edited ${formatMoroccoDateTime(campaign.draftEditedAt)}` : ""} · {campaign.status} · {Object.values(campaign.batches).reduce((sum, batch) => sum + batch.count, 0)} accepted / {campaign.recipients.length} recipients</p>{campaign.lastError && <p className="mt-2 text-sm text-red-700">{campaign.lastError}</p>}<button disabled={busy} type="button" onClick={() => { setNotice(""); setPreview(campaign) }} className="mt-3 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-stone-100">{campaign.status === "complete" ? (["single", "selected"].includes(campaign.audience) ? "View email" : "View campaign") : "Review / resume"}</button><button type="button" disabled={busy} onClick={() => editCampaign(campaign)} className="ml-3 mt-3 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-stone-100">{campaign.status === "draft" && !Object.keys(campaign.batches).length && !campaign.lastError ? "Edit" : "Edit as new"}</button><button type="button" disabled={busy} onClick={() => deleteCampaign(campaign)} className="ml-3 mt-3 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50">Delete</button></div>)}{!campaigns.length && <p className="text-sm text-stone-500">No campaigns yet. Save a preview to get started.</p>}</div></div>
  </section>
}
