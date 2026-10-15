import { createHash, createHmac, timingSafeEqual, randomUUID } from "node:crypto"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { getBookings, getLeads } from "./admin-db"
import { getCloudRecords, upsertCloudRecord, assertLocalWritesAllowed } from "./cloud-db"
import { CONTACT_EMAIL } from "./contact"
import { getSiteUrl } from "./site"
import { renderCampaignEmail, type CampaignDesign } from "./email-template"

export interface EmailContact { id: string; email: string; name: string; sources: string[]; firstSeen: string; lastSeen: string; subscribed: boolean; unsubscribed: boolean }
export interface Campaign { design?: CampaignDesign; id: string; subject: string; message: string; audience: "subscribers" | "all" | "single"; recipients: string[]; createdAt: string; batches: Record<string, { count: number; acceptedAt: string }>; status: "draft" | "sending" | "complete"; lastError?: string }
interface Preference { id: string; email: string; subscribed: boolean; unsubscribed: boolean; updatedAt: string }
export const emailValid = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const contactId = (email: string) => createHash("sha256").update(email.trim().toLowerCase()).digest("hex")

export async function marketingRecords<T>(type: string): Promise<T[]> {
  const cloud = await getCloudRecords<T>(type)
  if (cloud !== undefined) return cloud
  assertLocalWritesAllowed()
  try { return JSON.parse(await readFile(path.join(process.cwd(), "data", `${type}.json`), "utf8")) } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
    throw error
  }
}
export async function saveMarketingRecord<T extends { id: string }>(type: string, record: T) {
  if (await upsertCloudRecord(type, record.id, record) !== undefined) return
  const records = await marketingRecords<T>(type)
  const filtered = records.filter((item) => item.id !== record.id)
  await mkdir(path.join(process.cwd(), "data"), { recursive: true })
  await writeFile(path.join(process.cwd(), "data", `${type}.json`), JSON.stringify([record, ...filtered], null, 2))
}

