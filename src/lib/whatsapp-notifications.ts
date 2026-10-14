import { CONTACT_PHONE } from "./contact"
export type WhatsAppBooking = { id: string; tripTitle?: string; tripId: string; customerName: string; customerEmail: string; customerPhone?: string; startDate: string; travelers: number; notes?: string }
export function missingWhatsAppSettings() {
  return ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_BOOKING_TEMPLATE", "WHATSAPP_API_VERSION"].filter((name) => !process.env[name]?.trim())
}
export async function sendBookingWhatsApp(booking: WhatsAppBooking): Promise<{ status: "sent" | "failed" | "skipped"; message: string }> {
  const missing = missingWhatsAppSettings()
  if (missing.length) return { status: "skipped", message: `Missing WhatsApp settings: ${missing.join(", ")}.` }
  const version = process.env.WHATSAPP_API_VERSION!.trim()
  const sender = process.env.WHATSAPP_PHONE_NUMBER_ID!.trim()
  if (!/^v\d+\.\d+$/.test(version) || !/^\d+$/.test(sender)) return { status: "failed", message: "Check the WhatsApp API version and sender phone number ID." }
  const summary = [`Reference: ${booking.id}`, `Trip: ${booking.tripTitle || booking.tripId}`, `Client: ${booking.customerName}`, `Email: ${booking.customerEmail}`, `Phone: ${booking.customerPhone || "Not provided"}`, `Date: ${booking.startDate}`, `Travelers: ${booking.travelers}`, booking.notes || ""].join(" | ").replace(/\s+/g, " ").slice(0, 1000)
  try {
    const response = await fetch(`https://graph.facebook.com/${version}/${sender}/messages`, {
      method: "POST", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN!.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: (process.env.WHATSAPP_NOTIFICATION_TO || CONTACT_PHONE).replace(/\D/g, ""), type: "template", template: { name: process.env.WHATSAPP_BOOKING_TEMPLATE!.trim(), language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || "en" }, components: [{ type: "body", parameters: [{ type: "text", text: summary }] }] } }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || !data?.messages?.[0]?.id) return { status: "failed", message: `WhatsApp rejected the notification (HTTP ${response.status}). Check the access token, approved template, recipient eligibility, and API version in Meta.` }
    return { status: "sent", message: "WhatsApp accepted the notification. Check WhatsApp delivery status in Meta." }
  } catch { return { status: "failed", message: "Could not reach WhatsApp. The booking remains saved in admin." } }
}
