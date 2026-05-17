"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export function HeroSection() {
  const [prompt, setPrompt] = useState("")
  const { language } = useApp()
  const t = translations[language]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1920&q=80"
          alt="Morocco landscape"
          fill
          preload
          sizes="100vw"
          quality={80}
          parallax
          parallaxOffset={96}
          className="object-cover"
          fallbackClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-32 pb-10">


        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          {t.hero.headline}
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          {t.hero.subheadline}
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.hero.promptPlaceholder}
              className="w-full px-6 py-5 pr-36 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            />
            <Link
              href="/trip-generator"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <Search size={18} />
              <span className="hidden sm:inline">{t.hero.ctaGenerate}</span>
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Link
            href="/trip-generator"
            className="btn-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 text-lg"
          >
            {t.hero.ctaGenerate}
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/trips"
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2 text-lg"
          >
            {t.hero.ctaExplore}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex items-center justify-center gap-8 mt-12 text-white/70"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-sm">Curated Trips</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">50k+</p>
            <p className="text-sm">Happy Travelers</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">4.9</p>
            <p className="text-sm">Average Rating</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
