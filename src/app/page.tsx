import { HeroSection } from "@/components/home/HeroSection"
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations"
import { FeaturedTrips } from "@/components/home/FeaturedTrips"
import { ExperiencesPreview } from "@/components/home/ExperiencesPreview"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { CTASection } from "@/components/home/CTASection"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      <FeaturedTrips />
      <ExperiencesPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
