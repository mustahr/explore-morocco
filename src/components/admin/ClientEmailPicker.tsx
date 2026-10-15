"use client"
import { useEffect, useId, useRef, useState, type RefObject } from "react"
import { ChevronDown, Check, Search } from "lucide-react"
import type { EmailContact } from "@/lib/email-marketing"

export function ClientEmailPicker({ contacts, value, onChange, inputRef }: {
  contacts: EmailContact[]
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
    onChange(email)
    inputRef.current?.focus({ preventScroll: true })
    setOpen(false); setActive(-1)
  }
  return <div ref={root} className="grid min-w-0 gap-2 text-sm" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <label htmlFor={id} className="font-semibold">Client email</label>
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
            else setOpen(false)
          } else if (event.key === "Escape") { event.preventDefault(); setOpen(false) }
        }} placeholder="Search by name or email, or enter a new address" maxLength={254} className="admin-input min-w-0" style={{ paddingLeft: 44, paddingRight: 48 }} />
        <button type="button" aria-label={open ? "Close client dropdown" : "Show saved clients"} aria-expanded={open} aria-controls={`${id}-options`} onMouseDown={(event) => event.preventDefault()} onClick={() => { const next = !open; inputRef.current?.focus({ preventScroll: true }); setOpen(next); setActive(-1) }} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-stone-600 hover:bg-amber-100"><ChevronDown size={18} className={open ? "rotate-180" : ""} /></button>
      </div>
      {open && <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-xl">
        <div className="border-b border-stone-100 px-4 py-2 text-xs text-stone-500">{matches.length} matching saved {matches.length === 1 ? "client" : "clients"}</div>
        <ul ref={list} id={`${id}-options`} role="listbox" aria-label="Saved clients" className="max-h-64 overflow-y-auto overscroll-contain p-1">
          {matches.map((contact, index) => <li key={contact.id} role="presentation"><button type="button" role="option" id={`${id}-option-${index}`} aria-selected={contact.email.toLowerCase() === query} data-active={highlighted === index} tabIndex={-1} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(contact.email)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors ${highlighted === index ? "bg-amber-100" : "hover:bg-stone-50"}`}><span className="min-w-0"><span className="block truncate font-semibold text-stone-900">{contact.name || contact.email}</span><span className="block break-all text-xs text-stone-500">{contact.email}</span></span>{contact.email.toLowerCase() === query && <Check size={17} aria-hidden="true" className="shrink-0 text-emerald-700" />}</button></li>)}
        </ul>
        {!matches.length && <p className="px-4 pb-4 text-sm text-stone-500">No saved clients match. You can enter a new email address above.</p>}
      </div>}
    </div>
    <p className="text-xs text-stone-500">Search saved clients by name or email, or enter a new address. This email goes only to the selected client.</p>
  </div>
}
