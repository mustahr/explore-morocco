import { type Experience } from "@/lib/data"
import { createExperience, getExperiences } from "@/lib/experiences-db"

export const dynamic = "force-dynamic"

export async function GET() {
  const experiences = await getExperiences()
  return Response.json({ experiences })
}

export async function POST(request: Request) {
  const experience = (await request.json()) as Experience
  const createdExperience = await createExperience(experience)

  if (!createdExperience) {
    return Response.json({ error: "An experience with this ID already exists" }, { status: 409 })
  }

  return Response.json({ experience: createdExperience }, { status: 201 })
}
