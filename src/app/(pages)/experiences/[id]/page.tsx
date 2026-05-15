import { notFound } from "next/navigation"
import { getExperienceById, getExperiences, getRelatedExperiences } from "@/lib/experiences-db"
import ExperienceDetailClient from "./ExperienceDetailClient"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const experiences = await getExperiences()
  return experiences.map((experience) => ({ id: experience.id }))
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience) notFound()

  const relatedExperiences = await getRelatedExperiences(experience)

  return <ExperienceDetailClient experience={experience} relatedExperiences={relatedExperiences} />
}
