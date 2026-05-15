import { HeroSection } from "@/components/home/HeroSection"
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations"
import { FeaturedTrips } from "@/components/home/FeaturedTrips"
import { ExperiencesPreview } from "@/components/home/ExperiencesPreview"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { CTASection } from "@/components/home/CTASection"
import { getPublishedDestinations } from "@/lib/destinations-db"
import { connection } from "next/server"

export default async function Home() {
  await connection()
  const destinations = await getPublishedDestinations()

  return (
    <>
      <HeroSection />
      <FeaturedDestinations destinations={destinations} />
      <FeaturedTrips />
      <ExperiencesPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
