import { type Experience } from "@/lib/data"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createExperience, getExperiences, getPublishedExperiences } from "@/lib/experiences-db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const experiences = wantsAdminData && isAdminRequest(request) ? await getExperiences() : await getPublishedExperiences()
  return Response.json({ experiences })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const experience = (await request.json()) as Experience
  const createdExperience = await createExperience(experience)

  if (!createdExperience) {
    return Response.json({ error: "An experience with this ID already exists" }, { status: 409 })
  }

  return Response.json({ experience: createdExperience }, { status: 201 })
}
