export const CONTACT_EMAIL = "contact@dunexplore-morocco.com"
export const CONTACT_PHONE = "+212 608 731 353"
export const CONTACT_PHONE_HREF = "tel:+212608731353"
const WHATSAPP_NUMBER = "212608731353"
export const CONTACT_LOCATION = "Marrakech, Morocco"

export function contactEmailHref(message?: string) {
  const query = new URLSearchParams({ subject: "Morocco travel enquiry" })
  if (message) query.set("body", message)
  return `mailto:${CONTACT_EMAIL}?${query.toString()}`
}

export function contactWhatsAppHref(message?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`
}
