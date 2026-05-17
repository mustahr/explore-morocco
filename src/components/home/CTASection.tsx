"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export function CTASection() {
  const { language } = useApp()
  const t = translations[language]

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920&h=600&fit=crop"
          alt="Sahara desert"
          fill
          sizes="100vw"
          parallax
          parallaxOffset={76}
          className="object-cover"
          fallbackClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/72 to-[#0F3D2E]/76" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Sparkles size={16} className="text-white" />
            <span className="text-white/90 text-sm font-medium">Start Planning Today</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Explore Morocco?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Let our AI create a personalized itinerary just for you. No travel agent needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/trip-generator"
              className="bg-primary px-8 py-4 rounded-full font-semibold text-stone-950 flex items-center gap-2 text-lg hover:bg-primary-light transition-colors"
            >
              {t.hero.ctaGenerate}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white px-8 py-4 rounded-full font-semibold border-2 border-white/30 hover:bg-white/10 transition-colors text-lg"
            >
              Talk to an Expert
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
