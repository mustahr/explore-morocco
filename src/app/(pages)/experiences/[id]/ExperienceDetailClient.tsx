"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Shield,
  Star,
  Users,
} from "lucide-react"
import { type Experience } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { formatPrice } from "@/lib/utils"

type ExperienceDetail = {
  overview: string
  highlights: string[]
  includes: string[]
  goodToKnow: string[]
  schedule: { time: string; title: string; description: string }[]
}

const detailByCategory: Record<string, Omit<ExperienceDetail, "overview">> = {
  Adventure: {
    highlights: ["Private or small-group guiding", "Scenic photo stops", "Flexible pace for beginners", "Hotel or meeting-point coordination"],
    includes: ["Local host or instructor", "Safety briefing", "Activity equipment", "Bottled water"],
    goodToKnow: ["Wear comfortable shoes", "Bring sunscreen and a light layer", "Pickup can be arranged on request"],
    schedule: [
      { time: "Start", title: "Meet your guide", description: "Confirm preferences, safety notes, and the best route for the day." },
      { time: "Main activity", title: "Experience Morocco up close", description: "Enjoy the landscape with guided support and relaxed stops." },
      { time: "Finish", title: "Return and recommendations", description: "Wrap up with local tips for food, viewpoints, or your next stop." },
    ],
  },
  Wellness: {
    highlights: ["Authentic Moroccan wellness rituals", "Trusted local spa partners", "Calm spaces away from the crowds", "Optional private upgrades"],
    includes: ["Reserved appointment", "Local coordination", "Tea or refreshment", "Wellness essentials"],
    goodToKnow: ["Arrive 10 minutes early", "Tell us about allergies or sensitivities", "Private transfers can be added"],
    schedule: [
      { time: "Arrival", title: "Warm welcome", description: "Settle in, confirm your preferences, and enjoy traditional hospitality." },
      { time: "Treatment", title: "Moroccan ritual", description: "Relax through the core experience with attentive local care." },
      { time: "Aftercare", title: "Tea and downtime", description: "Ease back into the day with mint tea and simple aftercare guidance." },
    ],
  },
  "Food & Drink": {
    highlights: ["Market-to-table local flavor", "Family recipes and food stories", "Vegetarian-friendly options", "Small groups with plenty of tasting"],
    includes: ["Local food host", "Tastings or ingredients", "Recipe notes", "Tea or soft drink"],
    goodToKnow: ["Come hungry", "Share dietary needs before booking", "Comfortable walking shoes are recommended"],
    schedule: [
      { time: "Meet", title: "Intro to local flavors", description: "Learn what makes Moroccan ingredients and spices so distinctive." },
      { time: "Taste", title: "Cook or explore", description: "Visit favorite stops, prepare dishes, or taste your way through the medina." },
      { time: "Share", title: "Final bites", description: "Finish with tea, stories, and recommendations for the rest of your stay." },
    ],
  },
  Culture: {
    highlights: ["Hands-on learning with local artisans", "Context from a Moroccan host", "Support for community craft traditions", "Great for curious travelers"],
    includes: ["Workshop or guided visit", "Materials where needed", "Local host", "Takeaway notes"],
    goodToKnow: ["Ask before photographing artisans", "Modest dress is appreciated", "Custom private sessions are available"],
    schedule: [
      { time: "Welcome", title: "Meet your host", description: "Get oriented with the neighborhood, craft, or cultural tradition." },
      { time: "Discover", title: "Hands-on experience", description: "Learn techniques, stories, and local customs through guided participation." },
      { time: "Close", title: "Local tips", description: "Leave with practical recommendations and a deeper sense of place." },
    ],
  },
}

function getExperienceDetail(experience: Experience): ExperienceDetail {
  const categoryDetail = detailByCategory[experience.category] ?? detailByCategory.Culture

  return {
    ...categoryDetail,
    overview: `${experience.title} is designed for travelers who want a richer, easier way to experience ${experience.location}. We coordinate the trusted local host, timing, and practical details so you can focus on the moment, whether you are joining as a couple, family, solo traveler, or private group.`,
  }
}

