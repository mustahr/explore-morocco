import type { Metadata } from "next"
import { PolicyPage } from "@/components/layout/PolicyPage"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dunexplore Morocco handles information shared through booking requests and enquiries.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return <PolicyPage title="Privacy Policy" introduction="This page explains how information is handled when you browse Dunexplore Morocco or contact our travel team." sections={[
    { title: "Information you share", text: "Booking and trip requests collect your name, email address, phone or WhatsApp number, preferred date, traveler count, and the travel preferences or notes you choose to provide. Contact forms collect your name, email address, subject, and message. Newsletter subscriptions store your email address, subscription time, and the consent given on the signup form. Please avoid including passport numbers, payment card details, or other sensitive information in these forms." },
    { title: "How information is used", text: "We use the details you submit to respond to enquiries, prepare itineraries, review availability, and follow up on booking requests. Requests are stored for our team to manage them. Email addresses and their sources may also be retained in our contact directory for follow-up; newsletter subscription and unsubscribe preferences are tracked separately. If you subscribe to the newsletter, we use your email to send travel inspiration and offers. Use the unsubscribe link in a newsletter or contact us to unsubscribe or request removal from the newsletter list. Contact details may also be used to send operational notifications related to your request." },
    { title: "Service providers", text: "The website uses Vercel for hosting and analytics, Neon Postgres for stored records, and Vercel Blob for uploaded images. Email and WhatsApp services may process request details when those notification channels are enabled. If you open a WhatsApp link or another external service, that provider’s own privacy terms apply." },
    { title: "Browser storage and analytics", text: "Your browser stores language, currency, and favorites locally. Favorites are also synchronized to our database with an anonymous browser identifier in a cookie lasting up to one year, so our team can see which trips, destinations, and experiences visitors save and when. Saving an item does not subscribe you to marketing or identify you by name or email. Removing a favorite removes its active database record. An administrative session cookie supports secure admin access. Vercel Analytics records website usage and selected interactions. You can clear local preferences and cookies in your browser settings." },
    { title: "Access, corrections, and removal requests", text: "Contact our team if you want to ask about information you submitted, correct an error, or request removal. Include enough detail to help us identify the request without sending sensitive documents. We may need to verify the request and explain whether any records must be retained for operational or applicable legal reasons." },
    { title: "Updates", text: "This page may change as website features and services change. The update date above identifies the latest version published here." },
  ]} />
}