export async function emailAudience(): Promise<EmailContact[]> {
  const [bookings, leads, stored, preferences] = await Promise.all([getBookings(), getLeads(), marketingRecords<EmailContact>("email_contacts"), marketingRecords<Preference>("email_preferences")])
  const contacts = new Map(stored.map((contact) => [contact.email, { ...contact, sources: [...contact.sources] }]))
  function add(raw: string, name: string, source: string, date: string, subscribed = false) {
    const email = raw.trim().toLowerCase()
    if (!emailValid(email)) return
    const seen = Number.isFinite(Date.parse(date)) ? date : new Date().toISOString()
    const previous = contacts.get(email)
    if (previous) {
      if (!previous.sources.includes(source)) previous.sources.push(source)
      if (seen < previous.firstSeen) previous.firstSeen = seen
      if (seen > previous.lastSeen) previous.lastSeen = seen
      previous.subscribed ||= subscribed
      if (!previous.name || previous.name === "Newsletter subscriber") previous.name = name
    } else contacts.set(email, { id: contactId(email), email, name, sources: [source], firstSeen: seen, lastSeen: seen, subscribed, unsubscribed: false })
  }
  bookings.forEach((booking) => add(booking.customerEmail, booking.customerName, "Booking", booking.createdAt))
  leads.forEach((lead) => add(lead.email, lead.name, lead.source === "Website newsletter" ? "Newsletter" : "Message / enquiry", lead.createdAt, lead.source === "Website newsletter"))
  const old = new Map(stored.map((contact) => [contact.id, JSON.stringify(contact)]))
  // Keep a durable audience even if the original enquiry is later removed.
  for (const contact of contacts.values()) {
    if (old.get(contact.id) !== JSON.stringify(contact)) await saveMarketingRecord("email_contacts", contact)
  }
  const prefs = new Map(preferences.map((preference) => [preference.email, preference]))
  return [...contacts.values()].map((contact) => {
    const pref = prefs.get(contact.email)
    return { ...contact, subscribed: pref?.subscribed ?? contact.subscribed, unsubscribed: pref?.unsubscribed ?? false }
  }).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
}
export async function setEmailPreference(email: string, subscribed: boolean, unsubscribed: boolean) {
  await saveMarketingRecord<Preference>("email_preferences", { id: contactId(email), email, subscribed, unsubscribed, updatedAt: new Date().toISOString() })
}
function unsubscribeSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) throw new Error("Configure ADMIN_SESSION_SECRET before sending campaigns.")
  return secret
}
export function unsubscribeToken(email: string) {
  const encoded = Buffer.from(email).toString("base64url")
  return `${encoded}.${createHmac("sha256", unsubscribeSecret()).update(`unsubscribe:${encoded}`).digest("hex")}`
}
export function unsubscribeEmail(token: string) {
  const [encoded, signature] = token.split(".")
  if (!encoded || !signature || signature.length !== 64) return null
  const email = Buffer.from(encoded, "base64url").toString("utf8")
  if (!emailValid(email)) return null
  const expected = unsubscribeToken(email).split(".")[1]
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? email : null
}
export function campaignPayload(subject: string, message: string, email: string, design: CampaignDesign = {}) {
  const unsubscribe = `${getSiteUrl()}/unsubscribe?token=${encodeURIComponent(unsubscribeToken(email))}`
  return {
    from: process.env.NOTIFICATION_EMAIL_FROM?.trim() || "Dunexplore Morocco <notifications@dunexplore-morocco.com>",
    to: [email], reply_to: CONTACT_EMAIL, subject,
    text: `${message}\n\n${design.buttonLabel || "Explore Morocco"}: ${design.buttonUrl || `${getSiteUrl()}/trips`}\n\nDunexplore Morocco · Marrakech, Morocco\n${CONTACT_EMAIL}\nUnsubscribe: ${unsubscribe}`,
    html: renderCampaignEmail(subject, message, getSiteUrl(), unsubscribe, design),
    headers: { "List-Unsubscribe": `<${unsubscribe}>` },
  }
}
export async function sendCampaignBatch(campaign: Campaign, index: number) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) throw new Error("RESEND_API_KEY is missing. Add it to Vercel Production and redeploy.")
  if (campaign.batches[String(index)]) return campaign
  if (Date.now() - Date.parse(campaign.createdAt) > 23 * 60 * 60 * 1000) throw new Error("This campaign is over 23 hours old. Create a new campaign to continue safely.")
  const [preferences] = await Promise.all([marketingRecords<Preference>("email_preferences")])
  const suppressed = new Set(preferences.filter((item) => item.unsubscribed).map((item) => item.email))
  const recipients = campaign.recipients.slice(index * 100, (index + 1) * 100).filter((email) => !suppressed.has(email))
  if (!recipients.length) {
    campaign.batches[String(index)] = { count: 0, acceptedAt: new Date().toISOString() }
  } else {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `${campaign.id}/${index}` },
      body: JSON.stringify(recipients.map((email) => campaignPayload(campaign.subject, campaign.message, email, campaign.design))), signal: AbortSignal.timeout(20000),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || !Array.isArray(result?.data) || result.data.length !== recipients.length || result.data.some((item: { id?: string }) => !item.id)) {
      throw new Error(`Email provider did not accept this batch (HTTP ${response.status}). Check Resend logs, sender verification, and account limits before retrying.`)
    }
    campaign.batches[String(index)] = { count: recipients.length, acceptedAt: new Date().toISOString() }
  }
  campaign.status = Object.keys(campaign.batches).length >= Math.ceil(campaign.recipients.length / 100) ? "complete" : "sending"
  delete campaign.lastError
  await saveMarketingRecord("email_campaigns", campaign)
  return campaign
}
export function newCampaign(subject: string, message: string, audience: "subscribers" | "all" | "single", recipients: string[], design: CampaignDesign = {}): Campaign {
  return { id: randomUUID(), subject, message, audience, recipients, design, createdAt: new Date().toISOString(), batches: {}, status: "draft" }
}
