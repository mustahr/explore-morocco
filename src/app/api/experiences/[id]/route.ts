import { type Experience } from "@/lib/data"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { deleteExperience, getExperienceById, getPublishedExperienceById, updateExperience } from "@/lib/experiences-db"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const experience = wantsAdminData && isAdminRequest(request) ? await getExperienceById(id) : await getPublishedExperienceById(id)

  if (!experience) {
    return Response.json({ error: "Experience not found" }, { status: 404 })
  }

  return Response.json({ experience })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const updates = (await request.json()) as Partial<Experience>
  const updatedExperience = await updateExperience(id, updates)

  if (!updatedExperience) {
    return Response.json({ error: "Experience not found" }, { status: 404 })
  }

  return Response.json({ experience: updatedExperience })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const deleted = await deleteExperience(id)

  if (!deleted) {
    return Response.json({ error: "Experience not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
