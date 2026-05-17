import { createGuide, getGuides, getPublishedGuides, type Guide } from "@/lib/content-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const guides = wantsAdminData && isAdminRequest(request) ? await getGuides() : await getPublishedGuides()
  return Response.json({ guides })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const guide = (await request.json()) as Guide
  const createdGuide = await createGuide(guide)

  if (!createdGuide) {
    return Response.json({ error: "Guide already exists" }, { status: 409 })
  }

  return Response.json({ guide: createdGuide }, { status: 201 })
}
