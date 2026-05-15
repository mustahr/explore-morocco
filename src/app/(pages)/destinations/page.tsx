"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, ArrowRight, MapPin, Calendar } from "lucide-react"
import { type Destination } from "@/lib/data"

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    let ignore = false

    fetch("/api/destinations")
      .then((response) => response.json() as Promise<{ destinations: Destination[] }>)
      .then((data) => {
        if (!ignore) setDestinations(data.destinations)
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="pt-16 lg:pt-14">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=2000&q=80"
            alt="Moroccan desert and kasbah landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-primary/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(217,119,6,0.45),transparent_26%),radial-gradient(circle_at_18%_82%,rgba(14,165,233,0.22),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_28rem] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200 ring-1 ring-white/15 backdrop-blur-md">
                Explore Morocco
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold text-white">
                Destinations
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
                From ancient medinas to vast desert landscapes, discover the many faces of Morocco.
              </p>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur-md">
                  <p className="text-2xl font-bold">{destinations.length}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/65">Places</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur-md">
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/65">Avg rating</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur-md">
                  <p className="text-2xl font-bold">5</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/65">Regions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden grid-cols-2 gap-3 lg:grid"
            >
              {destinations.slice(0, 4).map((destination, index) => (
                <Link
                  key={destination.slug}
                  href={`/destinations/${destination.slug}`}
                  className={`group relative overflow-hidden rounded-3xl ring-1 ring-white/15 ${
                    index === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"
                  }`}
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-bold text-white">{destination.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/75">
                      <Star size={13} className="fill-accent text-accent" />
                      {destination.rating}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">Destination</span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-2 mb-4">
                    {dest.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1 text-stone-600">
                      <Star size={16} className="fill-accent text-accent" />
                      <span className="font-semibold">{dest.rating}</span>
                      <span className="text-stone-400">({dest.reviews.toLocaleString()} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1 text-stone-400">
                      <Calendar size={16} />
                      {dest.bestTime}
                    </span>
                  </div>
                  <p className="text-stone-600 text-lg leading-relaxed mb-6">{dest.description}</p>

                  <div className="mb-6">
                    <h3 className="font-semibold text-stone-900 mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {dest.highlights.slice(0, 5).map((h) => (
                        <span
                          key={h}
                          className="flex items-center gap-1 bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full text-sm"
                        >
                          <MapPin size={12} />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-stone-900 mb-3">Suggested Itineraries</h3>
                    <div className="space-y-2">
                      {dest.itineraries.map((it) => (
                        <div key={it.title} className="flex items-center justify-between py-2 border-b border-stone-100">
                          <span className="text-stone-600">{it.days}-day {it.title}</span>
                          <span className="text-primary font-semibold">from {it.price.toLocaleString()} MAD</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-full font-semibold"
                  >
                    Explore {dest.name}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
