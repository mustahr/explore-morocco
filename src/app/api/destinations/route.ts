import { type Destination } from "@/lib/data"
import { createDestination, getDestinations } from "@/lib/destinations-db"

export const dynamic = "force-dynamic"

export async function GET() {
  const destinations = await getDestinations()
  return Response.json({ destinations })
}

export async function POST(request: Request) {
  const destination = (await request.json()) as Destination
  const createdDestination = await createDestination(destination)

  if (!createdDestination) {
    return Response.json({ error: "A destination with this slug already exists" }, { status: 409 })
  }

  return Response.json({ destination: createdDestination }, { status: 201 })
}
