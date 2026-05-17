"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Compass, Route, Headphones, Landmark, ArrowRight } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          interest: formData.subject,
          message: formData.message,
          source: "Contact page",
        }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error || "Could not send your message.")
      }

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 12000)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not send your message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative overflow-hidden pt-20 lg:pt-24">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/contact-morocco-desk.png"
            alt="Moroccan travel contact desk with map, message phone, lantern, and mint tea"
            fill
            preload
            sizes="100vw"
            quality={80}
            parallaxOffset={84}
            className="object-cover"
            fallbackClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/88 via-stone-950/58 to-stone-950/28" />
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: "linear-gradient(45deg, rgba(212,175,55,.28) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,.16) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid items-center gap-10 lg:grid-cols-[1fr_24rem]"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary-light backdrop-blur-sm">
                <Headphones size={16} /> Morocco travel desk
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Contact Us in Morocco
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/82">
                Tell us where you want to go. Our Marrakech-based team will reply with route ideas, local advice, and next steps within 24 hours.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact-form"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-primary-light"
                >
                  Send a message
                  <ArrowRight size={16} />
                </a>
                <a
                  href="https://wa.me/212XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/24 bg-white/12 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <MessageCircle size={16} />
                  WhatsApp us
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
                {[
                  { icon: Landmark, label: "Marrakech office" },
                  { icon: Route, label: "Custom tour routes" },
                  { icon: Compass, label: "Local trip advice" },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 backdrop-blur-sm">
                    <item.icon size={16} className="text-primary-light" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/18 bg-white/12 p-5 text-white shadow-2xl shadow-stone-950/25 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-white/14 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-stone-950">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <p className="text-sm text-white/64">Quick help</p>
                  <p className="font-semibold">Choose how to reach us</p>
                </div>
              </div>
              <div className="space-y-3 py-5">
                {[
                  { icon: Mail, label: "Email", value: "hello@moroccoai.com" },
                  { icon: Phone, label: "Phone", value: "+212 5XX-XXXXXX" },
                  { icon: MapPin, label: "Office", value: "Marrakech, Morocco" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <item.icon size={18} className="text-primary-light" />
                    <div>
                      <p className="text-xs text-white/58">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-stone-950/42 p-4">
                <p className="text-sm text-white/72">Typical reply time</p>
                <p className="mt-1 text-2xl font-bold">Within 24h</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="contact-form" className="relative -mt-10 py-12 lg:-mt-14 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[#F8F2E7]" />
        <div className="absolute inset-0 -z-10 opacity-55" style={{
          backgroundImage: "linear-gradient(90deg, rgba(15,61,46,.08) 1px, transparent 1px), linear-gradient(0deg, rgba(139,94,52,.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }} />
        <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-stone-950/12 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-950/10 p-6 lg:p-8"
              >
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">Start planning</p>
                  <h2 className="mt-2 text-2xl font-bold text-stone-900">Send us a message</h2>
                  <p className="mt-2 text-sm text-stone-500">Share your dates, destinations, or questions and we will help you shape the next step.</p>
                </div>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                    <p>Thank you! We{"'"}ll get back to you within 24 hours.</p>
                    <Link href="/" className="mt-3 inline-flex text-sm font-semibold text-green-800 underline-offset-4 hover:underline">
                      Back to home
                    </Link>
                  </div>
                )}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-analytics-event="contact_form_submit"
                    data-analytics-label="Contact page"
                    className="w-full btn-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-xl shadow-stone-950/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src="/contact-morocco-desk.png"
                    alt="Moroccan travel contact desk with map, message phone, lantern, and mint tea"
                    fill
                    sizes="(max-width: 1024px) 100vw, 24rem"
                    quality={85}
                    parallaxOffset={34}
                    className="object-cover"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-stone-950/12 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-light">Moroccan contact desk</p>
                    <p className="mt-1 text-sm text-white/86">Message us about routes, riads, desert nights, and private tours.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6"
              >
                <h3 className="font-bold text-stone-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-700">Email</p>
                      <p className="text-stone-500 text-sm">hello@moroccoai.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-700">Phone</p>
                      <p className="text-stone-500 text-sm">+212 5XX-XXXXXX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-700">Address</p>
                      <p className="text-stone-500 text-sm">Marrakech, Morocco</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-700">Working Hours</p>
                      <p className="text-stone-500 text-sm">Mon-Sat: 9AM - 7PM (GMT+1)</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-500 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={24} />
                  <h3 className="font-bold text-lg">WhatsApp</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Chat with us directly on WhatsApp for quick responses. Available 7 days a week.
                </p>
                <a
                  href="https://wa.me/212XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="whatsapp_click"
                  data-analytics-label="Contact page"
                  className="w-full bg-white text-green-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-stone-50 rounded-2xl p-6"
              >
                <h3 className="font-bold text-stone-900 mb-3">Need a Custom Trip?</h3>
                <p className="text-stone-500 text-sm mb-4">
                  Let us create a personalized itinerary just for you.
                </p>
                <a
                  href="/trip-generator"
                  className="w-full btn-primary text-white py-3 rounded-xl font-semibold text-center block"
                >
                  Generate Your Trip
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
