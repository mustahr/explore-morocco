"use client"
import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { BookingWhatsAppCopy } from "./BookingWhatsAppCopy"

type Props = { title: string; tripId?: string; destinationSlug?: string; experienceId?: string; itineraryIndex?: number; children: React.ReactNode; className?: string }
export function BookingRequestButton({ title, tripId, destinationSlug, experienceId, itineraryIndex, children, className }: Props) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [reference, setReference] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", travelers: 2, notes: "" })
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    const element = dialog.current
    element?.showModal()
    document.body.style.overflow = "hidden"
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }) }
  }, [open])
  async function submit(event: FormEvent) {
    event.preventDefault(); setSending(true); setError("")
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId, destinationSlug, experienceId, itineraryIndex, customerName: form.name, customerEmail: form.email, customerPhone: form.phone, startDate: form.date, travelers: form.travelers, notes: form.notes }) })
      const data = await response.json()
      if (!response.ok || !data.booking?.id) throw new Error(data.error || "Could not send your request. Please try again.")
      setReference(data.booking.id)
    } catch (error) { setError(error instanceof Error ? error.message : "Could not send your request.") }
    finally { setSending(false) }
  }
  return <>
    <button type="button" className={className || "btn-primary rounded-xl px-5 py-3 font-semibold"} onClick={() => setOpen(true)}>{children}</button>
    {open && <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); setOpen(false) }} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false) }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-stone-200 bg-white p-5 text-stone-900 shadow-2xl backdrop:bg-black/60 sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><h2 id={titleId} className="text-2xl font-bold">Request a booking</h2><p className="mt-2 text-sm text-stone-600">{title}</p></div><button type="button" aria-label="Close booking form" onClick={() => setOpen(false)} className="rounded-full bg-stone-100 p-3"><X size={20} /></button></div>
      {reference ? <div role="status" className="mt-5 rounded-2xl bg-emerald-50 p-5 text-emerald-900"><p className="font-semibold">Booking request received.</p><p className="mt-2 break-all">Reference: {reference}. Our team will contact you to confirm availability and pricing.</p><BookingWhatsAppCopy reference={reference} title={title} name={form.name} email={form.email} phone={form.phone} date={form.date} travelers={form.travelers} notes={form.notes} /></div> : <form onSubmit={submit} className="mt-5 grid gap-4">
        <label className="grid gap-1 text-sm">Full name<input autoComplete="name" required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" /></label>
        <label className="grid gap-1 text-sm">Email<input type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="admin-input" /></label>
        <label className="grid gap-1 text-sm">Phone / WhatsApp<input type="tel" autoComplete="tel" required maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="admin-input" /></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm">Preferred date<input type="date" required min={new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Casablanca" })} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="admin-input" /></label><label className="grid gap-1 text-sm">Travelers<input type="number" required min={1} max={12} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })} className="admin-input" /></label></div>
        <label className="grid gap-1 text-sm">Notes<textarea maxLength={4000} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="admin-input" /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={sending} className="btn-primary rounded-xl px-5 py-4 font-semibold disabled:opacity-60">{sending ? "Sending request…" : "Send booking request"}</button><p className="text-xs text-stone-500">This is a booking request. Our team will confirm availability and the final price.</p>
      </form>}
    </dialog>}
  </>
}
