export const CONTACT_EMAIL = "contact@dunexplore-morocco.com"
export const CONTACT_LOCATION = "Marrakech, Morocco"

export function contactEmailHref(message?: string) {
  const query = new URLSearchParams({ subject: "Morocco travel enquiry" })
  if (message) query.set("body", message)
  return `mailto:${CONTACT_EMAIL}?${query.toString()}`
}
