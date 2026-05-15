"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, Heart, Lightbulb, ArrowRight, Shield, Compass, TentTree, Route, Plane, Luggage } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="pt-10">
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1675782357250-8329a7677819"
            alt="Morocco riad"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Born in Morocco,<br />Built for the World
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              We{"'"}re a team of Moroccan travel experts and tech innovators on a mission to share the magic of our homeland with the world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-white" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(194,65,12,0.08),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(14,165,233,0.07),transparent_26%),radial-gradient(circle_at_76%_82%,rgba(5,150,105,0.07),transparent_28%)]" />
          <div className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full border border-primary/10" />
          <div className="absolute right-[-5rem] bottom-40 h-80 w-80 rounded-full border border-secondary/10" />
          <svg
            className="absolute left-0 top-24 h-[30rem] w-full text-primary/10"
            viewBox="0 0 1200 480"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-60 350 C 160 220, 260 420, 440 260 S 760 110, 900 250 S 1100 400, 1260 180"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="14 18"
            />
          </svg>
          <MapPin className="absolute left-[8%] top-20 h-12 w-12 text-primary/10" />
          <Compass className="absolute right-[12%] top-28 h-16 w-16 text-secondary/10" />
          <TentTree className="absolute left-[12%] bottom-32 h-20 w-20 text-sahara-gold/10" />
          <Route className="absolute right-[18%] bottom-28 h-14 w-14 text-riad-green/10" />
          <Plane className="absolute left-[44%] top-1/2 hidden h-12 w-12 -translate-y-1/2 rotate-12 text-stone-900/5 lg:block" />
          <Luggage className="absolute right-[6%] top-[48%] hidden h-14 w-14 text-primary/10 md:block" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-3 mb-6">
                From Local Guides to Global Platform
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                MoroccoAI started as a simple idea: what if travelers could plan their perfect Morocco trip with the
                guidance of local experts, powered by the efficiency of AI?
              </p>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                Founded in Marrakech by a team of travel enthusiasts, software engineers, and hospitality professionals,
                we combine deep local knowledge with cutting-edge technology to create travel experiences that are both
                authentic and seamless.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Every itinerary we generate is informed by years of experience hosting thousands of travelers across
                Morocco. We know the hidden riads, the best times to visit the Sahara, and the secret spots in
                Chefchaouen that most tourists never find.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&h=600&fit=crop"
                  alt="Marrakech"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-3">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: MapPin, title: "Local Expertise", description: "Born and raised in Morocco, we know every corner of this beautiful country." },
              { icon: Lightbulb, title: "AI-Powered Planning", description: "Our AI creates personalized itineraries based on your preferences and budget." },
              { icon: Heart, title: "Authentic Experiences", description: "We connect you with real local guides, artisans, and families." },
              { icon: Shield, title: "Trusted & Secure", description: "24/7 support, verified partners, and transparent pricing." },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-500">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-b border-stone-200 mb-20">
            {[
              { number: "50K+", label: "Happy Travelers" },
              { number: "500+", label: "Curated Trips" },
              { number: "50+", label: "Local Partners" },
              { number: "4.9", label: "Average Rating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-stone-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1535191198992-fe460a2d0af1"
                  alt="Sahara Desert"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mt-3 mb-6">
                Making Morocco Accessible to Everyone
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                We believe that traveling to Morocco should be easy, authentic, and transformative. That{"'"}s why we{"'"}ve
                built a platform that combines the warmth of Moroccan hospitality with the convenience of modern technology.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Whether you{"'"}re a first-time visitor or a seasoned traveler, we{"'"}ll help you discover the Morocco
                that guidebooks miss - the hidden courtyards, the family-run restaurants, the sunrise viewpoints known
                only to locals.
              </p>
              <Link
                href="/trip-generator"
                className="btn-primary text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2"
              >
                Start Planning
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
