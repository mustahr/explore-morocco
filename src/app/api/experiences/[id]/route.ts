import { type Experience } from "@/lib/data"
import { deleteExperience, getExperienceById, updateExperience } from "@/lib/experiences-db"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience) {
    return Response.json({ error: "Experience not found" }, { status: 404 })
  }

  return Response.json({ experience })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params
  const updates = (await request.json()) as Partial<Experience>
  const updatedExperience = await updateExperience(id, updates)

  if (!updatedExperience) {
    return Response.json({ error: "Experience not found" }, { status: 404 })
  }

  return Response.json({ experience: updatedExperience })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const deleted = await deleteExperience(id)

  if (!deleted) {
    return Response.json({ error: "Experience not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
