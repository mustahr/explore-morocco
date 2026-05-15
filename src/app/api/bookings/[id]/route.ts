import { deleteBooking, updateBooking, type Booking } from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const updates = (await request.json()) as Partial<Booking>
  const booking = await updateBooking(id, updates)

  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 })
  }

  return Response.json({ booking })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const deleted = await deleteBooking(id)

  if (!deleted) {
    return Response.json({ error: "Booking not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
