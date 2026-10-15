"use client"

import Link from "next/link"
import { Heart, ArrowRight } from "lucide-react"
import { type Trip } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { useApp } from "@/context/AppContext"
import { useTranslations } from "@/context/useTranslations"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { WishlistButton } from "./WishlistButton"

export function SavedTrips({ trips, loading }: { trips: Trip[]; loading: boolean }) {
  const { currency, isWishlisted } = useApp()
  const { tr } = useTranslations()
  const savedTrips = trips.filter((trip) => isWishlisted(trip.id))
  return <section id="saved-trips" aria-labelledby="saved-trips-title" className="mt-6 scroll-mt-28 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg">
    <div className="mb-4 flex items-center gap-2">
      <Heart size={20} className="fill-primary text-primary" aria-hidden="true" />
      <h3 id="saved-trips-title" className="text-lg font-bold text-stone-900">{tr("Saved trips")}</h3>
      <span className="ms-auto rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-primary-dark">{savedTrips.length}</span>
    </div>
    {loading ? <p role="status" className="text-sm text-stone-500">{tr("Loading trips...")}</p> : savedTrips.length > 0 ? <ul className="divide-y divide-stone-100">
      {savedTrips.map((trip) => <li key={trip.id} className="flex items-center gap-2 py-3 first:pt-0">
        <Link href={`/trips/${trip.id}`} className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-primary">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
            <ImageWithFallback src={trip.image} alt="" fill sizes="64px" parallax={false} className="object-cover transition-transform motion-safe:group-hover:scale-105" />
          </div>
          <div className="min-w-0">
            <h4 className="line-clamp-2 text-sm font-semibold text-stone-900 group-hover:text-primary">{tr(trip.title)}</h4>
            <p className="mt-1 text-xs text-stone-500">{tr("{count} days", { count: trip.duration })}</p>
            <p className="mt-1 text-sm font-bold text-primary">{formatPrice(trip.price, currency)}</p>
          </div>
          <ArrowRight size={14} aria-hidden="true" className="ms-auto shrink-0 text-stone-400 rtl:rotate-180" />
        </Link>
        <WishlistButton tripId={trip.id} title={trip.title} className="h-10 w-10 shadow-none" />
      </li>)}
    </ul> : <p className="text-sm leading-relaxed text-stone-500">{tr("Tap the heart on a trip to save it here.")}</p>}
    <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">{tr("Saved on this browser. No account needed.")}</p>
  </section>
}
