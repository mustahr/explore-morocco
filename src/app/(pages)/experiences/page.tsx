"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Clock, MapPin, ArrowRight, Filter } from "lucide-react"
import { type Experience } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { formatPrice } from "@/lib/utils"

const categories = ["All", "Adventure", "Wellness", "Food & Drink", "Culture"]

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [experiences, setExperiences] = useState<Experience[]>([])
  const { currency } = useApp()

  useEffect(() => {
    let ignore = false

    fetch("/api/experiences")
      .then((response) => response.json() as Promise<{ experiences: Experience[] }>)
      .then((data) => {
        if (!ignore) setExperiences(data.experiences)
      })

    return () => {
      ignore = true
    }
  }, [])

  const filtered = experiences.filter(
    (exp) => selectedCategory === "All" || exp.category === selectedCategory
  )

  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24 gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Activities</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-3 text-stone-900">
              Experiences
            </h1>
            <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg">
              From camel rides to cooking classes, immerse yourself in authentic Moroccan experiences
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Filter size={18} className="text-stone-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/experiences/${exp.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 card-hover"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-700">
                      {exp.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-stone-900 mb-1 group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-stone-500 text-sm mb-3 line-clamp-2">{exp.description}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {exp.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(exp.price, currency)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm">
                          <Star size={14} className="fill-accent text-accent" />
                          <span className="font-medium text-stone-700">{exp.rating}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Details
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-400 text-lg">No experiences found in this category</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Show all experiences
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
