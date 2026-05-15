import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { deleteTrip, getPublishedTripById, getTripById, updateTrip } from "@/lib/trips-db"
import { type Trip } from "@/lib/data"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const trip = wantsAdminData && isAdminRequest(request) ? await getTripById(id) : await getPublishedTripById(id)

  if (!trip) {
    return Response.json({ error: "Trip not found" }, { status: 404 })
  }

  return Response.json({ trip })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const updates = (await request.json()) as Partial<Trip>
  const updatedTrip = await updateTrip(id, updates)

  if (!updatedTrip) {
    return Response.json({ error: "Trip not found" }, { status: 404 })
  }

  return Response.json({ trip: updatedTrip })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const deleted = await deleteTrip(id)

  if (!deleted) {
    return Response.json({ error: "Trip not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
