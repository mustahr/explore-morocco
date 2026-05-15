"use client"

import { useEffect, useMemo, useState } from "react"
import { type ReactNode } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Database,
  Edit3,
  FileText,
  Globe,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react"
import { type Booking, type BookingStatus, type Lead, type LeadStatus, type PaymentStatus } from "@/lib/admin-db"
import { blogPosts, type Destination, type Experience, type Trip } from "@/lib/data"

type TripFormState = {
  id: string
  title: string
  description: string
  image: string
  images: string
  category: Trip["category"]
  duration: string
  price: string
  rating: string
  reviews: string
  locations: string
  itinerary: string
  highlights: string
  includes: string
}

type ExperienceFormState = {
  id: string
  title: string
  description: string
  image: string
  category: string
  duration: string
  price: string
  rating: string
  location: string
}

type DestinationFormState = {
  slug: string
  name: string
  nameFr: string
  nameAr: string
  description: string
  image: string
  images: string
  rating: string
  reviews: string
  bestTime: string
  highlights: string
  experiences: string
  itineraries: string
  detailIntro: string
  detailBestFor: string
  detailAreas: string
  detailFood: string
  detailLocalTips: string
  detailGettingAround: string
  detailWhereToStay: string
}

const categories: Trip["category"][] = ["luxury", "budget", "adventure", "cultural", "romantic", "family"]
const experienceCategories = ["Adventure", "Wellness", "Food & Drink", "Culture"]
const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"]
const paymentStatuses: PaymentStatus[] = ["unpaid", "deposit", "paid", "refunded"]
const leadStatuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"]

const sectionTransition = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
  transition: { duration: 0.28, ease: "easeOut" },
} as const

const emptyTripForm: TripFormState = {
  id: "",
  title: "",
  description: "",
  image: "",
  images: "",
  category: "adventure",
  duration: "3",
  price: "2500",
  rating: "4.8",
  reviews: "0",
  locations: "",
  itinerary: "",
  highlights: "",
  includes: "",
}

const emptyExperienceForm: ExperienceFormState = {
  id: "",
  title: "",
  description: "",
  image: "",
  category: "Adventure",
  duration: "3 hours",
  price: "300",
  rating: "4.8",
  location: "",
}

