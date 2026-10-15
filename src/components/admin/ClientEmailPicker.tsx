"use client"
import { useEffect, useId, useRef, useState, type RefObject } from "react"
import { ChevronDown, Check, Search, X } from "lucide-react"
import type { EmailContact } from "@/lib/email-marketing"

export function ClientEmailPicker({ contacts, value, onChange, inputRef, selectedEmails, onToggle }: {
  contacts: EmailContact[]
  selectedEmails: string[]
  onToggle: (email: string) => void
  value: string
  onChange: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const eligible = contacts.filter((contact) => !contact.unsubscribed)
  const query = value.trim().toLowerCase()
  const matches = eligible.filter((contact) => !query || `${contact.name} ${contact.email}`.toLowerCase().includes(query))
  const canAdd = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query) && !/[,;]/.test(query) && !selectedEmails.includes(query) && !contacts.some((contact) => contact.email === query && contact.unsubscribed)
  const highlighted = active >= 0 && active < matches.length ? active : -1

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener("pointerdown", outside)
    return () => document.removeEventListener("pointerdown", outside)
  }, [open])
  useEffect(() => {
    if (open && active >= 0) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" })
  }, [active, open])

  function choose(email: string) {
    onToggle(email)
    inputRef.current?.focus({ preventScroll: true })
    setOpen(true)
  }
  return <div ref={root} className="grid min-w-0 gap-2 text-sm" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <label htmlFor={id} className="font-semibold">Client emails</label>
    <div className="relative min-w-0">
      <div className="relative">
        <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-stone-500" />
        <input ref={inputRef} id={id} type="text" inputMode="email" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-options`} aria-activedescendant={open && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined} autoComplete="off" value={value} onFocus={() => { setOpen(true); setActive(-1) }} onChange={(event) => { onChange(event.target.value); setOpen(true); setActive(-1) }} onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true)
            if (matches.length) setActive((previous) => event.key === "ArrowDown" ? (previous + 1) % matches.length : previous <= 0 ? matches.length - 1 : previous - 1)
          } else if (event.key === "Enter" && open) {
            event.preventDefault()
            if (highlighted >= 0) choose(matches[highlighted].email)
            else if (canAdd) { onToggle(query); onChange(""); setActive(-1) }
            else setOpen(false)
          } else if (event.key === "Escape") { event.preventDefault(); setOpen(false) }
        }} placeholder="Search by name or email, or enter a new address" maxLength={254} className="admin-input min-w-0" style={{ paddingLeft: 44, paddingRight: 48 }} />
        <button type="button" aria-label={open ? "Close client dropdown" : "Show saved clients"} aria-expanded={open} aria-controls={`${id}-options`} onMouseDown={(event) => event.preventDefault()} onClick={() => { const next = !open; inputRef.current?.focus({ preventScroll: true }); setOpen(next); setActive(-1) }} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-stone-600 hover:bg-amber-100"><ChevronDown size={18} className={open ? "rotate-180" : ""} /></button>
      </div>
      {open && <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-xl">
        <div className="border-b border-stone-100 px-4 py-2 text-xs text-stone-500">{matches.length} matching saved {matches.length === 1 ? "client" : "clients"}</div>
        <ul ref={list} id={`${id}-options`} role="listbox" aria-label="Saved clients" aria-multiselectable="true" className="max-h-64 overflow-y-auto overscroll-contain p-1">
          {matches.map((contact, index) => <li key={contact.id} role="presentation"><button type="button" role="option" id={`${id}-option-${index}`} aria-selected={selectedEmails.includes(contact.email)} data-active={highlighted === index} tabIndex={-1} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(contact.email)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors ${highlighted === index ? "bg-amber-100" : "hover:bg-stone-50"}`}><span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selectedEmails.includes(contact.email) ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-300 bg-white"}`}>{selectedEmails.includes(contact.email) && <Check size={14} />}</span><span className="min-w-0 flex-1"><span className="block truncate font-semibold text-stone-900">{contact.name || contact.email}</span><span className="block break-all text-xs text-stone-500">{contact.email}</span></span></button></li>)}
        </ul>
        {!matches.length && <p className="px-4 pb-4 text-sm text-stone-500">No saved clients match. Enter a valid email to add a new recipient.</p>}
        {canAdd && <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onToggle(query); onChange(""); inputRef.current?.focus({ preventScroll: true }) }} className="block w-full break-all border-t border-stone-100 px-4 py-3 text-left font-semibold text-emerald-800 hover:bg-emerald-50">Add {query}</button>}
        <div className="flex items-center justify-between border-t border-stone-100 px-4 py-2 text-xs text-stone-500"><span>{selectedEmails.length} selected</span><button type="button" onClick={() => { inputRef.current?.focus({ preventScroll: true }); setOpen(false) }} className="rounded-lg px-3 py-2 font-semibold text-stone-900 hover:bg-stone-100">Done</button></div>
      </div>}
    </div>
    {selectedEmails.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Selected recipients">{selectedEmails.map((email) => <span key={email} className="inline-flex max-w-full items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs"><span className="break-all">{email}</span><button type="button" onClick={() => onToggle(email)} aria-label={`Remove ${email}`} className="shrink-0 rounded-full p-1 hover:bg-amber-200"><X size={14} /></button></span>)}</div>}
    <p className="text-xs text-stone-500">Check one or more clients. Search by name or email, or type a new address and click Add. Each selected client receives a separate copy.</p>
  </div>
}
