import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedExperienceById, getPublishedExperiences, getRelatedExperiences } from "@/lib/experiences-db"
import ExperienceDetailClient from "./ExperienceDetailClient"
import { cleanImageList, experienceJsonLd } from "@/lib/seo"

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
    alternates: {
      canonical: `/experiences/${experience.id}`,
    },
    openGraph: {
      title: experience.seo?.title || experience.title,
      description: experience.seo?.description || experience.description,
      url: `/experiences/${experience.id}`,
      type: "website",
      images: cleanImageList([experience.seo?.image, experience.image]),
    },
    twitter: {
      card: "summary_large_image",
      title: experience.seo?.title || experience.title,
      description: experience.seo?.description || experience.description,
      images: cleanImageList([experience.seo?.image, experience.image]),
    },
  }
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getPublishedExperienceById(id)

  if (!experience) notFound()

  const relatedExperiences = await getRelatedExperiences(experience)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceJsonLd(experience)) }}
      />
      <ExperienceDetailClient experience={experience} relatedExperiences={relatedExperiences} />
    </>
  )
}
