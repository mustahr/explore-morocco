"use client"

import { use, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Sparkles, ArrowRight, Clock, MapPin, DollarSign, Users,
  Heart, Share2, Download, ChevronDown, ChevronUp, Check, Plus, Calendar, Mail, Phone, User
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { type TripGeneratorOptions } from "@/lib/content-db"

type TripGeneratorPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")

  return `${year}-${month}-${day}`
}

function includesPhrase(text: string, phrase: string) {
  const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  return new RegExp(`(^|\\W)${escapedPhrase}(\\W|$)`, "i").test(text)
}

function inferTripBasicsFromPrompt(prompt: string) {
  const normalizedPrompt = prompt.toLowerCase()
  const dayMatch = normalizedPrompt.match(/\b(\d{1,2})\s*(?:day|days|d)\b/)
  const travelerMatch = normalizedPrompt.match(/\b(\d{1,2})\s*(?:traveler|travelers|people|persons|guests)\b/)
  const budgetMatch = normalizedPrompt.match(/\b(?:mad|dh|budget|under|around|about)?\s*(\d{3,6})\s*(?:mad|dh)?\b/)

  return {
    days: normalizedPrompt.includes("week") ? 7 : dayMatch ? clampNumber(Number(dayMatch[1]), 1, 14) : undefined,
    travelers: travelerMatch ? clampNumber(Number(travelerMatch[1]), 1, 10) : undefined,
    budget: budgetMatch ? clampNumber(Number(budgetMatch[1]), 1000, 20000) : undefined,
  }
}

function inferPreferencesFromPrompt(prompt: string, options: TripGeneratorOptions) {
  const normalizedPrompt = prompt.toLowerCase()
  const matchedStyle = options.travelStyles.find((item) => {
    const label = item.label.toLowerCase()

    return includesPhrase(normalizedPrompt, item.id.toLowerCase()) || includesPhrase(normalizedPrompt, label)
  })?.id
  const matchedDestinations = options.destinations.filter((destination) => {
    const normalizedDestination = destination.toLowerCase()

    return (
      normalizedPrompt.includes(normalizedDestination) ||
      (normalizedDestination.includes("sahara") && normalizedPrompt.includes("desert")) ||
      (normalizedDestination.includes("atlas") && normalizedPrompt.includes("mountain"))
    )
  })

  return { matchedStyle, matchedDestinations }
}

