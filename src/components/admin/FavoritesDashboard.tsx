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
  return <section className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="flex items-center gap-2 text-2xl font-bold"><Heart className="text-primary" />Visitor favorites</h2><p className="mt-2 max-w-2xl text-sm text-stone-500">See what visitors currently save. Each browser counts once per item. Records are anonymous and separate from bookings, messages, and newsletter consent.</p></div><button onClick={() => { setBusy(true); void load() }} disabled={busy} className="admin-btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 disabled:opacity-50"><RefreshCw size={16} className={busy ? "animate-spin" : ""} />{busy ? "Refreshing…" : "Refresh"}</button></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{[{ label: "Active saves", value: data?.total }, { label: "Browsers with favorites", value: data?.visitors }, ...["trip", "destination", "experience"].map((kind) => ({ label: `${kind[0].toUpperCase()}${kind.slice(1)} saves`, value: data?.items.filter((item) => item.kind === kind).reduce((sum, item) => sum + item.count, 0) }))].map((item) => <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-sm text-stone-500">{item.label}</p><p className="mt-2 text-3xl font-bold">{item.value ?? "—"}</p></div>)}</div>
    <div className="rounded-2xl border border-stone-200 bg-white p-5"><div className="mb-5 flex flex-wrap gap-3"><input aria-label="Search favorites" placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input min-w-0 flex-1" /><select aria-label="Favorite type" value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-input w-auto"><option value="all">All types</option><option value="trip">Trips</option><option value="destination">Destinations</option><option value="experience">Experiences</option></select></div>
      {items.length ? <div className="overflow-x-auto"><table className="w-full text-start text-sm"><thead><tr className="border-b text-stone-500"><th className="p-3 text-start">Content</th><th className="p-3 text-start">Type</th><th className="p-3 text-start">Saves</th><th className="p-3 text-start">Last saved · Morocco</th></tr></thead><tbody>{items.map((item) => <tr key={`${item.kind}:${item.id}`} className="border-b border-stone-100 last:border-0"><td className="p-3"><Link href={item.href} className="font-semibold text-primary hover:underline">{item.title}</Link></td><td className="p-3 capitalize">{item.kind}</td><td className="p-3 font-bold">{item.count}</td><td className="whitespace-nowrap p-3">{formatMoroccoDateTime(item.lastSavedAt)}</td></tr>)}</tbody></table></div> : <p className="py-8 text-center text-stone-500">{busy && !data ? "Loading favorites…" : "No favorites match this view yet."}</p>}
    </div>
    <div className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="text-lg font-bold">Recent active saves</h3><p className="mt-1 text-xs text-stone-500">Latest 100 saves · dates and times in Africa/Casablanca. Removing a favorite removes its active record.</p><ul className="mt-4 divide-y divide-stone-100">{data?.recent.map((record) => <li key={record.key} className="flex flex-wrap justify-between gap-3 py-4"><div><Link href={record.href} className="font-semibold text-primary hover:underline">{record.title}</Link><p className="mt-1 text-xs text-stone-500">{record.visitor} · {record.kind}</p></div><time dateTime={record.createdAt} className="text-sm text-stone-500">{formatMoroccoDateTime(record.createdAt)}</time></li>)}</ul></div>
  </section>
}
