import { getBookings } from "@/lib/admin-db"

export const dynamic = "force-dynamic"

export async function GET() {
  const bookings = await getBookings()
  return Response.json({ bookings })
}