function buildItineraryDays(days: number, budget: number, selectedLocations: string[]) {
  const coreDays = [
    {
      title: "Arrival & Medina Welcome",
      location: selectedLocations[0] || "Marrakech",
      activities: ["Check into your riad", "Gentle medina orientation walk", "Jemaa el-Fnaa square at sunset", "Traditional Moroccan dinner"],
      accommodation: "Traditional Riad",
    },
    {
      title: "Culture, Souks & Local Flavors",
      location: selectedLocations[0] || "Marrakech",
      activities: ["Guided souk visit", "Bahia Palace or artisan quarter", "Moroccan cooking class", "Tea stop on a rooftop terrace"],
      accommodation: "Traditional Riad",
    },
    {
      title: "Atlas Mountains & Berber Villages",
      location: selectedLocations.find((location) => location.includes("Atlas")) || "Atlas Mountains",
      activities: ["Scenic mountain drive", "Visit Berber villages", "Easy valley walk", "Traditional lunch with a local family"],
      accommodation: "Mountain Guesthouse",
    },
    {
      title: "Kasbah Road to the Desert",
      location: "Ait Ben Haddou",
      activities: ["Cross the Tizi n'Tichka pass", "Explore Ait Ben Haddou kasbah", "Stop in Ouarzazate", "Continue toward the Dades Valley"],
      accommodation: "Kasbah Hotel",
    },
    {
      title: "Sahara Dunes & Desert Camp",
      location: selectedLocations.find((location) => location.includes("Sahara")) || "Sahara Desert",
      activities: ["Drive through Todra Gorge", "Arrive near Erg Chebbi", "Camel trek or 4x4 dune transfer", "Sunset and dinner at desert camp"],
      accommodation: "Desert Camp",
    },
    {
      title: "Desert Sunrise & Scenic Return",
      location: "Dades Valley",
      activities: ["Sunrise over the dunes", "Breakfast at camp", "Visit local desert villages", "Scenic return through palm groves"],
      accommodation: "Kasbah Hotel",
    },
    {
      title: "Final City Moments & Departure",
      location: selectedLocations[0] || "Marrakech",
      activities: ["Relaxed breakfast", "Last souk or garden visit", "Pick up final souvenirs", "Airport transfer or onward travel"],
      accommodation: "N/A",
    },
  ]
  const extraDays = [
    {
      title: "Chefchaouen Blue City Walk",
      location: selectedLocations.find((location) => location.includes("Chefchaouen")) || "Chefchaouen",
      activities: ["Photogenic blue medina walk", "Ras El Maa viewpoint", "Local craft shops", "Sunset from the Spanish Mosque trail"],
      accommodation: "Boutique Riad",
    },
    {
      title: "Fes Heritage Day",
      location: selectedLocations.find((location) => location.includes("Fes")) || "Fes",
      activities: ["Guided Fes el-Bali visit", "Tanneries viewpoint", "Medersa Bou Inania", "Traditional dinner in the old city"],
      accommodation: "Fes Riad",
    },
    {
      title: "Essaouira Coast & Seafood",
      location: selectedLocations.find((location) => location.includes("Essaouira")) || "Essaouira",
      activities: ["Atlantic coastal drive", "Skala ramparts", "Fresh seafood lunch", "Free time in the breezy medina"],
      accommodation: "Coastal Riad",
    },
  ]
  const templates = [...coreDays, ...extraDays]

  return Array.from({ length: days }, (_, index) => {
    const template = templates[index] ?? {
      title: "Flexible Morocco Discovery Day",
      location: selectedLocations[index % selectedLocations.length] || "Morocco",
      activities: ["Private guided exploration", "Local market or village stop", "Time for photos and rest", "Dinner with regional dishes"],
      accommodation: "Handpicked Stay",
    }

    return {
      day: index + 1,
      ...template,
      cost: Math.round(budget / days),
    }
  })
}

