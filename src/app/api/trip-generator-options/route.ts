import { getTripGeneratorOptions, updateTripGeneratorOptions, type TripGeneratorOptions } from "@/lib/content-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const options = await getTripGeneratorOptions()
  return Response.json({ options })
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const options = (await request.json()) as TripGeneratorOptions
  const updatedOptions = await updateTripGeneratorOptions(options)
  return Response.json({ options: updatedOptions })
}
