import { type Trip } from "@/lib/data"
import { createTrip, getTrips } from "@/lib/trips-db"

export const dynamic = "force-dynamic"

export async function GET() {
  const trips = await getTrips()
  return Response.json({ trips })
}

export async function POST(request: Request) {
  const trip = (await request.json()) as Trip
  const createdTrip = await createTrip(trip)

  if (!createdTrip) {
    return Response.json({ error: "A trip with this ID already exists" }, { status: 409 })
  }

  return Response.json({ trip: createdTrip }, { status: 201 })
}