export default function ExperienceDetailClient({
  experience,
  relatedExperiences,
}: {
  experience: Experience
  relatedExperiences: Experience[]
}) {
  const { currency } = useApp()
  const detail = useMemo(() => getExperienceDetail(experience), [experience])
  const [travelers, setTravelers] = useState(2)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    notes: "",
  })

  const total = experience.price * travelers

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", date: "", notes: "" })
    setTravelers(2)
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div className="pt-14 lg:pt-20">
      <section className="relative min-h-[720px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={experience.image} alt={experience.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-950/70 to-primary/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(217,119,6,0.45),transparent_28%),radial-gradient(circle_at_20%_82%,rgba(14,165,233,0.22),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/80 to-transparent" />
          <svg
            className="absolute right-0 top-20 h-96 w-2/3 text-white/15"
            viewBox="0 0 800 420"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M30 300 C 160 120, 270 360, 410 180 S 650 90, 780 260"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="12 16"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link href="/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft size={16} />
            Back to experiences
          </Link>

          <div className="mt-12 grid items-end gap-10 lg:grid-cols-[1fr_24rem]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-lg shadow-stone-950/20">
                  {experience.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md ring-1 ring-white/20">
                  <Star size={15} className="fill-accent text-accent" />
                  {experience.rating} guest rated
                </span>
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-sm">{experience.title}</h1>
              <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">{experience.description}</p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/90">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/15">
                  <MapPin size={16} />
                  {experience.location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/15">
                  <Clock size={16} />
                  {experience.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/15">
                  <Users size={16} />
                  Private or small group
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] border border-white/25 bg-white/15 p-4 shadow-2xl shadow-stone-950/30 backdrop-blur-xl"
            >
              <div className="overflow-hidden rounded-[1.5rem]">
                <img src={experience.image} alt="" className="h-56 w-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">From</p>
                  <p className="mt-1 font-bold text-primary">{formatPrice(experience.price, currency)}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Time</p>
                  <p className="mt-1 font-bold text-stone-900">{experience.duration}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Place</p>
                  <p className="mt-1 font-bold text-stone-900">{experience.location}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-12">
            <main className="space-y-14">
              <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Experience Details</span>
                <h2 className="mt-3 text-3xl font-bold text-stone-900">What to expect</h2>
                <p className="mt-5 text-lg leading-relaxed text-stone-600">{detail.overview}</p>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {detail.highlights.map((highlight) => (
                    <div key={highlight} className="flex gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-4">
                      <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" />
                      <span className="font-medium text-stone-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Simple itinerary</h2>
                <div className="space-y-4">
                  {detail.schedule.map((item) => (
                    <div key={item.time} className="grid gap-4 rounded-2xl border border-stone-100 p-5 sm:grid-cols-[7rem_1fr]">
                      <span className="text-sm font-bold uppercase tracking-wider text-primary">{item.time}</span>
                      <div>
                        <h3 className="font-bold text-stone-900">{item.title}</h3>
                        <p className="mt-1 text-stone-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold text-stone-900 mb-5">Included</h2>
                  <div className="space-y-3">
                    {detail.includes.map((item) => (
                      <p key={item} className="flex items-center gap-3 text-stone-600">
                        <CheckCircle size={18} className="text-riad-green" />
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold text-stone-900 mb-5">Good to know</h2>
                  <div className="space-y-3">
                    {detail.goodToKnow.map((item) => (
                      <p key={item} className="flex items-center gap-3 text-stone-600">
                        <Shield size={18} className="text-secondary" />
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.section>
              </div>

              {relatedExperiences.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <span className="text-primary font-semibold text-sm uppercase tracking-wider">Keep Exploring</span>
                      <h2 className="mt-2 text-2xl font-bold text-stone-900">Related experiences</h2>
                    </div>
                    <Link href="/experiences" className="hidden sm:inline-flex items-center gap-2 font-semibold text-primary">
                      View all
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {relatedExperiences.map((item) => (
                      <Link key={item.id} href={`/experiences/${item.id}`} className="group block overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</p>
                          <h3 className="mt-2 font-bold text-stone-900 group-hover:text-primary">{item.title}</h3>
                          <p className="mt-1 text-sm text-stone-500">{formatPrice(item.price, currency)} - {item.duration}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}
            </main>

            <aside className="lg:sticky lg:top-28 h-fit">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-stone-100 bg-white p-6 shadow-xl shadow-stone-900/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-stone-500">From</p>
                    <p className="text-3xl font-bold text-primary">{formatPrice(experience.price, currency)}</p>
                    <p className="text-sm text-stone-500">per person</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                    <Star size={14} className="fill-accent" />
                    {experience.rating}
                  </span>
                </div>

                {submitted && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
                    Request received. We{"'"}ll confirm availability and details shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="experience-date" className="mb-2 block text-sm font-semibold text-stone-700">Preferred date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="experience-date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                        className="w-full rounded-xl border border-stone-200 py-3 pl-10 pr-4 text-stone-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-700">Travelers</label>
                    <div className="flex items-center justify-between rounded-xl border border-stone-200 p-2">
                      <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200">
                        <Minus size={16} />
                      </button>
                      <span className="inline-flex items-center gap-2 font-bold text-stone-900">
                        <Users size={18} className="text-primary" />
                        {travelers}
                      </span>
                      <button type="button" onClick={() => setTravelers(travelers + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      placeholder="Email address"
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <textarea
                      value={formData.notes}
                      onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                      placeholder="Pickup address, private group, dietary needs..."
                      rows={3}
                      className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-stone-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="font-semibold text-stone-600">Estimated total</span>
                    <span className="text-xl font-bold text-stone-900">{formatPrice(total, currency)}</span>
                  </div>

                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl btn-primary py-4 font-semibold text-white">
                    <Send size={18} />
                    Request Booking
                  </button>
                </form>

                <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-bold text-stone-900">Want a custom version?</h3>
                      <p className="mt-1 text-sm text-stone-500">Tell us your timing, group style, and interests. We{"'"}ll shape it for you.</p>
                      <Link href="/contact" className="mt-3 inline-flex items-center gap-2 font-semibold text-primary">
                        Contact us
                        <Mail size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
