"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Clock, MapPin, ArrowRight, Heart } from "lucide-react"
import { type Trip } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { translations, formatPrice } from "@/lib/utils"

export function FeaturedTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const { language, currency, toggleWishlist, isWishlisted } = useApp()
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-stone-900">
            Curated Trips & Tours
          </h2>
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg">
            Handpicked experiences designed by local experts
          </p>
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
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(trip.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      size={20}
                      className={isWishlisted(trip.id) ? "fill-primary text-primary" : "text-stone-400"}
                    />
                  </button>
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {trip.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{trip.description}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {trip.duration} {trip.duration === 1 ? "day" : "days"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {trip.locations.length} locations
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(trip.price, currency)}
                      </span>
                      <span className="text-stone-400 text-sm"> /person</span>
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
          className="text-center mt-12"
        >
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 btn-secondary px-8 py-4 rounded-full font-semibold"
          >
            {t.common.viewAll} Trips
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
