import type { Metadata } from "next"
import TripDetailClient from "./TripDetailClient"
import { notFound } from "next/navigation"
import { getPublishedTripById, getRelatedTrips } from "@/lib/trips-db"
import { getTripDetailContent } from "@/lib/content-db"
import { cleanImageList, tripJsonLd } from "@/lib/seo"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const trip = await getPublishedTripById(id)

  if (!trip) return {}

  return {
    title: trip.seo?.title || trip.title,
    description: trip.seo?.description || trip.description,
    alternates: {
      canonical: `/trips/${trip.id}`,
    },
    openGraph: {
      title: trip.seo?.title || trip.title,
      description: trip.seo?.description || trip.description,
      url: `/trips/${trip.id}`,
      type: "website",
      images: cleanImageList([trip.seo?.image, trip.image]),
    },
    twitter: {
      card: "summary_large_image",
      title: trip.seo?.title || trip.title,
      description: trip.seo?.description || trip.description,
      images: cleanImageList([trip.seo?.image, trip.image]),
    },
  }
}

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = await getPublishedTripById(id)
  if (!trip) notFound()
  const [relatedTrips, detailContent] = await Promise.all([
    getRelatedTrips(id),
    getTripDetailContent(),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripJsonLd(trip)) }}
      />
      <TripDetailClient trip={trip} relatedTrips={relatedTrips} detailContent={detailContent} />
    </>
  )
}