const emptyDestinationForm: DestinationFormState = {
  slug: "",
  name: "",
  nameFr: "",
  nameAr: "",
  description: "",
  image: "",
  images: "",
  rating: "4.8",
  reviews: "0",
  bestTime: "",
  highlights: "",
  experiences: "",
  itineraries: "",
  detailIntro: "",
  detailBestFor: "",
  detailAreas: "",
  detailFood: "",
  detailLocalTips: "",
  detailGettingAround: "",
  detailWhereToStay: "",
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

const tripToFormState = (trip: Trip): TripFormState => ({
  id: trip.id,
  title: trip.title,
  description: trip.description,
  image: trip.image,
  images: trip.images.join("\n"),
  category: trip.category,
  duration: String(trip.duration),
  price: String(trip.price),
  rating: String(trip.rating),
  reviews: String(trip.reviews),
  locations: trip.locations.join("\n"),
  itinerary: trip.itinerary.map((item) => `${item.title} | ${item.description}`).join("\n"),
  highlights: trip.highlights.join("\n"),
  includes: trip.includes.join("\n"),
})

const formStateToTrip = (form: TripFormState): Trip => ({
  id: slugify(form.id || form.title),
  title: form.title.trim(),
  description: form.description.trim(),
  image: form.image.trim(),
  images: splitLines(form.images),
  category: form.category,
  duration: Number(form.duration),
  price: Number(form.price),
  rating: Number(form.rating),
  reviews: Number(form.reviews),
  locations: splitLines(form.locations),
  itinerary: splitLines(form.itinerary).map((line, index) => {
    const [title, ...descriptionParts] = line.split("|")

    return {
      day: index + 1,
      title: title.trim(),
      description: descriptionParts.join("|").trim(),
    }
  }),
  highlights: splitLines(form.highlights),
  includes: splitLines(form.includes),
})

const experienceToFormState = (experience: Experience): ExperienceFormState => ({
  id: experience.id,
  title: experience.title,
  description: experience.description,
  image: experience.image,
  category: experience.category,
  duration: experience.duration,
  price: String(experience.price),
  rating: String(experience.rating),
  location: experience.location,
})

const formStateToExperience = (form: ExperienceFormState): Experience => ({
  id: slugify(form.id || form.title),
  title: form.title.trim(),
  description: form.description.trim(),
  image: form.image.trim(),
  category: form.category,
  duration: form.duration.trim(),
  price: Number(form.price),
  rating: Number(form.rating),
  location: form.location.trim(),
})

const destinationToFormState = (destination: Destination): DestinationFormState => ({
  slug: destination.slug,
  name: destination.name,
  nameFr: destination.nameFr ?? "",
  nameAr: destination.nameAr ?? "",
  description: destination.description,
  image: destination.image,
  images: destination.images.join("\n"),
  rating: String(destination.rating),
  reviews: String(destination.reviews),
  bestTime: destination.bestTime,
  highlights: destination.highlights.join("\n"),
  experiences: destination.experiences.join("\n"),
  itineraries: destination.itineraries.map((item) => `${item.days} | ${item.title} | ${item.price}`).join("\n"),
  detailIntro: destination.details?.intro ?? "",
  detailBestFor: destination.details?.bestFor.join("\n") ?? "",
  detailAreas: destination.details?.areas.map((item) => `${item.title} | ${item.description}`).join("\n") ?? "",
  detailFood: destination.details?.food.join("\n") ?? "",
  detailLocalTips: destination.details?.localTips.join("\n") ?? "",
  detailGettingAround: destination.details?.gettingAround ?? "",
  detailWhereToStay: destination.details?.whereToStay ?? "",
})

const formStateToDestination = (form: DestinationFormState): Destination => ({
  slug: slugify(form.slug || form.name),
  name: form.name.trim(),
  nameFr: form.nameFr.trim() || undefined,
  nameAr: form.nameAr.trim() || undefined,
  description: form.description.trim(),
  image: form.image.trim(),
  images: splitLines(form.images),
  rating: Number(form.rating),
  reviews: Number(form.reviews),
  bestTime: form.bestTime.trim(),
  highlights: splitLines(form.highlights),
  experiences: splitLines(form.experiences),
  itineraries: splitLines(form.itineraries).map((line) => {
    const [days, title, price] = line.split("|")

    return {
      days: Number(days?.trim() || 1),
      title: title?.trim() || "Custom itinerary",
      price: Number(price?.trim() || 0),
    }
  }),
  details: {
    intro: form.detailIntro.trim(),
    bestFor: splitLines(form.detailBestFor),
    areas: splitLines(form.detailAreas).map((line) => {
      const [title, ...descriptionParts] = line.split("|")

      return {
        title: title.trim(),
        description: descriptionParts.join("|").trim(),
      }
    }),
    food: splitLines(form.detailFood),
    localTips: splitLines(form.detailLocalTips),
    gettingAround: form.detailGettingAround.trim(),
    whereToStay: form.detailWhereToStay.trim(),
  },
})

type ContentIssue = {
  id: string
  type: string
  title: string
  missing: string[]
  actionLabel: string
  onAction: () => void
}

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState<string | null>(null)
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null)
  const [form, setForm] = useState<TripFormState>(emptyTripForm)
  const [destinationForm, setDestinationForm] = useState<DestinationFormState>(emptyDestinationForm)
  const [experienceForm, setExperienceForm] = useState<ExperienceFormState>(emptyExperienceForm)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [activeSection, setActiveSection] = useState("overview")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const isEditing = Boolean(selectedTripId)
  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.id === selectedTripId) ?? null,
    [selectedTripId, trips]
  )
  const isEditingDestination = Boolean(selectedDestinationSlug)
  const selectedDestination = useMemo(
    () => destinations.find((destination) => destination.slug === selectedDestinationSlug) ?? null,
    [selectedDestinationSlug, destinations]
  )
  const isEditingExperience = Boolean(selectedExperienceId)
  const selectedExperience = useMemo(
    () => experiences.find((experience) => experience.id === selectedExperienceId) ?? null,
    [selectedExperienceId, experiences]
  )
  const averageTripPrice = trips.length
    ? Math.round(trips.reduce((total, trip) => total + trip.price, 0) / trips.length)
    : 0
  const averageRating = trips.length
    ? (trips.reduce((total, trip) => total + trip.rating, 0) / trips.length).toFixed(1)
    : "0.0"
  const totalReviews = trips.reduce((total, trip) => total + trip.reviews, 0)
  const totalRevenue = bookings.reduce((total, booking) => total + booking.totalMAD, 0)
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length
  const openLeads = leads.filter((lead) => !["won", "lost"].includes(lead.status)).length
  const wonLeads = leads.filter((lead) => lead.status === "won").length
  const conversionRate = leads.length ? Math.round((wonLeads / leads.length) * 100) : 0
  const categoryStats = categories.map((category) => ({
    category,
    count: trips.filter((trip) => trip.category === category).length,
  }))
  const highestValueTrips = [...trips].sort((a, b) => b.price - a.price).slice(0, 3)
  const shortestTrip = trips.length ? [...trips].sort((a, b) => a.duration - b.duration)[0] : null
  const longestTrip = trips.length ? [...trips].sort((a, b) => b.duration - a.duration)[0] : null
  const contentIssues = useMemo<ContentIssue[]>(() => {
    const issues: ContentIssue[] = []

    trips.forEach((trip) => {
      const missing = [
        !trip.title.trim() && "title",
        !trip.description.trim() && "description",
        !trip.image.trim() && "hero image",
        trip.images.length === 0 && "gallery images",
        trip.locations.length === 0 && "locations",
        trip.itinerary.length === 0 && "itinerary",
        trip.highlights.length === 0 && "highlights",
        trip.includes.length === 0 && "included items",
      ].filter(Boolean) as string[]

      if (missing.length > 0) {
        issues.push({
          id: `trip-${trip.id}`,
          type: "Trip",
          title: trip.title || trip.id || "Untitled trip",
          missing,
          actionLabel: "Fix trip",
          onAction: () => startEditingTrip(trip),
        })
      }
    })

    experiences.forEach((experience) => {
      const missing = [
        !experience.title.trim() && "title",
        !experience.description.trim() && "description",
        !experience.image.trim() && "image",
        !experience.category.trim() && "category",
        !experience.duration.trim() && "duration",
        !experience.location.trim() && "location",
        !Number.isFinite(experience.price) && "price",
        !Number.isFinite(experience.rating) && "rating",
      ].filter(Boolean) as string[]

      if (missing.length > 0) {
        issues.push({
          id: `experience-${experience.id}`,
          type: "Experience",
          title: experience.title || experience.id || "Untitled experience",
          missing,
          actionLabel: "Fix experience",
          onAction: () => startEditingExperience(experience),
        })
      }
    })

    destinations.forEach((destination) => {
      const missing = [
        !destination.name.trim() && "name",
        !destination.description.trim() && "description",
        !destination.image.trim() && "hero image",
        destination.images.length === 0 && "gallery images",
        destination.highlights.length === 0 && "highlights",
        destination.experiences.length === 0 && "experience details",
        destination.itineraries.length === 0 && "itineraries",
        !destination.details?.intro?.trim() && "destination intro",
        !destination.details?.gettingAround?.trim() && "getting around details",
        !destination.details?.whereToStay?.trim() && "where to stay details",
      ].filter(Boolean) as string[]

      if (missing.length > 0) {
        issues.push({
          id: `destination-${destination.slug}`,
          type: "Destination",
          title: destination.name || destination.slug || "Untitled destination",
          missing,
          actionLabel: "Fix destination",
          onAction: () => startEditingDestination(destination),
        })
      }
    })

    blogPosts.forEach((post) => {
      const missing = [
        !post.title.trim() && "title",
        !post.excerpt.trim() && "excerpt",
        !post.image.trim() && "image",
        !post.content.trim() && "content",
        post.tableOfContents.length === 0 && "table of contents",
      ].filter(Boolean) as string[]

      if (missing.length > 0) {
        issues.push({
          id: `blog-${post.slug}`,
          type: "Blog",
          title: post.title || post.slug || "Untitled blog post",
          missing,
          actionLabel: "View content",
          onAction: () => setActiveSection("content"),
        })
      }
    })

    return issues
  }, [destinations, experiences, trips])
  const contentItemCount = trips.length + experiences.length + destinations.length + blogPosts.length
  const healthyContentCount = Math.max(contentItemCount - contentIssues.length, 0)
  const contentHealth = contentItemCount ? Math.round((healthyContentCount / contentItemCount) * 100) : 0

  async function loadTrips() {
    const response = await fetch("/api/trips")
    const data = (await response.json()) as { trips: Trip[] }
    setTrips(data.trips)
  }

  async function loadExperiences() {
    const response = await fetch("/api/experiences")
    const data = (await response.json()) as { experiences: Experience[] }
    setExperiences(data.experiences)
  }

  async function loadDestinations() {
    const response = await fetch("/api/destinations")
    const data = (await response.json()) as { destinations: Destination[] }
    setDestinations(data.destinations)
  }

  async function loadOperations() {
    const [bookingsResponse, leadsResponse] = await Promise.all([
      fetch("/api/bookings"),
      fetch("/api/leads"),
    ])
    const bookingsData = (await bookingsResponse.json()) as { bookings: Booking[] }
    const leadsData = (await leadsResponse.json()) as { leads: Lead[] }

    setBookings(bookingsData.bookings)
    setLeads(leadsData.leads)
  }

  useEffect(() => {
    let ignore = false

    Promise.all([
      fetch("/api/trips").then((response) => response.json() as Promise<{ trips: Trip[] }>),
      fetch("/api/destinations").then((response) => response.json() as Promise<{ destinations: Destination[] }>),
      fetch("/api/experiences").then((response) => response.json() as Promise<{ experiences: Experience[] }>),
      fetch("/api/bookings").then((response) => response.json() as Promise<{ bookings: Booking[] }>),
      fetch("/api/leads").then((response) => response.json() as Promise<{ leads: Lead[] }>),
    ]).then(([tripsData, destinationsData, experiencesData, bookingsData, leadsData]) => {
        if (!ignore) {
          setTrips(tripsData.trips)
          setDestinations(destinationsData.destinations)
          setExperiences(experiencesData.experiences)
          setBookings(bookingsData.bookings)
          setLeads(leadsData.leads)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!message) return

    const timeout = window.setTimeout(() => {
      setMessage("")
    }, 5000)

    return () => window.clearTimeout(timeout)
  }, [message])

  function updateField<K extends keyof TripFormState>(field: K, value: TripFormState[K]) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function updateExperienceField<K extends keyof ExperienceFormState>(field: K, value: ExperienceFormState[K]) {
    setExperienceForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function updateDestinationField<K extends keyof DestinationFormState>(field: K, value: DestinationFormState[K]) {
    setDestinationForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function startNewTrip() {
    setSelectedTripId(null)
    setForm(emptyTripForm)
    setMessage("")
    setActiveSection("trips")
  }

  function startNewExperience() {
    setSelectedExperienceId(null)
    setExperienceForm(emptyExperienceForm)
    setMessage("")
    setActiveSection("experiences")
  }

  function startNewDestination() {
    setSelectedDestinationSlug(null)
    setDestinationForm(emptyDestinationForm)
    setMessage("")
    setActiveSection("destinations")
  }

  function startEditingTrip(trip: Trip) {
    setSelectedTripId(trip.id)
    setForm(tripToFormState(trip))
    setMessage("")
    setActiveSection("trips")
  }

  function startEditingExperience(experience: Experience) {
    setSelectedExperienceId(experience.id)
    setExperienceForm(experienceToFormState(experience))
    setMessage("")
    setActiveSection("experiences")
  }

  function startEditingDestination(destination: Destination) {
    setSelectedDestinationSlug(destination.slug)
    setDestinationForm(destinationToFormState(destination))
    setMessage("")
    setActiveSection("destinations")
  }

  async function saveTrip() {
    setIsSaving(true)
    setMessage("")

    try {
      const trip = formStateToTrip(form)
      const response = await fetch(isEditing ? `/api/trips/${selectedTripId}` : "/api/trips", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      })
      const data = (await response.json()) as { trip?: Trip; error?: string }

      if (!response.ok || !data.trip) {
        setMessage(data.error ?? "Could not save trip.")
        return
      }

      await loadTrips()
      setSelectedTripId(data.trip.id)
      setForm(tripToFormState(data.trip))
      setMessage(isEditing ? "Trip updated." : "Trip created.")
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteSelectedTrip() {
    if (!selectedTrip) return
    const confirmed = window.confirm(`Delete "${selectedTrip.title}"?`)
    if (!confirmed) return

    const response = await fetch(`/api/trips/${selectedTrip.id}`, { method: "DELETE" })

    if (!response.ok) {
      setMessage("Could not delete trip.")
      return
    }

    await loadTrips()
    startNewTrip()
    setMessage("Trip deleted.")
  }

  async function saveDestination() {
    setIsSaving(true)
    setMessage("")

    try {
      const destination = formStateToDestination(destinationForm)
      const response = await fetch(isEditingDestination ? `/api/destinations/${selectedDestinationSlug}` : "/api/destinations", {
        method: isEditingDestination ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destination),
      })
      const data = (await response.json()) as { destination?: Destination; error?: string }

      if (!response.ok || !data.destination) {
        setMessage(data.error ?? "Could not save destination.")
        return
      }

      await loadDestinations()
      setSelectedDestinationSlug(data.destination.slug)
      setDestinationForm(destinationToFormState(data.destination))
      setMessage(isEditingDestination ? "Destination updated." : "Destination created.")
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteSelectedDestination() {
    if (!selectedDestination) return
    const confirmed = window.confirm(`Delete "${selectedDestination.name}"?`)
    if (!confirmed) return

    const response = await fetch(`/api/destinations/${selectedDestination.slug}`, { method: "DELETE" })

    if (!response.ok) {
      setMessage("Could not delete destination.")
      return
    }

    await loadDestinations()
    startNewDestination()
    setMessage("Destination deleted.")
  }

  async function saveExperience() {
    setIsSaving(true)
    setMessage("")

    try {
      const experience = formStateToExperience(experienceForm)
      const response = await fetch(isEditingExperience ? `/api/experiences/${selectedExperienceId}` : "/api/experiences", {
        method: isEditingExperience ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experience),
      })
      const data = (await response.json()) as { experience?: Experience; error?: string }

      if (!response.ok || !data.experience) {
        setMessage(data.error ?? "Could not save experience.")
        return
      }

      await loadExperiences()
      setSelectedExperienceId(data.experience.id)
      setExperienceForm(experienceToFormState(data.experience))
      setMessage(isEditingExperience ? "Experience updated." : "Experience created.")
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteSelectedExperience() {
    if (!selectedExperience) return
    const confirmed = window.confirm(`Delete "${selectedExperience.title}"?`)
    if (!confirmed) return

    const response = await fetch(`/api/experiences/${selectedExperience.id}`, { method: "DELETE" })

    if (!response.ok) {
      setMessage("Could not delete experience.")
      return
    }

    await loadExperiences()
    startNewExperience()
    setMessage("Experience deleted.")
  }

  async function updateBookingStatus(id: string, updates: Partial<Booking>) {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (response.ok) {
      await loadOperations()
      setMessage("Booking updated.")
    }
  }

  async function deleteBookingRecord(id: string) {
    const confirmed = window.confirm(`Delete booking ${id}?`)
    if (!confirmed) return

    const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" })

    if (response.ok) {
      await loadOperations()
      setMessage("Booking deleted.")
    }
  }

  async function updateLeadStatus(id: string, status: LeadStatus) {
    const response = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (response.ok) {
      await loadOperations()
      setMessage("Lead updated.")
    }
  }

  async function deleteLeadRecord(id: string) {
    const confirmed = window.confirm(`Delete lead ${id}?`)
    if (!confirmed) return

    const response = await fetch(`/api/leads/${id}`, { method: "DELETE" })

    if (response.ok) {
      await loadOperations()
      setMessage("Lead deleted.")
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className={`grid min-h-screen transition-[grid-template-columns] duration-300 ease-out ${isSidebarCollapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[280px_1fr]"}`}>
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`relative border-b border-stone-200 bg-stone-950 px-4 py-6 text-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r ${
            isSidebarCollapsed ? "lg:px-4" : "lg:px-5"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className={`absolute top-5 hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20 lg:inline-flex ${
              isSidebarCollapsed ? "left-1/2 -translate-x-1/2" : "right-4"
            }`}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white ${
              isSidebarCollapsed ? "lg:mt-14 lg:h-10 lg:w-10 lg:justify-center lg:rounded-2xl lg:bg-white/5" : "lg:pr-12"
            }`}
            title="Back to site"
          >
            <ArrowLeft size={18} />
            <span className={isSidebarCollapsed ? "lg:hidden" : ""}>Back to site</span>
          </Link>

          <div className={`mt-8 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Control Panel</p>
            <p className="mt-3 text-sm text-stone-300">Manage content, monitor inventory, and update the local database.</p>
          </div>

          <nav className={`grid gap-2 ${isSidebarCollapsed ? "mt-8 lg:mt-10" : "mt-8"}`}>
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "trips", label: "Trips", icon: Sparkles },
              { id: "destinations", label: "Destinations", icon: Globe },
              { id: "experiences", label: "Experiences", icon: MapPin },
              { id: "bookings", label: "Bookings", icon: Users },
              { id: "leads", label: "Leads", icon: MessageCircle },
              { id: "content", label: "Content", icon: FileText },
              { id: "database", label: "Database", icon: Database },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  whileHover={isSidebarCollapsed ? { scale: 1.06 } : { x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isSidebarCollapsed ? "lg:h-12 lg:justify-center lg:px-0" : ""
                  } ${
                    activeSection === item.id ? "bg-white text-stone-950" : "text-stone-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{item.label}</span>
                </motion.button>
              )
            })}
          </nav>

          <div className={`mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 ${isSidebarCollapsed ? "lg:px-3" : ""}`}>
            <p className={`text-sm font-semibold ${isSidebarCollapsed ? "lg:text-center lg:text-xs" : ""}`}>Database</p>
            <p className={`mt-2 text-xs text-stone-300 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>Local JSON storage</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full bg-amber-400"
              />
            </div>
          </div>
        </motion.aside>

        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              className="relative overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-8 text-white shadow-2xl shadow-stone-900/15 sm:px-8 lg:px-10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(217,119,6,0.45),transparent_28%),radial-gradient(circle_at_84%_16%,rgba(14,165,233,0.26),transparent_26%),radial-gradient(circle_at_74%_86%,rgba(5,150,105,0.24),transparent_28%)]" />
              <svg
                className="absolute right-0 top-0 h-full w-2/3 text-white/10"
                viewBox="0 0 760 320"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M-20 240 C 110 70, 250 300, 390 135 S 610 35, 790 210"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="12 16"
                />
              </svg>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-white/15 lg:block"
              />
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-44 hidden h-14 w-14 rounded-2xl border border-amber-300/30 bg-amber-300/10 lg:block"
              />

              <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200 ring-1 ring-white/15">
                    Admin Dashboard
                  </p>
                  <h2 className="mt-5 text-4xl font-bold tracking-tight text-white lg:text-5xl">
                    {activeSection === "overview" && "Dashboard overview"}
                    {activeSection === "trips" && "Trip management"}
                    {activeSection === "destinations" && "Destination management"}
                    {activeSection === "experiences" && "Experience management"}
                    {activeSection === "bookings" && "Booking operations"}
                    {activeSection === "leads" && "Lead pipeline"}
                    {activeSection === "content" && "Content control"}
                    {activeSection === "database" && "Database status"}
                    {activeSection === "settings" && "Settings"}
                  </h2>
                  <p className="mt-4 max-w-2xl text-stone-200">
                    Control listings, review content coverage, and keep the travel catalog healthy.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center sm:w-[24rem]">
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15">
                    <p className="text-2xl font-bold">{trips.length}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-300">Trips</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15">
                    <p className="text-2xl font-bold">{experiences.length}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-300">Experiences</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15">
                    <p className="text-2xl font-bold">{pendingBookings}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-300">Pending</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={activeSection} {...sectionTransition}>

            {activeSection === "overview" && (
              <section className="mt-8 space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Trips" value={trips.length.toString()} detail="Editable database records" />
                  <StatCard label="Avg. rating" value={averageRating} detail={`${totalReviews.toLocaleString()} total reviews`} />
                  <StatCard label="Avg. price" value={`MAD ${averageTripPrice.toLocaleString()}`} detail="Across active trips" />
                  <StatCard label="Content items" value={(destinations.length + experiences.length + blogPosts.length).toString()} detail="Destinations, experiences, blog" />
                  <StatCard label="Revenue" value={`MAD ${totalRevenue.toLocaleString()}`} detail={`${bookings.length} booking records`} />
                  <StatCard label="Pending bookings" value={pendingBookings.toString()} detail="Need confirmation" />
                  <StatCard label="Open leads" value={openLeads.toString()} detail={`${conversionRate}% lead win rate`} />
                  <StatCard label="Travelers" value={bookings.reduce((total, booking) => total + booking.travelers, 0).toString()} detail="Across bookings" />
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                  <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 size={22} className="text-primary" />
                      <h3 className="text-xl font-bold text-stone-900">Trip category mix</h3>
                    </div>
                    <div className="mt-6 space-y-4">
                      {categoryStats.map((item) => {
                        const percent = trips.length ? Math.round((item.count / trips.length) * 100) : 0

                        return (
                          <div key={item.category}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold capitalize text-stone-700">{item.category}</span>
                              <span className="text-stone-500">{item.count} trips</span>
                            </div>
                            <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.55, ease: "easeOut" }}
                                className="h-full rounded-full bg-primary"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-stone-900">Highest value trips</h3>
                    <div className="mt-5 space-y-3">
                      {highestValueTrips.map((trip) => (
                        <button
                          key={trip.id}
                          type="button"
                          onClick={() => startEditingTrip(trip)}
                          className="flex w-full items-center justify-between rounded-2xl border border-stone-200 p-4 text-left transition hover:border-primary/50 hover:bg-stone-50"
                        >
                          <div>
                            <p className="font-semibold text-stone-900">{trip.title}</p>
                            <p className="mt-1 text-xs text-stone-500">{trip.duration} days - {trip.category}</p>
                          </div>
                          <span className="text-sm font-bold text-primary">MAD {trip.price.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="grid gap-8 xl:grid-cols-3">
                  <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={22} className="text-primary" />
                      <h3 className="text-xl font-bold text-stone-900">Content health</h3>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-bold text-stone-900">{contentHealth}%</span>
                        <span className="pb-2 text-sm font-semibold text-stone-500">complete</span>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${contentHealth}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full bg-green-500"
                        />
                      </div>
                      <p className="mt-4 text-sm text-stone-600">
                        {healthyContentCount} of {contentItemCount} content records passed the required-field check.
                      </p>
                      <div className="mt-5 space-y-3">
                        {contentIssues.length === 0 ? (
                          <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">
                            No missing content detected.
                          </div>
                        ) : (
                          contentIssues.slice(0, 4).map((issue) => (
                            <motion.div
                              key={issue.id}
                              whileHover={{ x: 4 }}
                              className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">{issue.type}</p>
                                  <p className="mt-1 truncate font-semibold text-stone-900">{issue.title}</p>
                                  <p className="mt-1 text-sm text-stone-600">Missing: {issue.missing.join(", ")}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={issue.onAction}
                                  className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
                                >
                                  {issue.actionLabel}
                                </button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                      {contentIssues.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setActiveSection("content")}
                          className="mt-4 text-sm font-semibold text-primary hover:underline"
                        >
                          View {contentIssues.length - 4} more content issues
                        </button>
                      )}
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-stone-900">Trip range</h3>
                    <div className="mt-5 grid gap-3">
                      <MetricRow label="Shortest" value={shortestTrip ? `${shortestTrip.duration} days` : "None"} detail={shortestTrip?.title ?? "No trips yet"} />
                      <MetricRow label="Longest" value={longestTrip ? `${longestTrip.duration} days` : "None"} detail={longestTrip?.title ?? "No trips yet"} />
                      <MetricRow label="Reviews" value={totalReviews.toLocaleString()} detail="Across all trips" />
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-stone-900">Admin activity</h3>
                    <div className="mt-5 space-y-3">
                      <ActivityRow title="Trip database connected" detail="data/trips.json is powering the catalog." />
                      <ActivityRow title="Dashboard sections ready" detail="Overview, Trips, Content, Database, Settings." />
                      <ActivityRow title="Public chrome hidden" detail="Admin runs without the site top menu." />
                    </div>
                  </section>
                </div>
              </section>
            )}

            {activeSection === "content" && (
              <section className="mt-8 grid gap-6 lg:grid-cols-3">
                <ContentCard title="Destinations" count={destinations.length} status="Database catalog" detail="Destination records are powered by data/destinations.json and API routes." />
                <ContentCard title="Experiences" count={experiences.length} status="Editable database" detail="Experience records are powered by data/experiences.json and API routes." />
                <ContentCard title="Blog posts" count={blogPosts.length} status="Static catalog" detail="Blog entries can use the same API pattern as trips." />
              </section>
            )}

            {activeSection === "bookings" && (
              <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">Bookings</h3>
                    <p className="mt-1 text-sm text-stone-500">Update booking and payment status.</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{bookings.length} records</span>
                </div>

                <div className="grid gap-4">
                  {bookings.map((booking) => {
                    const trip = trips.find((item) => item.id === booking.tripId)

                    return (
                      <div key={booking.id} className="grid gap-4 rounded-2xl border border-stone-200 p-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_auto] xl:items-center">
                        <div>
                          <p className="font-bold text-stone-900">{booking.customerName}</p>
                          <p className="mt-1 text-sm text-stone-500">{booking.customerEmail}</p>
                          <p className="mt-2 text-sm text-stone-700">{trip?.title ?? booking.tripId}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-stone-900">{booking.startDate}</p>
                          <p className="mt-1 text-stone-500">{booking.travelers} travelers - MAD {booking.totalMAD.toLocaleString()}</p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                          <select
                            value={booking.status}
                            onChange={(event) => updateBookingStatus(booking.id, { status: event.target.value as BookingStatus })}
                            className="admin-input"
                          >
                            {bookingStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          <select
                            value={booking.paymentStatus}
                            onChange={(event) => updateBookingStatus(booking.id, { paymentStatus: event.target.value as PaymentStatus })}
                            className="admin-input"
                          >
                            {paymentStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteBookingRecord(booking.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {activeSection === "leads" && (
              <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">Leads</h3>
                    <p className="mt-1 text-sm text-stone-500">Track inquiry status and sales pipeline.</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{leads.length} leads</span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {leads.map((lead) => (
                    <div key={lead.id} className="rounded-2xl border border-stone-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-stone-900">{lead.name}</p>
                          <p className="mt-1 text-sm text-stone-500">{lead.email}</p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-800">{lead.source}</span>
                      </div>
                      <p className="mt-4 text-sm text-stone-700">{lead.interest}</p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <select
                          value={lead.status}
                          onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)}
                          className="admin-input"
                        >
                          {leadStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => deleteLeadRecord(lead.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "database" && (
              <section className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900">Storage</h3>
                  <p className="mt-3 text-stone-600">Trips, destinations, and experiences are read from and written to local JSON database files.</p>
                  <div className="mt-6 grid gap-3 text-sm">
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">GET /api/trips active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">POST /api/trips active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">PATCH /api/trips/:id active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">DELETE /api/trips/:id active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">GET /api/destinations active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">POST /api/destinations active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">PATCH /api/destinations/:slug active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">DELETE /api/destinations/:slug active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">GET /api/experiences active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">POST /api/experiences active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">PATCH /api/experiences/:id active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">DELETE /api/experiences/:id active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">GET /api/bookings active</p>
                    <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">GET /api/leads active</p>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900">Production note</h3>
                  <p className="mt-3 text-stone-600">This dashboard is wired for local JSON storage. The helper layer can be swapped for Prisma, PostgreSQL, or Supabase while keeping the admin UI and API routes mostly unchanged.</p>
                </div>
              </section>
            )}

            {activeSection === "settings" && (
              <section className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900">Site controls</h3>
                  <div className="mt-5 grid gap-4">
                    <ToggleRow title="Booking enabled" description="Show booking CTAs on trip pages." enabled />
                    <ToggleRow title="Show savings labels" description="Display early booking savings on cards." enabled />
                    <ToggleRow title="Maintenance banner" description="Reserve space for site-wide alerts." />
                  </div>
                </div>
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900">Admin access</h3>
                  <p className="mt-3 text-stone-600">Authentication is not enabled yet. Add auth before deploying this dashboard publicly.</p>
                </div>
              </section>
            )}

            {activeSection === "destinations" && (
              <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                  <div className="flex items-center justify-between px-2 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Destinations</h2>
                      <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{destinations.length} total</span>
                    </div>
                    <button
                      type="button"
                      onClick={startNewDestination}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                      aria-label="Add new destination"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {destinations.map((destination) => (
                      <button
                        key={destination.slug}
                        type="button"
                        onClick={() => startEditingDestination(destination)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          selectedDestinationSlug === destination.slug
                            ? "border-primary bg-amber-50"
                            : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <img src={destination.image} alt={destination.name} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-stone-900">{destination.name}</p>
                            <p className="mt-1 text-xs text-stone-500">{destination.bestTime || "No best time set"}</p>
                            <p className="mt-2 text-sm font-bold text-primary">{destination.rating} rating</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>

                <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                  <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-900">{isEditingDestination ? "Edit destination" : "Add destination"}</h2>
                      <p className="mt-1 text-sm text-stone-500">{isEditingDestination ? selectedDestination?.slug : "Create a new destination record"}</p>
                    </div>
                    <div className="flex gap-3">
                      {isEditingDestination && (
                        <button
                          type="button"
                          onClick={deleteSelectedDestination}
                          className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={saveDestination}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isEditingDestination ? <Edit3 size={16} /> : <Save size={16} />}
                        {isSaving ? "Saving..." : "Save destination"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <Field label="Destination slug">
                      <input value={destinationForm.slug} onChange={(event) => updateDestinationField("slug", event.target.value)} disabled={isEditingDestination} className="admin-input disabled:bg-stone-100 disabled:text-stone-400" placeholder="marrakech" />
                    </Field>
                    <Field label="Name">
                      <input value={destinationForm.name} onChange={(event) => updateDestinationField("name", event.target.value)} className="admin-input" placeholder="Marrakech" />
                    </Field>
                    <Field label="French name">
                      <input value={destinationForm.nameFr} onChange={(event) => updateDestinationField("nameFr", event.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Arabic name">
                      <input value={destinationForm.nameAr} onChange={(event) => updateDestinationField("nameAr", event.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Hero image URL">
                      <input value={destinationForm.image} onChange={(event) => updateDestinationField("image", event.target.value)} className="admin-input" placeholder="https://..." />
                    </Field>
                    <Field label="Best time to visit">
                      <input value={destinationForm.bestTime} onChange={(event) => updateDestinationField("bestTime", event.target.value)} className="admin-input" placeholder="March to May, September to November" />
                    </Field>
                    <Field label="Rating">
                      <input type="number" min="0" max="5" step="0.1" value={destinationForm.rating} onChange={(event) => updateDestinationField("rating", event.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Reviews">
                      <input type="number" min="0" value={destinationForm.reviews} onChange={(event) => updateDestinationField("reviews", event.target.value)} className="admin-input" />
                    </Field>
                  </div>

                  <div className="mt-5 grid gap-5">
                    <Field label="Description">
                      <textarea value={destinationForm.description} onChange={(event) => updateDestinationField("description", event.target.value)} className="admin-input min-h-28" />
                    </Field>
                    <Field label="Gallery images, one URL per line">
                      <textarea value={destinationForm.images} onChange={(event) => updateDestinationField("images", event.target.value)} className="admin-input min-h-28" />
                    </Field>
                    <Field label="Highlights, one per line">
                      <textarea value={destinationForm.highlights} onChange={(event) => updateDestinationField("highlights", event.target.value)} className="admin-input min-h-24" />
                    </Field>
                    <Field label="Experiences, one per line">
                      <textarea value={destinationForm.experiences} onChange={(event) => updateDestinationField("experiences", event.target.value)} className="admin-input min-h-24" />
                    </Field>
                    <Field label="Itineraries, one per line as Days | Title | Price MAD">
                      <textarea value={destinationForm.itineraries} onChange={(event) => updateDestinationField("itineraries", event.target.value)} className="admin-input min-h-28" />
                    </Field>
                  </div>

                  <div className="mt-8 border-t border-stone-200 pt-6">
                    <h3 className="text-xl font-bold text-stone-900">Destination detail content</h3>
                    <div className="mt-5 grid gap-5">
                      <Field label="Intro">
                        <textarea value={destinationForm.detailIntro} onChange={(event) => updateDestinationField("detailIntro", event.target.value)} className="admin-input min-h-28" />
                      </Field>
                      <Field label="Best for, one per line">
                        <textarea value={destinationForm.detailBestFor} onChange={(event) => updateDestinationField("detailBestFor", event.target.value)} className="admin-input min-h-24" />
                      </Field>
                      <Field label="Key areas, one per line as Title | Description">
                        <textarea value={destinationForm.detailAreas} onChange={(event) => updateDestinationField("detailAreas", event.target.value)} className="admin-input min-h-28" />
                      </Field>
                      <Field label="Food to taste, one per line">
                        <textarea value={destinationForm.detailFood} onChange={(event) => updateDestinationField("detailFood", event.target.value)} className="admin-input min-h-24" />
                      </Field>
                      <Field label="Local tips, one per line">
                        <textarea value={destinationForm.detailLocalTips} onChange={(event) => updateDestinationField("detailLocalTips", event.target.value)} className="admin-input min-h-24" />
                      </Field>
                      <Field label="Getting around">
                        <textarea value={destinationForm.detailGettingAround} onChange={(event) => updateDestinationField("detailGettingAround", event.target.value)} className="admin-input min-h-24" />
                      </Field>
                      <Field label="Where to stay">
                        <textarea value={destinationForm.detailWhereToStay} onChange={(event) => updateDestinationField("detailWhereToStay", event.target.value)} className="admin-input min-h-24" />
                      </Field>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === "experiences" && (
              <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                  <div className="flex items-center justify-between px-2 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Experiences</h2>
                      <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{experiences.length} total</span>
                    </div>
                    <button
                      type="button"
                      onClick={startNewExperience}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                      aria-label="Add new experience"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {experiences.map((experience) => (
                      <button
                        key={experience.id}
                        type="button"
                        onClick={() => startEditingExperience(experience)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          selectedExperienceId === experience.id
                            ? "border-primary bg-amber-50"
                            : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <img src={experience.image} alt={experience.title} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-stone-900">{experience.title}</p>
                            <p className="mt-1 text-xs text-stone-500">{experience.location} - {experience.category}</p>
                            <p className="mt-2 text-sm font-bold text-primary">MAD {experience.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>

                <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                  <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-900">{isEditingExperience ? "Edit experience" : "Add experience"}</h2>
                      <p className="mt-1 text-sm text-stone-500">{isEditingExperience ? selectedExperience?.id : "Create a new experience record"}</p>
                    </div>
                    <div className="flex gap-3">
                      {isEditingExperience && (
                        <button
                          type="button"
                          onClick={deleteSelectedExperience}
                          className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={saveExperience}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isEditingExperience ? <Edit3 size={16} /> : <Save size={16} />}
                        {isSaving ? "Saving..." : "Save experience"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <Field label="Experience ID">
                      <input value={experienceForm.id} onChange={(event) => updateExperienceField("id", event.target.value)} disabled={isEditingExperience} className="admin-input disabled:bg-stone-100 disabled:text-stone-400" placeholder="cooking-class" />
                    </Field>
                    <Field label="Title">
                      <input value={experienceForm.title} onChange={(event) => updateExperienceField("title", event.target.value)} className="admin-input" placeholder="Moroccan Cooking Class" />
                    </Field>
                    <Field label="Category">
                      <select value={experienceForm.category} onChange={(event) => updateExperienceField("category", event.target.value)} className="admin-input">
                        {experienceCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Location">
                      <input value={experienceForm.location} onChange={(event) => updateExperienceField("location", event.target.value)} className="admin-input" placeholder="Marrakech" />
                    </Field>
                    <Field label="Duration">
                      <input value={experienceForm.duration} onChange={(event) => updateExperienceField("duration", event.target.value)} className="admin-input" placeholder="3 hours" />
                    </Field>
                    <Field label="Price MAD">
                      <input type="number" min="0" value={experienceForm.price} onChange={(event) => updateExperienceField("price", event.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Rating">
                      <input type="number" min="0" max="5" step="0.1" value={experienceForm.rating} onChange={(event) => updateExperienceField("rating", event.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Hero image URL">
                      <input value={experienceForm.image} onChange={(event) => updateExperienceField("image", event.target.value)} className="admin-input" placeholder="https://..." />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <Field label="Description">
                      <textarea value={experienceForm.description} onChange={(event) => updateExperienceField("description", event.target.value)} className="admin-input min-h-32" />
                    </Field>
                  </div>
                </section>
              </div>
            )}

            {activeSection === "trips" && (
              <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between px-2 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Trips</h2>
                <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{trips.length} total</span>
              </div>
              <button
                type="button"
                onClick={startNewTrip}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                aria-label="Add new trip"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => startEditingTrip(trip)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    selectedTripId === trip.id
                      ? "border-primary bg-amber-50"
                      : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <img src={trip.image} alt={trip.title} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-stone-900">{trip.title}</p>
                      <p className="mt-1 text-xs text-stone-500">{trip.duration} days - {trip.category}</p>
                      <p className="mt-2 text-sm font-bold text-primary">MAD {trip.price.toLocaleString()}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
            <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">{isEditing ? "Edit trip" : "Add trip"}</h2>
                <p className="mt-1 text-sm text-stone-500">{isEditing ? selectedTrip?.id : "Create a new trip record"}</p>
              </div>
              <div className="flex gap-3">
                {isEditing && (
                  <button
                    type="button"
                    onClick={deleteSelectedTrip}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={saveTrip}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditing ? <Edit3 size={16} /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save trip"}
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Trip ID">
                <input value={form.id} onChange={(event) => updateField("id", event.target.value)} disabled={isEditing} className="admin-input disabled:bg-stone-100 disabled:text-stone-400" placeholder="desert-3day" />
              </Field>
              <Field label="Title">
                <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="admin-input" placeholder="3-Day Sahara Desert Adventure" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={(event) => updateField("category", event.target.value as Trip["category"])} className="admin-input">
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label="Hero image URL">
                <input value={form.image} onChange={(event) => updateField("image", event.target.value)} className="admin-input" placeholder="https://..." />
              </Field>
              <Field label="Duration days">
                <input type="number" min="1" value={form.duration} onChange={(event) => updateField("duration", event.target.value)} className="admin-input" />
              </Field>
              <Field label="Price MAD">
                <input type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} className="admin-input" />
              </Field>
              <Field label="Rating">
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => updateField("rating", event.target.value)} className="admin-input" />
              </Field>
              <Field label="Reviews">
                <input type="number" min="0" value={form.reviews} onChange={(event) => updateField("reviews", event.target.value)} className="admin-input" />
              </Field>
            </div>

            <div className="mt-5 grid gap-5">
              <Field label="Description">
                <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} className="admin-input min-h-28" />
              </Field>
              <Field label="Gallery images, one URL per line">
                <textarea value={form.images} onChange={(event) => updateField("images", event.target.value)} className="admin-input min-h-28" />
              </Field>
              <Field label="Locations, one per line">
                <textarea value={form.locations} onChange={(event) => updateField("locations", event.target.value)} className="admin-input min-h-24" />
              </Field>
              <Field label="Itinerary, one day per line as Title | Description">
                <textarea value={form.itinerary} onChange={(event) => updateField("itinerary", event.target.value)} className="admin-input min-h-36" />
              </Field>
              <Field label="Highlights, one per line">
                <textarea value={form.highlights} onChange={(event) => updateField("highlights", event.target.value)} className="admin-input min-h-24" />
              </Field>
              <Field label="Includes, one per line">
                <textarea value={form.includes} onChange={(event) => updateField("includes", event.target.value)} className="admin-input min-h-24" />
              </Field>
            </div>
          </section>
              </div>
            )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg"
    >
      <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-stone-900">{value}</p>
      <p className="mt-2 text-sm text-stone-500">{detail}</p>
    </motion.div>
  )
}

function ContentCard({ title, count, status, detail }: { title: string; count: number; status: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>
          <p className="mt-2 text-sm text-stone-500">{status}</p>
        </div>
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="rounded-2xl bg-amber-50 px-4 py-2 text-xl font-bold text-primary"
        >
          {count}
        </motion.span>
      </div>
      <p className="mt-5 text-sm text-stone-600">{detail}</p>
    </motion.div>
  )
}

function MetricRow({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl border border-stone-200 p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-stone-500">{label}</span>
        <span className="font-bold text-stone-900">{value}</span>
      </div>
      <p className="mt-2 truncate text-sm text-stone-600">{detail}</p>
    </motion.div>
  )
}

function ActivityRow({ title, detail }: { title: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl bg-stone-50 p-4"
    >
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="mt-1 text-sm text-stone-500">{detail}</p>
    </motion.div>
  )
}

function ToggleRow({ title, description, enabled = false }: { title: string; description: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 p-4">
      <div>
        <p className="font-semibold text-stone-900">{title}</p>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
      <span className={`h-7 w-12 rounded-full p-1 ${enabled ? "bg-primary" : "bg-stone-200"}`}>
        <motion.span
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="block h-5 w-5 rounded-full bg-white"
        />
      </span>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  )
}
