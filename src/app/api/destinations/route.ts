import { type Destination } from "@/lib/data"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createDestination, getDestinations, getPublishedDestinations } from "@/lib/destinations-db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const destinations = wantsAdminData && isAdminRequest(request) ? await getDestinations() : await getPublishedDestinations()
  return Response.json({ destinations })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const destination = (await request.json()) as Destination
  const createdDestination = await createDestination(destination)

  if (!createdDestination) {
    return Response.json({ error: "A destination with this slug already exists" }, { status: 409 })
  }

  return Response.json({ destination: createdDestination }, { status: 201 })
}
