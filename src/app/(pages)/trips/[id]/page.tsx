import TripDetailClient from "./TripDetailClient"
import { notFound } from "next/navigation"
import { getRelatedTrips, getTripById } from "@/lib/trips-db"

export const dynamic = "force-dynamic"

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = await getTripById(id)
  if (!trip) notFound()
  const relatedTrips = await getRelatedTrips(id)

  return <TripDetailClient trip={trip} relatedTrips={relatedTrips} />
}
