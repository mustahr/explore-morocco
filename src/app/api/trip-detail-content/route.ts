import { getTripDetailContent, updateTripDetailContent, type TripDetailContent } from "@/lib/content-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const content = await getTripDetailContent()
  return Response.json({ content })
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const content = (await request.json()) as TripDetailContent
  const updatedContent = await updateTripDetailContent(content)
  return Response.json({ content: updatedContent })
}
