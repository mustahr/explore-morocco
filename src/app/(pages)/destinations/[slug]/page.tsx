import { notFound } from "next/navigation"
import { getDestinationBySlug, getDestinations } from "@/lib/destinations-db"
import DestinationDetailClient from "./DestinationDetailClient"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const destinations = await getDestinations()
  return destinations.map((dest) => ({ slug: dest.slug }))
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const destination = await getDestinationBySlug(resolvedParams.slug)

  if (!destination) notFound()

  return <DestinationDetailClient destination={destination} />
}
