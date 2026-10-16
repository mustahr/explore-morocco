import { type Trip } from "@/lib/data"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createTrip, getPublishedTrips, getTrips } from "@/lib/trips-db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  try {
    const trips = wantsAdminData && isAdminRequest(request) ? await getTrips() : await getPublishedTrips()
    return Response.json({ trips }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return Response.json({ error: "Trips are temporarily unavailable. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const trip = (await request.json()) as Trip
  const createdTrip = await createTrip(trip)

  if (!createdTrip) {
    return Response.json({ error: "A trip with this ID already exists" }, { status: 409 })
  }

  return Response.json({ trip: createdTrip }, { status: 201 })
}
