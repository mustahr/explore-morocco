import { getBookings } from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const bookings = await getBookings()
  return Response.json({ bookings })
}
