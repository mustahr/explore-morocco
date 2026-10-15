import type { Metadata } from "next"
import { PolicyPage } from "@/components/layout/PolicyPage"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Information about trip planning, booking requests, pricing, and confirmation with Dunexplore Morocco.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return <PolicyPage title="Terms of Service" introduction="These terms explain how to use our travel website and what to expect when sending a trip or booking request." sections={[
    { title: "Website and travel information", text: "Dunexplore Morocco provides information about Moroccan destinations, trips, and experiences, along with tools for preparing a personalized itinerary. Website descriptions and suggested itineraries help you explore options; specific arrangements must be confirmed with our team." },
    { title: "Booking requests and confirmation", text: "Submitting a form sends a booking request. A request reference acknowledges receipt and does not confirm availability or a reservation. Our team will review your dates, traveler details, and requested services, then contact you about availability, the final itinerary, pricing, and payment instructions." },
    { title: "Prices and currency", text: "Displayed prices and itinerary totals are indicative until confirmed by our team. Currency conversions are provided for convenience. Before proceeding, ask our team to confirm the payment currency, total amount, inclusions, exclusions, and any additional charges." },
    { title: "Changes, cancellations, and refunds", text: "Ask our team for the cancellation, change, deposit, and refund conditions that apply to your selected trip before confirming or paying. Conditions can depend on the confirmed services and suppliers. This page does not establish a universal cancellation or refund entitlement for all trips." },
    { title: "Your request details", text: "Provide accurate contact information, dates, and traveler details so our team can respond. Let us know about travel requirements that may affect the proposed itinerary, and confirm that the final arrangements meet your needs before proceeding." },
    { title: "Using the website", text: "Use the website for genuine travel enquiries. Do not submit unlawful content, spam, or information belonging to another person without permission, and do not attempt to interfere with the website or access private administrative records." },
    { title: "External services and updates", text: "External links, including WhatsApp, open services operated by other providers. Their terms apply when you use them. Website information and these terms may be updated as our services change; contact our team if you need clarification about a specific request." },
  ]} />
}
