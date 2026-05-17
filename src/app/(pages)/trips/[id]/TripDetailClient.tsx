"use client"

import { useMemo, useState, useEffect, useRef, type FormEvent } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Star,
  Clock,
  MapPin,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Globe,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react"
import { type Trip } from "@/lib/data"
import { type TripDetailContent } from "@/lib/content-db"
import { useApp } from "@/context/AppContext"
import { formatPrice } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (dateValue: string) =>
  new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const formatDateParts = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`)
  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    month: date.toLocaleDateString("en-US", { month: "short" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  }
}

export default function TripDetailClient({
  trip,
  relatedTrips,
  detailContent,
}: {
  trip: Trip
  relatedTrips: Trip[]
  detailContent: TripDetailContent
}) {
  const faqItems = detailContent.faqs
  const reviewCards = detailContent.reviews
  const [selectedImage, setSelectedImage] = useState(0)
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [travelers, setTravelers] = useState(2)
  const [travelersDropdownOpen, setTravelersDropdownOpen] = useState(false)
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [bookingError, setBookingError] = useState("")
  const [bookingReference, setBookingReference] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dateDropdownRef = useRef<HTMLDivElement>(null)

  const [selectedStartDate, setSelectedStartDate] = useState(() => {
    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return toDateInputValue(startDate)
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTravelersDropdownOpen(false)
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const { currency } = useApp()

  const heroTitle = trip.id === "desert-3day" ? "3-Day Sahara Desert Experience from Marrakech" : trip.title
  const originalPrice = Math.round(trip.price * 1.15)
  const savings = originalPrice - trip.price
  const totalPrice = trip.price * travelers
  const galleryImages = [trip.image, ...trip.images]
  const whatsappMessage = encodeURIComponent(`Hi, I want to reserve ${trip.title}. Can you help me?`)

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBookingStatus("submitting")
    setBookingError("")

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip.id,
          customerName,
          customerEmail,
          customerPhone,
          startDate: selectedStartDate,
          travelers,
          notes: bookingNotes,
        }),
      })

      const data = (await response.json()) as { booking?: { id: string }; error?: string }

      if (!response.ok || !data.booking) {
        throw new Error(data.error || "We could not create this booking request.")
      }

      setBookingReference(data.booking.id)
      setBookingStatus("success")
    } catch (error) {
      setBookingStatus("error")
      setBookingError(error instanceof Error ? error.message : "We could not create this booking request.")
    }
  }

  const itinerary = useMemo(
    () =>
      trip.itinerary.map((item, index) => ({
        ...item,
        image: trip.images[index % trip.images.length],
        highlights: [
          index === 0 ? "Atlas Mountains crossing" : "",
          index === 1 ? "Camel trek at sunset" : "",
          index === 2 ? "Sunrise dune views" : "",
        ].filter(Boolean),
        meals:
          index === 0
            ? "Breakfast, Lunch"
            : index === 1
            ? "Breakfast, Lunch, Dinner"
            : "Breakfast, Lunch",
        accommodation:
          index === 0
            ? "Luxury riad with courtyard"
            : index === 1
            ? "Premium desert camp"
            : "Boutique hotel in Marrakech",
        transport: index === 0 ? "Private 4x4" : index === 1 ? "Camel + 4x4" : "Private transfer",
        drive: index === 0 ? "6h" : index === 1 ? "3h" : "7h",
      })),
    [trip]
  )

  const quickInfo = [
    { label: "Duration", value: `${trip.duration} days · ${trip.duration - 1} nights` },
    { label: "Pickup", value: "Marrakech riad or hotel" },
    { label: "Meals", value: "Breakfast, lunch, dinner" },
    { label: "Transport", value: "Luxury 4x4 + camel trek" },
    { label: "Difficulty", value: "Easy to moderate" },
    { label: "Languages", value: "English, French, Arabic" },
    { label: "Cancellation", value: "Free 48h notice" },
  ]

  const stops = ["Marrakech", "Ait Ben Haddou", "Todra Gorge", "Merzouga", "Marrakech"]

  const minimumStartDate = toDateInputValue(new Date())
  const selectedEndDate = useMemo(() => {
    const endDate = new Date(`${selectedStartDate}T00:00:00`)
    endDate.setDate(endDate.getDate() + trip.duration - 1)
    return toDateInputValue(endDate)
  }, [selectedStartDate, trip.duration])
  const selectedTripDatesDisplay = `${formatDateForDisplay(selectedStartDate)} - ${formatDateForDisplay(selectedEndDate)}`
  const selectedStartDateParts = formatDateParts(selectedStartDate)
  const startDateOptions = useMemo(
    () =>
      [7, 10, 14, 21, 28, 35].map((daysFromToday, index) => {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + daysFromToday)
        const start = toDateInputValue(startDate)
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + trip.duration - 1)
        const end = toDateInputValue(endDate)

        return {
          start,
          end,
          label: index === 0 ? "Soonest" : index === 2 ? "Popular" : index === 4 ? "Best value" : "Flexible",
          ...formatDateParts(start),
        }
      }),
    [trip.duration]
  )

  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-20">
        <Link href="/trips" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={18} />
          Back to Trips
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] mb-12">
          <section>
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-600 font-semibold">Premium Moroccan Escape</p>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
                {heroTitle}
              </h1>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 text-stone-700">
                  <Star size={18} className="text-amber-500" /> {trip.rating} · {trip.reviews} reviews
                </span>
                <span className="flex items-center gap-2 text-stone-700">
                  <MapPin size={18} className="text-amber-500" /> {trip.locations[0]}
                </span>
                <span className="flex items-center gap-2 text-stone-700">
                  <Clock size={18} className="text-amber-500" /> {trip.duration} days
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Best Seller', 'Small Group', 'Free Cancellation', 'Verified Guides'].map((badge) => (
                  <span key={badge} className="rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs uppercase tracking-wider text-amber-900 font-semibold">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:gap-6">
              <div className="relative rounded-3xl overflow-hidden bg-stone-900 shadow-lg h-[400px] sm:h-[500px] lg:h-[600px]">
                <ImageWithFallback
                  src={galleryImages[selectedImage]}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  preload
                  className="object-cover"
                  fallbackClassName="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-2xl h-28 sm:h-32 lg:h-40 transition-all border-2 cursor-pointer ${
                      selectedImage === index
                        ? 'border-primary shadow-lg'
                        : 'border-stone-200 hover:border-primary/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover"
                      fallbackClassName="h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 to-transparent group-hover:from-stone-950/50 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside id="booking">
            <div className="lg:sticky lg:top-28 rounded-3xl border border-stone-200/80 bg-white/95 backdrop-blur-xl shadow-2xl p-6 lg:p-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-stone-900">{formatPrice(trip.price, currency)}</span>
                  <span className="text-stone-400">/person</span>
                </div>
                <p className="mt-2 text-sm text-stone-500">Early booking savings applied · Save {formatPrice(savings, currency)}</p>
              </div>

              <form className="grid gap-4" onSubmit={handleBookingSubmit}>
                <div className="space-y-2">
                  <label htmlFor="trip-start-date" className="text-sm font-semibold text-stone-700">Starting date</label>
                  <div className="relative" ref={dateDropdownRef}>
                    <button
                      id="trip-start-date"
                      type="button"
                      onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      className="w-full rounded-3xl border border-stone-200 bg-white p-3 text-left shadow-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#C9A46A] to-[#0F3D2E] text-white shadow-md shadow-amber-700/20">
                            <span className="text-xs font-semibold uppercase leading-none">{selectedStartDateParts.month}</span>
                            <span className="text-xl font-bold leading-none">{selectedStartDateParts.day}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-stone-900">{selectedStartDateParts.weekday}, {formatDateForDisplay(selectedStartDate)}</span>
                            <p className="mt-1 truncate text-xs text-stone-500">{trip.duration} day trip · Ends {formatDateForDisplay(selectedEndDate)}</p>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`flex-shrink-0 text-stone-400 transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {dateDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-3xl border border-amber-200/80 bg-[#fffaf0] shadow-2xl shadow-stone-950/15"
                      >
                        <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 via-white to-emerald-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Choose departure</p>
                          <p className="mt-1 text-xs text-stone-500">Pick a sample date or choose any date below.</p>
                        </div>

                        <div className="max-h-80 overflow-y-auto p-2">
                          {startDateOptions.map((option) => {
                            const isSelected = selectedStartDate === option.start

                            return (
                              <button
                                key={option.start}
                                type="button"
                                onClick={() => {
                                  setSelectedStartDate(option.start)
                                  setDateDropdownOpen(false)
                                }}
                                className={`w-full rounded-2xl px-3 py-3 text-left transition-colors ${
                                  isSelected ? 'bg-amber-100 text-stone-950 shadow-inner' : 'text-stone-700 hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl border ${
                                    isSelected ? 'border-amber-300 bg-white text-primary-dark' : 'border-stone-200 bg-stone-50 text-stone-700'
                                  }`}>
                                    <span className="text-[10px] font-semibold uppercase leading-none">{option.month}</span>
                                    <span className="text-lg font-bold leading-none">{option.day}</span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold">{option.weekday}, {formatDateForDisplay(option.start)}</span>
                                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">{option.label}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500">Ends {formatDateForDisplay(option.end)} · {trip.duration - 1} nights</p>
                                  </div>
                                  <div className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border ${
                                    isSelected ? 'border-primary bg-primary text-stone-950' : 'border-stone-300 bg-white'
                                  }`}>
                                    {isSelected && <Check size={12} />}
                                  </div>
                                </div>
                              </button>
                            )
                          })}

                          <div className="mt-2 border-t border-stone-100 px-2 pb-2 pt-4">
                            <label htmlFor="custom-start-date" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Choose any date</label>
                            <input
                              id="custom-start-date"
                              type="date"
                              min={minimumStartDate}
                              value={selectedStartDate}
                              onChange={(event) => {
                                const startDate = event.target.value
                                if (!startDate) return
                                setSelectedStartDate(startDate)
                              }}
                              className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <p className="mt-2 text-xs text-stone-500">Selected travel period: {selectedTripDatesDisplay}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="travelers" className="text-sm font-semibold text-stone-700">Travelers</label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setTravelersDropdownOpen(!travelersDropdownOpen)}
                      className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-left text-sm text-stone-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <Users size={14} className="text-white" />
                          </div>
                          <span className="font-medium">
                            {travelers} traveler{travelers > 1 ? 's' : ''}
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-stone-400 transition-transform ${travelersDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {travelersDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fffaf0] shadow-xl shadow-stone-950/15 z-50"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setTravelers(value)
                              setTravelersDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                              travelers === value ? 'bg-amber-100 text-stone-950' : 'text-stone-700 hover:bg-white'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              travelers === value
                                ? 'border-primary bg-primary text-stone-950'
                                : 'border-stone-300 bg-white'
                            }`}>
                              {travelers === value && <Check size={12} />}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-stone-500" />
                              <span className="font-medium">
                                {value} traveler{value > 1 ? 's' : ''}
                              </span>
                            </div>
                            {value >= 4 && (
                              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Group discount
                              </span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <label htmlFor="booking-name" className="text-sm font-semibold text-stone-700">Your details</label>
                  <input
                    id="booking-name"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    required
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Phone or WhatsApp"
                    autoComplete="tel"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <textarea
                    value={bookingNotes}
                    onChange={(event) => setBookingNotes(event.target.value)}
                    placeholder="Anything we should know?"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="rounded-3xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-stone-600">Estimated total</span>
                    <span className="font-bold text-stone-950">{formatPrice(totalPrice, currency)}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">Final confirmation and payment instructions are sent after review.</p>
                </div>

                {bookingStatus === "success" && (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p className="font-semibold">Booking request received.</p>
                    <p className="mt-1">Reference {bookingReference}. Our team will contact you shortly.</p>
                  </div>
                )}

                {bookingStatus === "error" && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {bookingError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingStatus === "submitting"}
                  data-analytics-event="booking_click"
                  data-analytics-label={trip.id}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-primary to-primary-light px-6 py-4 mt-3 text-sm font-semibold text-white shadow-2xl transition duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <Calendar size={18} /> {bookingStatus === "submitting" ? "Sending request..." : "Book Now"}
                </button>
              </form>

              <a
                href={`https://wa.me/212XXXXXXXXX?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="booking_whatsapp_click"
                data-analytics-label={trip.id}
                className="w-full inline-flex items-center justify-center gap-2 rounded-3xl border border-stone-300 bg-white px-6 py-4 text-sm font-semibold text-stone-700 transition duration-300 ease-out hover:border-primary hover:text-primary mt-3"
              >
                <MessageCircle size={18} /> Reserve with WhatsApp
              </a>

              <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-100 p-4 text-sm text-stone-700">
                <p className="font-semibold">Limited availability for selected dates.</p>
                <p className="mt-2 text-stone-500">Book now to secure your preferred travel period.</p>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-stone-500">
                <ShieldCheck size={20} className="text-primary" />
                <div>
                  <p className="font-semibold text-stone-900">Secure booking</p>
                  <p>No hidden fees, safe local payments.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {quickInfo.map((info) => (
            <div key={info.label} className="rounded-3xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{info.label}</p>
              <p className="mt-3 text-base font-semibold text-stone-900">{info.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 p-8">
              <span className="text-primary font-semibold uppercase tracking-[0.24em] text-sm">About the experience</span>
              <h2 className="mt-4 text-3xl font-bold text-stone-900">A cinematic desert escape designed for discerning travelers.</h2>
              <p className="mt-4 text-stone-600 leading-8">
                Begin with the vibrant energy of Marrakech and feel the landscape shift from red city walls to dramatic mountain passes and endless sand sea. Every moment is crafted to balance immersive culture, timeless luxury, and authentic Moroccan hospitality.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  'Private luxury 4x4 transport',
                  'Sunset camel trek in Erg Chebbi',
                  'Starlit dinner in a premium desert camp',
                  'Expert local guides with insider stories',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <p className="font-semibold text-stone-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 overflow-hidden">
              <div className="px-8 py-6 bg-amber-50 border-b border-amber-100">
                <h3 className="text-xl font-semibold text-stone-900">What makes this trip unique</h3>
              </div>
              <div className="p-8 space-y-4">
                {[
                  'Cross the Atlas Mountains with a private luxury 4x4.',
                  'Stay in a premium desert camp with traditional Berber dining.',
                  'Capture sunrise and sunset from the highest dunes.',
                  'Enjoy small-group service with flexible pacing.',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Sparkles size={18} />
                    </div>
                    <p className="mt-1 text-stone-600">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 p-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900">Your Journey Day by Day</h3>
                  <p className="mt-2 text-stone-600">Discover the magic of each moment</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
                  <Sparkles size={16} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Premium Experience</span>
                </div>
              </div>

              <div className="space-y-6">
                {itinerary.map((day, index) => (
                  <div key={day.day} className="relative">
                    {/* Timeline line */}
                    {index < itinerary.length - 1 && (
                      <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-amber-200 to-amber-100"></div>
                    )}

                    <div className="flex gap-6">
                      {/* Day number circle */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">{day.day}</span>
                        </div>
                      </div>

                      {/* Day content */}
                      <div className="flex-1 bg-gradient-to-r from-stone-50 to-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-stone-900 mb-1">{day.title}</h4>
                            <p className="text-stone-600 leading-relaxed">{day.description}</p>
                          </div>
                          <button
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                            className="flex-shrink-0 ml-4 p-2 rounded-full hover:bg-stone-100 transition-colors"
                          >
                            {expandedDay === day.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>

                        {/* Quick info badges */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-stone-200">
                            <Clock size={14} className="text-amber-600" />
                            <span className="text-sm font-medium text-stone-700">{day.drive}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-stone-200">
                            <MapPin size={14} className="text-amber-600" />
                            <span className="text-sm font-medium text-stone-700">{day.transport}</span>
                          </div>
                        </div>

                        {/* Expandable details */}
                        {expandedDay === day.day && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t border-stone-200 pt-6 mt-6"
                          >
                            <div className="grid gap-6 lg:grid-cols-2">
                              <div className="space-y-4">
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                      🍽️
                                    </div>
                                    <span className="font-semibold text-stone-900">Meals</span>
                                  </div>
                                  <p className="text-stone-700">{day.meals}</p>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      🏨
                                    </div>
                                    <span className="font-semibold text-stone-900">Accommodation</span>
                                  </div>
                                  <p className="text-stone-700">{day.accommodation}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="relative h-48 rounded-xl overflow-hidden">
                                  <ImageWithFallback
                                    src={day.image}
                                    alt={day.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                    className="object-cover"
                                    fallbackClassName="h-full w-full"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>

                                {day.highlights && day.highlights.length > 0 && (
                                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        ✨
                                      </div>
                                      <span className="font-semibold text-stone-900">Highlights</span>
                                    </div>
                                    <ul className="space-y-1">
                                      {day.highlights.map((highlight, idx) => (
                                        <li key={idx} className="text-stone-700 text-sm flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                          {highlight}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 overflow-hidden">
              <div className="px-8 py-6 bg-stone-950 text-white">
                <h3 className="text-xl font-semibold">Included / Not Included</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Included</p>
                  {trip.includes.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-3xl bg-stone-50 p-4">
                      <Check size={18} className="text-primary" />
                      <span className="text-stone-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Not included</p>
                  {[
                    'International flights',
                    'Travel insurance',
                    'Personal expenses',
                    'Tips for guides',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-3xl bg-stone-50 p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-stone-200 text-stone-600">—</span>
                      <span className="text-stone-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-stone-900">Traveler reviews</h3>
                  <p className="mt-2 text-sm text-stone-500">Real feedback from luxury travelers.</p>
                </div>
                <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">5.0 average</div>
              </div>
              <div className="mt-8 grid gap-4">
                {reviewCards.map((review) => (
                  <div key={review.name} className="rounded-3xl border border-stone-200 bg-stone-50 p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-3xl">
                        <ImageWithFallback
                          src={review.photo}
                          alt={review.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          fallbackClassName="h-14 w-14"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">{review.name}</p>
                        <p className="text-sm text-stone-500">{review.location}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} size={16} className="fill-current" />
                      ))}
                    </div>
                    <h4 className="mt-4 text-lg font-semibold text-stone-900">{review.title}</h4>
                    <p className="mt-3 text-stone-600 leading-7">{review.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 overflow-hidden">
              <div className="px-8 py-6 bg-stone-950 text-white">
                <h3 className="text-xl font-semibold">Frequently asked questions</h3>
              </div>
              <div className="space-y-2 p-6">
                {faqItems.map((faq, index) => (
                  <div key={faq.question} className="rounded-3xl border border-stone-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-semibold text-stone-900">{faq.question}</span>
                      {expandedFaq === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                    {expandedFaq === index && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-stone-200 px-6 py-5 text-stone-600">
                        {faq.answer}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 overflow-hidden">
              <div className="relative h-[420px] overflow-hidden bg-stone-900 text-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                  alt="Morocco route map"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover opacity-30"
                  fallbackClassName="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-sm uppercase tracking-[0.24em] text-amber-200">Route map</span>
                    <h3 className="mt-4 text-3xl font-semibold">Morocco route overview</h3>
                    <p className="mt-4 max-w-xl text-sm text-stone-200">
                      Follow the uninterrupted journey from Marrakech through mountain kasbahs to the iconic Erg Chebbi dunes.
                    </p>
                  </div>
                  <div className="grid gap-4 mt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C96A3D] scrollbar-track-white/10 hover:scrollbar-thumb-[#b85d33] max-h-48">
                    {stops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-stone-900 font-semibold">{index + 1}</div>
                        <div>
                          <p className="font-semibold">{stop}</p>
                          <p className="text-sm text-stone-200">{index === 0 ? 'Departure' : index === stops.length - 1 ? 'Return' : 'Scenic stop'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white shadow-2xl border border-stone-200 p-8">
              <h3 className="text-2xl font-semibold text-stone-900">Related trips</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-1">
                {relatedTrips.map((related) => (
                  <Link
                    key={related.id}
                    href={`/trips/${related.id}`}
                    className="group block rounded-[2rem] overflow-hidden border border-stone-200 bg-stone-50 shadow-sm transition hover:shadow-xl"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback
                        src={related.image}
                        alt={related.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 24rem"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        fallbackClassName="h-full w-full"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-stone-500">{related.duration} days · {related.locations[0]}</p>
                      <h4 className="mt-3 text-lg font-semibold text-stone-900">{related.title}</h4>
                      <p className="mt-3 text-sm text-stone-600">{related.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-stone-950 text-white shadow-2xl p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    icon: <ShieldCheck size={24} />,
                    title: 'Trusted by thousands',
                    description: 'Verified trips and responsible travel for luxury guests.',
                  },
                  {
                    icon: <Globe size={24} />,
                    title: 'Local expert guides',
                    description: 'Authentic route knowledge with insider access.',
                  },
                  {
                    icon: <Users size={24} />,
                    title: 'Small groups',
                    description: 'Intimate experiences with curated group sizes.',
                  },
                  {
                    icon: <TrendingUp size={24} />,
                    title: 'Transparent pricing',
                    description: 'No hidden costs, clear inclusions, easy checkout.',
                  },
                ].map((item, index) => (
                  <div key={index} className="rounded-3xl bg-white/5 p-5">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-stone-950">
                      {item.icon}
                    </div>
                    <h4 className="mt-4 text-lg font-semibold">{item.title}</h4>
                    <p className="mt-2 text-sm text-stone-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur-xl px-4 py-4 shadow-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-stone-500">Starting from</p>
            <p className="text-lg font-semibold text-stone-900">{formatPrice(trip.price, currency)}</p>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-primary to-primary-light px-5 py-3 text-sm font-semibold text-white shadow-2xl transition duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}