export default function TripGeneratorPage({ searchParams }: TripGeneratorPageProps) {
  const resolvedSearchParams = use(searchParams)
  const initialPrompt = (getSingleSearchParam(resolvedSearchParams.prompt)?.trim() ?? "").slice(0, 600)
  const initialBasics = inferTripBasicsFromPrompt(initialPrompt)
  const [options, setOptions] = useState<TripGeneratorOptions>({ travelStyles: [], destinations: [] })
  const [step, setStep] = useState(initialPrompt ? 2 : 1)
  const [budget, setBudget] = useState(initialBasics.budget ?? 5000)
  const [days, setDays] = useState(initialBasics.days ?? 5)
  const [travelers, setTravelers] = useState(initialBasics.travelers ?? 2)
  const [style, setStyle] = useState("")
  const [selectedDests, setSelectedDests] = useState<string[]>([])
  const [prompt, setPrompt] = useState(initialPrompt)
  const [generating, setGenerating] = useState(false)
  const [bookingFormOpen, setBookingFormOpen] = useState(false)
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [bookingPhone, setBookingPhone] = useState("")
  const [bookingStartDate, setBookingStartDate] = useState(() => {
    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return toDateInputValue(startDate)
  })
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [bookingMessage, setBookingMessage] = useState("")
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
        if (ignore) return

        setOptions(data.options)

        if (initialPrompt) {
          const { matchedStyle, matchedDestinations } = inferPreferencesFromPrompt(initialPrompt, data.options)

          if (matchedStyle) setStyle(matchedStyle)
          if (matchedDestinations.length > 0) setSelectedDests(matchedDestinations)
        }
      })

    return () => {
      ignore = true
    }
  }, [initialPrompt])

  const toggleDest = (dest: string) => {
    setSelectedDests((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    )
  }

  const generateItinerary = () => {
    setGenerating(true)
    setTimeout(() => {
      const selectedLocations = selectedDests.length > 0 ? selectedDests : ["Marrakech", "Sahara Desert", "Fes"]
      const requestSummary = prompt.trim()
      const selectedStyleLabel = travelStyles.find((item) => item.id === style)?.label
      const titleStyle = selectedStyleLabel ?? "Personalized"
      setItinerary({
        title: `${days}-Day ${titleStyle} Morocco Adventure`,
        overview: `A carefully crafted ${days}-day journey through Morocco${selectedLocations.length > 0 ? `, visiting ${selectedLocations.join(", ")}` : ""}. This itinerary balances iconic landmarks with hidden gems, giving you an authentic Moroccan experience tailored to your preferences.${requestSummary ? ` Built around your request: "${requestSummary}".` : ""}`,
        days: buildItineraryDays(days, budget, selectedLocations),
        totalCost: budget,
      })
      setGenerating(false)
      setStep(3)
      setBookingFormOpen(false)
      setBookingStatus("idle")
      setBookingMessage("")
    }, 2500)
  }

  const handleGeneratedTripBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!itinerary) return

    setBookingStatus("submitting")
    setBookingMessage("")

    try {
      const bookingSummary = [
        `Generated trip: ${itinerary.title}`,
        `Start date: ${bookingStartDate}`,
        `Travelers: ${travelers}`,
        `Budget per person: ${formatPrice(budget)}`,
        `Route: ${selectedDests.length > 0 ? selectedDests.join(", ") : "Custom route"}`,
        bookingPhone ? `Phone: ${bookingPhone}` : "",
        prompt.trim() ? `Original prompt: ${prompt.trim()}` : "",
      ].filter(Boolean).join("\n")
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: `custom-ai-trip-${Date.now()}`,
          customTripTitle: itinerary.title,
          customerName: bookingName,
          customerEmail: bookingEmail,
          customerPhone: bookingPhone,
          startDate: bookingStartDate,
          travelers,
          totalMAD: budget * travelers,
          notes: bookingSummary,
        }),
      })
      const data = (await response.json()) as { booking?: { id: string }; error?: string }

      if (!response.ok || !data.booking) {
        throw new Error(data.error || "We could not send this booking request.")
      }

      setBookingStatus("success")
      setBookingMessage(`Booking request sent. Reference ${data.booking.id}. Our team will contact you shortly.`)
    } catch (error) {
      setBookingStatus("error")
      setBookingMessage(error instanceof Error ? error.message : "We could not send this booking request.")
    }
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
                      disabled={!style && !prompt.trim()}
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
                      <button
                        type="button"
                        onClick={() => setBookingFormOpen((open) => !open)}
                        className="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                      >
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

                    {bookingFormOpen && (
                      <motion.form
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleGeneratedTripBooking}
                        className="mt-6 rounded-xl border border-stone-100 bg-stone-50 p-5"
                      >
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-stone-900">Request this custom trip</h3>
                          <p className="mt-1 text-sm text-stone-500">Send your generated itinerary to our team so we can confirm availability, pricing, and local details.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><User size={16} /> Name</span>
                            <input
                              required
                              value={bookingName}
                              onChange={(event) => setBookingName(event.target.value)}
                              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              placeholder="Your name"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Mail size={16} /> Email</span>
                            <input
                              required
                              type="email"
                              value={bookingEmail}
                              onChange={(event) => setBookingEmail(event.target.value)}
                              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              placeholder="you@example.com"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Phone size={16} /> Phone</span>
                            <input
                              type="tel"
                              value={bookingPhone}
                              onChange={(event) => setBookingPhone(event.target.value)}
                              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              placeholder="+212 ..."
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Calendar size={16} /> Start date</span>
                            <input
                              required
                              type="date"
                              min={toDateInputValue(new Date())}
                              value={bookingStartDate}
                              onChange={(event) => setBookingStartDate(event.target.value)}
                              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </label>
                        </div>

                        {bookingMessage && (
                          <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${bookingStatus === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            <p>{bookingMessage}</p>
                            {bookingStatus === "success" && (
                              <Link href="/trips" className="mt-3 inline-flex font-semibold text-emerald-800 underline-offset-4 hover:underline">
                                Back to trips
                              </Link>
                            )}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={bookingStatus === "submitting"}
                          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {bookingStatus === "submitting" ? "Sending request..." : "Send Booking Request"}
                          <ArrowRight size={16} />
                        </button>
                      </motion.form>
                    )}
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
