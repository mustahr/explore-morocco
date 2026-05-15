import type { Metadata } from "next"
import TripDetailClient from "./TripDetailClient"
import { notFound } from "next/navigation"
import { getPublishedTripById, getRelatedTrips } from "@/lib/trips-db"
import { getTripDetailContent } from "@/lib/content-db"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const trip = await getPublishedTripById(id)

  if (!trip) return {}

  return {
    title: trip.seo?.title || trip.title,
    description: trip.seo?.description || trip.description,
    openGraph: {
      title: trip.seo?.title || trip.title,
      description: trip.seo?.description || trip.description,
      images: [trip.seo?.image || trip.image],
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

  return <TripDetailClient trip={trip} relatedTrips={relatedTrips} detailContent={detailContent} />
}
