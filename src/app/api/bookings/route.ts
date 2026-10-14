import { formatMoroccoDateTime } from "@/lib/record-timestamps"
import { isCloudDatabaseConfigured } from "@/lib/cloud-db"
import { createBooking, getBookings } from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { notifyOperations } from "@/lib/notifications"
import { getPublishedDestinationBySlug } from "@/lib/destinations-db"
import { getPublishedExperienceById } from "@/lib/experiences-db"
import { sendBookingWhatsApp } from "@/lib/whatsapp-notifications"
import { getPublishedTripById } from "@/lib/trips-db"
import { sendAdminPushNotification } from "@/lib/admin-push"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const bookings = await getBookings()
  return Response.json({ bookings })
}

export async function POST(request: Request) {
  if (process.env.VERCEL && !isCloudDatabaseConfigured()) {
    return Response.json({ error: "Online requests are temporarily unavailable. Please contact us directly." }, { status: 503 })
  }

  const body = (await request.json()) as {
    tripId?: string
    destinationSlug?: string
    experienceId?: string
    itineraryIndex?: number
    customTripTitle?: string
    totalMAD?: number
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    startDate?: string
    travelers?: number
    notes?: string
  }

  const destinationSlug = body.destinationSlug?.trim()
  const experienceId = body.experienceId?.trim()
  const tripId = destinationSlug ? `destination:${destinationSlug}` : experienceId ? `experience:${experienceId}` : body.tripId?.trim()
  const customTripTitle = body.customTripTitle?.trim()
  const customerName = body.customerName?.trim()
  const customerEmail = body.customerEmail?.trim()
  const customerPhone = body.customerPhone?.trim()
  const startDate = body.startDate?.trim()
  const travelers = Number(body.travelers)
  const customTotalMAD = Number(body.totalMAD)
  const notes = body.notes?.trim()

  if (!tripId || !customerName || !customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || !startDate || !Number.isInteger(travelers) || travelers < 1 || travelers > 12) {
    return Response.json({ error: "Trip, name, email, date, and travelers are required." }, { status: 400 })
  }

  const selectedDate = new Date(`${startDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
    return Response.json({ error: "Please choose a valid future start date." }, { status: 400 })
  }

  const trip = !destinationSlug && !experienceId ? await getPublishedTripById(tripId) : null
  const destination = destinationSlug ? await getPublishedDestinationBySlug(destinationSlug) : null
  const experience = experienceId ? await getPublishedExperienceById(experienceId) : null
  const isCustomGeneratedTrip = !destinationSlug && !experienceId && tripId.startsWith("custom-ai-trip") && customTripTitle
  if (!trip && !destination && !experience && !isCustomGeneratedTrip) return Response.json({ error: "The selected trip or destination is unavailable." }, { status: 404 })
  const itinerary = destination && Number.isInteger(body.itineraryIndex) ? destination.itineraries[body.itineraryIndex!] : undefined
  const bookingTotalMAD = trip ? trip.price * travelers : experience ? experience.price * travelers : itinerary ? itinerary.price * travelers : isCustomGeneratedTrip ? Math.max(0, Math.round(customTotalMAD || 0)) : 0
  const bookingTripTitle = trip?.title || experience?.title || (destination ? `${destination.name}${itinerary ? ` — ${itinerary.title}` : " — custom trip request"}` : customTripTitle) || tripId

  const booking = await createBooking({
    id: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    tripId,
    tripTitle: bookingTripTitle,
    destinationSlug,
    experienceId,
    customerName,
    customerEmail,
    customerPhone,
    startDate,
    travelers,
    totalMAD: bookingTotalMAD,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
    notes,
  })

  const emailNotification = await notifyOperations({
    type: "booking",
    title: "New Dunexplore Morocco booking request",
    fields: {
      reference: booking.id,
      createdAt: `${formatMoroccoDateTime(booking.createdAt)} (Morocco)`,
      trip: bookingTripTitle,
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
      startDate: booking.startDate,
      travelers: booking.travelers,
      totalMAD: booking.totalMAD,
      notes: booking.notes,
    },
  })

  await sendAdminPushNotification({
    title: `New booking: ${booking.customerName}`,
    body: `${bookingTripTitle} - ${booking.travelers} travelers - ${booking.startDate}`,
    url: "/admin",
    tag: booking.id,
  }).catch(() => { console.error("Booking push notification failed") })

  const whatsappNotification = await sendBookingWhatsApp(booking)
  if (whatsappNotification.status === "failed") console.error(whatsappNotification.message)
  return Response.json({ booking, notifications: { email: emailNotification.status, whatsapp: whatsappNotification.status } }, { status: 201 })
}
