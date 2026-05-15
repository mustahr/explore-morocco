import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedDestinationBySlug, getPublishedDestinations } from "@/lib/destinations-db"
import DestinationDetailClient from "./DestinationDetailClient"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const destinations = await getPublishedDestinations()
  return destinations.map((dest) => ({ slug: dest.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const destination = await getPublishedDestinationBySlug(slug)

  if (!destination) return {}

  return {
    title: destination.seo?.title || destination.name,
    description: destination.seo?.description || destination.description,
    openGraph: {
      title: destination.seo?.title || destination.name,
      description: destination.seo?.description || destination.description,
      images: [destination.seo?.image || destination.image],
    },
  }
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const destination = await getPublishedDestinationBySlug(resolvedParams.slug)

  if (!destination) notFound()

  return <DestinationDetailClient destination={destination} />
}
