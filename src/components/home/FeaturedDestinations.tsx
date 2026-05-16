"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star, ArrowRight } from "lucide-react"
import { type Destination } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

interface FeaturedDestinationsProps {
  destinations: Destination[]
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
  const { language } = useApp()
  const t = translations[language]

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">{t.common.featured}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-stone-900">
            Discover Morocco{"'"}s Best
          </h2>
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg">
            From the blue streets of Chefchaouen to the golden Sahara dunes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {destinations.slice(0, 5).map((dest, index) => (
            <motion.div
              key={dest.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/destinations/${dest.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm card-hover">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      fallbackClassName="h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Star size={14} className="fill-accent text-accent" />
                      <span>{dest.rating}</span>
                      <span className="text-white/60">({dest.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.common.learnMore} <ArrowRight size={14} className="inline ml-1" />
                  </div>
                </div>
              </Link>
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
            href="/destinations"
            className="inline-flex items-center gap-2 btn-primary text-white px-8 py-4 rounded-full font-semibold"
          >
            {t.common.viewAll} Destinations
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
