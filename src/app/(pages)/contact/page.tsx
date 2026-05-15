"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24 gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-3 text-stone-900">
              Contact Us
            </h1>
            <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg">
              Have questions? We{"'"}d love to hear from you. Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 lg:p-8"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-6">Send us a message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                    Thank you! We{"'"}ll get back to you within 24 hours.
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
                    className="w-full btn-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              </motion.div>
            </div>

            <div className="space-y-6">
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
