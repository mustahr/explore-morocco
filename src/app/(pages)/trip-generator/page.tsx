"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, ArrowRight, Clock, MapPin, DollarSign, Users,
  Heart, Share2, Download, ChevronDown, ChevronUp, Check, Plus, X
} from "lucide-react"
import { useApp } from "@/context/AppContext"
import { formatPrice } from "@/lib/utils"
import { type TripGeneratorOptions } from "@/lib/content-db"

export default function TripGeneratorPage() {
  const [options, setOptions] = useState<TripGeneratorOptions>({ travelStyles: [], destinations: [] })
  const [step, setStep] = useState(1)
  const [budget, setBudget] = useState(5000)
  const [days, setDays] = useState(5)
  const [travelers, setTravelers] = useState(2)
  const [style, setStyle] = useState("")
  const [selectedDests, setSelectedDests] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [itinerary, setItinerary] = useState<null | {
    title: string
    overview: string
    days: { day: number; title: string; location: string; activities: string[]; accommodation: string; cost: number }[]
    totalCost: number
  }>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(0)
  const travelStyles = options.travelStyles
  const destinations = options.destinations

  useEffect(() => {
    let ignore = false

    fetch("/api/trip-generator-options")
      .then((response) => response.json() as Promise<{ options: TripGeneratorOptions }>)
      .then((data) => {
        if (!ignore) setOptions(data.options)
      })

    return () => {
      ignore = true
    }
  }, [])

  const toggleDest = (dest: string) => {
    setSelectedDests((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    )
  }

  const generateItinerary = () => {
    setGenerating(true)
    setTimeout(() => {
      const selectedLocations = selectedDests.length > 0 ? selectedDests : ["Marrakech", "Sahara Desert", "Fes"]
      setItinerary({
        title: `${days}-Day ${style ? style.charAt(0).toUpperCase() + style.slice(1) : "Custom"} Morocco Adventure`,
        overview: `A carefully crafted ${days}-day journey through Morocco${selectedLocations.length > 0 ? `, visiting ${selectedLocations.join(", ")}` : ""}. This ${style} itinerary balances iconic landmarks with hidden gems, giving you an authentic Moroccan experience tailored to your preferences.`,
        days: [
          {
            day: 1,
            title: "Arrival & Medina Exploration",
            location: selectedLocations[0] || "Marrakech",
            activities: ["Check into your riad", "Guided medina walking tour", "Jemaa el-Fnaa square at sunset", "Traditional Moroccan dinner"],
            accommodation: "Traditional Riad",
            cost: Math.round(budget * 0.15),
          },
          {
            day: 2,
            title: "Cultural Immersion Day",
            location: selectedLocations[0] || "Marrakech",
            activities: ["Bahia Palace visit", "Majorelle Garden", "Cooking class - learn to make tagine", "Hammam spa experience", "Souk shopping with local guide"],
            accommodation: "Traditional Riad",
            cost: Math.round(budget * 0.2),
          },
          {
            day: 3,
            title: "Atlas Mountains Day Trip",
            location: "Atlas Mountains",
            activities: ["Scenic drive through Tizi n'Tichka pass", "Visit Berber villages", "Hiking in the Ourika Valley", "Traditional lunch with local family", "Waterfall visit"],
            accommodation: "Traditional Riad",
            cost: Math.round(budget * 0.18),
          },
          {
            day: 4,
            title: "Desert Journey Begins",
            location: selectedLocations[1] || "Sahara Desert",
            activities: ["Drive through Dades Valley", "Todra Gorge exploration", "Arrive at Merzouga", "Camel trek to desert camp", "Sunset over Erg Chebbi dunes"],
            accommodation: "Luxury Desert Camp",
            cost: Math.round(budget * 0.22),
          },
          {
            day: 5,
            title: "Desert Sunrise & Departure",
            location: selectedLocations[1] || "Sahara Desert",
            activities: ["Sunrise over the Sahara", "Breakfast at camp", "Return journey", "Visit Ait Ben Haddou kasbah", "Departure"],
            accommodation: "N/A",
            cost: Math.round(budget * 0.15),
          },
        ].slice(0, days),
        totalCost: budget,
      })
      setGenerating(false)
      setStep(3)
    }, 2500)
  }

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <section className="py-16 lg:py-24 gradient-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-primary font-medium text-sm">AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900">
              Trip Generator
            </h1>
            <p className="text-stone-500 mt-4 text-lg">
              Tell us your preferences, and our AI will create your perfect Morocco itinerary
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">What{"'"}s your budget?</h2>
                    <p className="text-stone-500 mb-6">Per person, including accommodation, activities, and transport</p>
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-primary">{formatPrice(budget)}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value))}
                      className="w-full accent-primary mb-4"
                    />
                    <div className="flex justify-between text-sm text-stone-400">
                      <span>1,000 MAD</span>
                      <span>20,000 MAD</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">How many days?</h2>
                    <p className="text-stone-500 mb-6">Total trip duration</p>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setDays(Math.max(1, days - 1))}
                        className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-5xl font-bold text-primary">{days}</span>
                      <button
                        onClick={() => setDays(Math.min(14, days + 1))}
                        className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-center text-stone-400 mt-2">days</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">How many travelers?</h2>
                    <p className="text-stone-500 mb-6">Including yourself</p>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-5xl font-bold text-primary">{travelers}</span>
                      <button
                        onClick={() => setTravelers(Math.min(10, travelers + 1))}
                        className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-center text-stone-400 mt-2">travelers</p>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full btn-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-lg"
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">Travel style</h2>
                    <p className="text-stone-500 mb-6">What kind of experience are you looking for?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {travelStyles.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            style === s.id
                              ? "border-primary bg-primary/5"
                              : "border-stone-100 hover:border-stone-200"
                          }`}
                        >
                          <span className="text-2xl">{s.icon}</span>
                          <h3 className={`font-bold mt-2 ${style === s.id ? "text-primary" : "text-stone-900"}`}>
                            {s.label}
                          </h3>
                          <p className="text-sm text-stone-500">{s.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">Where do you want to go?</h2>
                    <p className="text-stone-500 mb-6">Select one or more destinations (optional)</p>
                    <div className="flex flex-wrap gap-2">
                      {destinations.map((dest) => (
                        <button
                          key={dest}
                          onClick={() => toggleDest(dest)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                            selectedDests.includes(dest)
                              ? "bg-primary text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {selectedDests.includes(dest) && <Check size={14} />}
                          {dest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">Anything else?</h2>
                    <p className="text-stone-500 mb-6">Describe your dream trip in your own words</p>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="I want to see the desert, try authentic Moroccan food, and stay in beautiful riads..."
                      className="w-full h-32 px-4 py-3 border border-stone-200 rounded-xl text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-4 rounded-xl font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={generateItinerary}
                      disabled={!style}
                      className="flex-[2] btn-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Generate My Trip
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && itinerary && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-primary to-accent p-6 lg:p-8 text-white">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">{itinerary.title}</h2>
                    <p className="text-white/80">{itinerary.overview}</p>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock size={18} className="text-primary" />
                        <span>{days} days</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <Users size={18} className="text-primary" />
                        <span>{travelers} travelers</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <DollarSign size={18} className="text-primary" />
                        <span>{formatPrice(budget)} /person</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <MapPin size={18} className="text-primary" />
                        <span>{selectedDests.length > 0 ? selectedDests.join(", ") : "Custom route"}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {itinerary.days.map((day, index) => (
                        <div
                          key={day.day}
                          className="border border-stone-100 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left"
                          >
                            <div className="flex items-center gap-4">
                              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                {day.day}
                              </span>
                              <div>
                                <h3 className="font-bold text-stone-900">{day.title}</h3>
                                <p className="text-sm text-stone-400 flex items-center gap-1">
                                  <MapPin size={12} />
                                  {day.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-primary font-bold">{formatPrice(day.cost)}</span>
                              {expandedDay === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </button>
                          {expandedDay === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              className="px-4 pb-4 pl-[4.5rem]"
                            >
                              <ul className="space-y-2 mb-4">
                                {day.activities.map((activity, i) => (
                                  <li key={i} className="flex items-start gap-2 text-stone-600">
                                    <Check size={16} className="text-riad-green flex-shrink-0 mt-0.5" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm text-stone-500">
                                <span className="font-medium">Accommodation:</span> {day.accommodation}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-stone-50 rounded-xl p-6 mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-stone-900">Estimated Total Cost</h3>
                        <span className="text-2xl font-bold text-primary">{formatPrice(itinerary.totalCost)}</span>
                      </div>
                      <p className="text-sm text-stone-500">
                        Per person. Includes accommodation, activities, transport, and some meals.
                        Prices may vary based on season and availability.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button className="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
                        Book This Trip
                        <ArrowRight size={18} />
                      </button>
                      <button className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-primary hover:text-primary font-medium text-sm transition-colors flex items-center gap-2">
                        <Heart size={16} />
                        Save
                      </button>
                      <button className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-primary hover:text-primary font-medium text-sm transition-colors flex items-center gap-2">
                        <Share2 size={16} />
                        Share
                      </button>
                      <button className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-primary hover:text-primary font-medium text-sm transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { setStep(2); setItinerary(null) }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Edit Preferences
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
