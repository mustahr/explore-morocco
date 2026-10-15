"use client"

import { WishlistButton } from "@/components/trips/WishlistButton"
import { useTranslations } from "@/context/useTranslations"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Clock, MapPin, ArrowRight, Heart } from "lucide-react"
import { type Trip } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { translations, formatPrice } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export function FeaturedTrips() {
  const { tr } = useTranslations()
  const [trips, setTrips] = useState<Trip[]>([])
  const { language, currency, wishlist } = useApp()
  const t = translations[language]

  useEffect(() => {
    let ignore = false

    async function loadTrips() {
      const response = await fetch("/api/trips")
      const data = (await response.json()) as { trips: Trip[] }

      if (!ignore) {
        setTrips(data.trips.slice(0, 6))
      }
    }

    loadTrips()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">{t.common.popular}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-stone-900">{tr("Curated Trips & Tours")}</h2>
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg">{tr("Handpicked experiences designed by local experts")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 card-hover">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={trip.image}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    parallax
                    parallaxOffset={64}
                    parallaxStrength={1.1}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackClassName="h-full w-full"
                  />
                  <WishlistButton tripId={trip.id} title={trip.title} className="absolute end-4 top-4" />
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {tr(trip.category)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    {tr(trip.title)}
                  </h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{tr(trip.description)}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {tr(trip.duration === 1 ? tr("{count} day") : tr("{count} days"), { count: trip.duration })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {trip.locations.length}{tr("locations")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(trip.price, currency)}
                      </span>
                      <span className="text-stone-400 text-sm"> {tr("/person")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={14} className="fill-accent text-accent" />
                      <span className="font-medium text-stone-700">{trip.rating}</span>
                      <span className="text-stone-400">({trip.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 btn-secondary px-8 py-4 rounded-full font-semibold"
          >
            {tr("View all trips")}<ArrowRight size={18} />
          </Link>
          {wishlist.length > 0 && <Link href="/trips#saved-trips" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-200 px-6 py-3 font-semibold text-stone-700 transition hover:border-primary hover:text-primary">
            <Heart size={18} aria-hidden="true" />{tr("View saved trips")}
          </Link>}
        </motion.div>
      </div>
    </section>
  )
}
