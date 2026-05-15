import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedExperienceById, getPublishedExperiences, getRelatedExperiences } from "@/lib/experiences-db"
import ExperienceDetailClient from "./ExperienceDetailClient"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const experiences = await getPublishedExperiences()
  return experiences.map((experience) => ({ id: experience.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const experience = await getPublishedExperienceById(id)

  if (!experience) return {}

  return {
    title: experience.seo?.title || experience.title,
    description: experience.seo?.description || experience.description,
    openGraph: {
      title: experience.seo?.title || experience.title,
      description: experience.seo?.description || experience.description,
      images: [experience.seo?.image || experience.image],
    },
  }
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getPublishedExperienceById(id)

  if (!experience) notFound()

  const relatedExperiences = await getRelatedExperiences(experience)

  return <ExperienceDetailClient experience={experience} relatedExperiences={relatedExperiences} />
}
