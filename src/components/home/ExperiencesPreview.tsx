"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { type Experience } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { translations, formatPrice } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export function ExperiencesPreview() {
  const { language, currency } = useApp()
  const t = translations[language]
  const [experiences, setExperiences] = useState<Experience[]>([])

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
            Unforgettable Experiences
          </h2>
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg">
            From camel rides to cooking classes, discover what makes Morocco special
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {experiences.slice(0, 8).map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/experiences/${exp.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden aspect-square card-hover">
                  <ImageWithFallback
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    parallax
                    parallaxOffset={64}
                    parallaxStrength={1.1}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wider">{exp.category}</span>
                    <h3 className="text-white font-semibold mt-1 text-sm lg:text-base">{exp.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/80 text-xs">{formatPrice(exp.price, currency)}</span>
                      <span className="flex items-center gap-1 text-white/70 text-xs">
                        <Clock size={12} />
                        {exp.duration}
                      </span>
                    </div>
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
            href="/experiences"
            className="inline-flex items-center gap-2 btn-primary text-white px-8 py-4 rounded-full font-semibold"
          >
            View All Experiences
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
