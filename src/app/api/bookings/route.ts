import { createBooking, getBookings } from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { notifyOperations } from "@/lib/notifications"
import { getPublishedTripById } from "@/lib/trips-db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const bookings = await getBookings()
  return Response.json({ bookings })
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    tripId?: string
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    startDate?: string
    travelers?: number
    notes?: string
  }

  const tripId = body.tripId?.trim()
  const customerName = body.customerName?.trim()
  const customerEmail = body.customerEmail?.trim()
  const customerPhone = body.customerPhone?.trim()
  const startDate = body.startDate?.trim()
  const travelers = Number(body.travelers)
  const notes = body.notes?.trim()

  if (!tripId || !customerName || !customerEmail || !startDate || !Number.isInteger(travelers) || travelers < 1 || travelers > 12) {
    return Response.json({ error: "Trip, name, email, date, and travelers are required." }, { status: 400 })
  }

  const selectedDate = new Date(`${startDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
    return Response.json({ error: "Please choose a valid future start date." }, { status: 400 })
  }

  const trip = await getPublishedTripById(tripId)

  if (!trip) {
    return Response.json({ error: "Trip not found." }, { status: 404 })
  }

  const booking = await createBooking({
    id: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    tripId,
    customerName,
    customerEmail,
    customerPhone,
    startDate,
    travelers,
    totalMAD: trip.price * travelers,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
    notes,
  })

  await notifyOperations({
    type: "booking",
    title: "New Saharavanta booking request",
    fields: {
      reference: booking.id,
      trip: trip.title,
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
      startDate: booking.startDate,
      travelers: booking.travelers,
      totalMAD: booking.totalMAD,
      notes: booking.notes,
    },
  })

  return Response.json({ booking }, { status: 201 })
}
