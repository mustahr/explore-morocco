"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Heart, RefreshCw } from "lucide-react"
import { formatMoroccoDateTime } from "@/lib/record-timestamps"

type Item = { kind: string; id: string; title: string; href: string; count: number; lastSavedAt: string }
type Data = { total: number; visitors: number; items: Item[]; recent: { key: string; kind: string; title: string; href: string; visitor: string; createdAt: string }[] }
export function FavoritesDashboard() {
  const [data, setData] = useState<Data | null>(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/favorites", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Could not load favorites.")
      setError(""); setData(result)
    } catch (error) { setError(error instanceof Error ? error.message : "Could not load favorites.") }
    finally { setBusy(false) }
  }, [])
  useEffect(() => { const initial = window.setTimeout(() => { void load() }, 0); const timer = window.setInterval(() => { if (document.visibilityState === "visible") void load() }, 30000); return () => { window.clearTimeout(initial); window.clearInterval(timer) } }, [load])
  const items = (data?.items ?? []).filter((item) => (filter === "all" || item.kind === filter) && item.title.toLowerCase().includes(search.toLowerCase()))
  return <section className="mt-6 min-w-0 max-w-full space-y-5 sm:mt-8 sm:space-y-6">
    <div className="grid min-w-0 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6"><div className="min-w-0"><h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl"><Heart className="text-primary" />Visitor favorites</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">See what visitors currently save. Each browser counts once per item. Records are anonymous and separate from bookings, messages, and newsletter consent.</p></div><button onClick={() => { setBusy(true); void load() }} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold transition hover:border-primary hover:bg-amber-50 disabled:opacity-50"><RefreshCw size={16} className={busy ? "animate-spin" : ""} />{busy ? "Refreshing…" : "Refresh"}</button></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 sm:gap-4">{[{ label: "Active saves", value: data?.total }, { label: "Browsers with favorites", value: data?.visitors }, ...["trip", "destination", "experience"].map((kind) => ({ label: `${kind[0].toUpperCase()}${kind.slice(1)} saves`, value: data?.items.filter((item) => item.kind === kind).reduce((sum, item) => sum + item.count, 0) }))].map((item) => <div key={item.label} className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 last:col-span-2 sm:p-5 sm:last:col-span-1"><p className="min-h-10 break-words text-xs leading-5 text-stone-500 sm:text-sm">{item.label}</p><p className="mt-2 text-3xl font-bold">{item.value ?? "—"}</p></div>)}</div>
    <div className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6"><div className="mb-5 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]"><input aria-label="Search favorites" placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input min-w-0 max-w-full" /><select aria-label="Favorite type" value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-input min-w-0 max-w-full"><option value="all">All types</option><option value="trip">Trips</option><option value="destination">Destinations</option><option value="experience">Experiences</option></select></div>
      {items.length ? <>
        <ul className="divide-y divide-stone-100 md:hidden">{items.map((item) => <li key={`${item.kind}:${item.id}`} className="min-w-0 space-y-3 py-4"><div className="flex items-start justify-between gap-3"><Link href={item.href} className="min-w-0 break-words text-sm font-semibold text-primary hover:underline">{item.title}</Link><span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-primary-dark">{item.count}</span></div><div className="flex flex-wrap justify-between gap-2 text-xs text-stone-500"><span className="capitalize">{item.kind}</span><time dateTime={item.lastSavedAt}>{formatMoroccoDateTime(item.lastSavedAt)} · Morocco</time></div></li>)}</ul>
        <div className="hidden min-w-0 md:block"><table className="w-full table-fixed text-start text-sm"><colgroup><col className="w-[40%]" /><col className="w-[18%]" /><col className="w-[12%]" /><col className="w-[30%]" /></colgroup><thead><tr className="border-b text-stone-500"><th className="p-3 text-start">Content</th><th className="p-3 text-start">Type</th><th className="p-3 text-start">Saves</th><th className="p-3 text-start">Last saved · Morocco</th></tr></thead><tbody>{items.map((item) => <tr key={`${item.kind}:${item.id}`} className="border-b border-stone-100 last:border-0"><td className="break-words p-3"><Link href={item.href} className="font-semibold text-primary hover:underline">{item.title}</Link></td><td className="p-3 capitalize">{item.kind}</td><td className="p-3 font-bold">{item.count}</td><td className="break-words p-3 text-xs leading-5">{formatMoroccoDateTime(item.lastSavedAt)}</td></tr>)}</tbody></table></div></> : <p className="py-8 text-center text-stone-500">{busy && !data ? "Loading favorites…" : "No favorites match this view yet."}</p>}
    </div>
    <div className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6"><h3 className="text-lg font-bold">Recent active saves</h3><p className="mt-1 text-xs text-stone-500">Latest 100 saves · dates and times in Africa/Casablanca. Removing a favorite removes its active record.</p><ul className="mt-4 min-w-0 divide-y divide-stone-100">{data?.recent.map((record) => <li key={record.key} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4"><div className="min-w-0 break-words"><Link href={record.href} className="font-semibold text-primary hover:underline">{record.title}</Link><p className="mt-1 text-xs text-stone-500">{record.visitor} · {record.kind}</p></div><time dateTime={record.createdAt} className="text-xs leading-5 text-stone-500 sm:text-sm">{formatMoroccoDateTime(record.createdAt)}</time></li>)}</ul>{data && !data.recent.length && <p className="py-6 text-sm text-stone-500">New saves will appear here.</p>}</div>
  </section>
}
