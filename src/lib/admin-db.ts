import { readFile, writeFile } from "fs/promises"
import path from "path"
import { deleteCloudRecord, getCloudRecord, getCloudRecords, replaceCloudRecords, upsertCloudRecord } from "@/lib/cloud-db"

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type PaymentStatus = "unpaid" | "deposit" | "paid" | "refunded"
export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost"

export interface AdminPushSubscription {
  id: string
  endpoint: string
  subscription: PushSubscriptionJSON
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  tripId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  startDate: string
  travelers: number
  totalMAD: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  createdAt: string
  notes?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  interest: string
  message?: string
  source: string
  status: LeadStatus
  createdAt: string
}

const bookingsPath = path.join(process.cwd(), "data", "bookings.json")
const leadsPath = path.join(process.cwd(), "data", "leads.json")
const pushSubscriptionsPath = path.join(process.cwd(), "data", "push-subscriptions.json")

async function readJsonDatabase<T>(filePath: string): Promise<T[]> {
  const file = await readFile(filePath, "utf8")
  return JSON.parse(file) as T[]
}

async function writeJsonDatabase<T>(filePath: string, data: T[]) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

export async function getBookings() {
  const bookings = (await getCloudRecords<Booking>("bookings")) ?? await readJsonDatabase<Booking>(bookingsPath)
  return [...bookings].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
}

export async function createBooking(booking: Booking) {
  const cloudBookings = await getCloudRecords<Booking>("bookings")
  if (cloudBookings !== undefined) {
    await upsertCloudRecord("bookings", booking.id, booking, cloudBookings.length)
    return booking
  }

  const bookings = await getBookings()
  bookings.unshift(booking)
  await writeJsonDatabase(bookingsPath, bookings)
  return booking
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  const cloudBooking = await getCloudRecord<Booking>("bookings", id)
  if (cloudBooking !== undefined) {
    if (!cloudBooking) return null
    const updatedBooking = { ...cloudBooking, ...updates, id }
    await upsertCloudRecord("bookings", id, updatedBooking)
    return updatedBooking
  }

  const bookings = await getBookings()
  const bookingIndex = bookings.findIndex((booking) => booking.id === id)

  if (bookingIndex === -1) return null

  const updatedBooking = { ...bookings[bookingIndex], ...updates, id }
  bookings[bookingIndex] = updatedBooking
  await writeJsonDatabase(bookingsPath, bookings)

  return updatedBooking
}

export async function deleteBooking(id: string) {
  const cloudBookings = await getCloudRecords<Booking>("bookings")
  if (cloudBookings !== undefined) {
    if (!cloudBookings.some((booking) => booking.id === id)) return false
    await deleteCloudRecord("bookings", id)
    return true
  }

  const bookings = await getBookings()
  const filteredBookings = bookings.filter((booking) => booking.id !== id)

  if (filteredBookings.length === bookings.length) return false

  await writeJsonDatabase(bookingsPath, filteredBookings)
  return true
}

export async function getLeads() {
  return (await getCloudRecords<Lead>("leads")) ?? readJsonDatabase<Lead>(leadsPath)
}

export async function createLead(lead: Lead) {
  const cloudLeads = await getCloudRecords<Lead>("leads")
  if (cloudLeads !== undefined) {
    await upsertCloudRecord("leads", lead.id, lead, cloudLeads.length)
    return lead
  }

  const leads = await getLeads()
  leads.unshift(lead)
  await writeJsonDatabase(leadsPath, leads)
  return lead
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const cloudLead = await getCloudRecord<Lead>("leads", id)
  if (cloudLead !== undefined) {
    if (!cloudLead) return null
    const updatedLead = { ...cloudLead, ...updates, id }
    await upsertCloudRecord("leads", id, updatedLead)
    return updatedLead
  }

  const leads = await getLeads()
  const leadIndex = leads.findIndex((lead) => lead.id === id)

  if (leadIndex === -1) return null

  const updatedLead = { ...leads[leadIndex], ...updates, id }
  leads[leadIndex] = updatedLead
  await writeJsonDatabase(leadsPath, leads)

  return updatedLead
}

export async function deleteLead(id: string) {
  const cloudLeads = await getCloudRecords<Lead>("leads")
  if (cloudLeads !== undefined) {
    if (!cloudLeads.some((lead) => lead.id === id)) return false
    await deleteCloudRecord("leads", id)
    return true
  }

  const leads = await getLeads()
  const filteredLeads = leads.filter((lead) => lead.id !== id)

  if (filteredLeads.length === leads.length) return false

  await writeJsonDatabase(leadsPath, filteredLeads)
  return true
}

export async function replaceBookings(bookings: Booking[]) {
  await replaceCloudRecords("bookings", bookings.map((booking) => ({ key: booking.id, data: booking as unknown as Record<string, unknown> })))
  return bookings
}

export async function replaceLeads(leads: Lead[]) {
  await replaceCloudRecords("leads", leads.map((lead) => ({ key: lead.id, data: lead as unknown as Record<string, unknown> })))
  return leads
}

export async function getAdminPushSubscriptions() {
  const cloudSubscriptions = await getCloudRecords<AdminPushSubscription>("admin_push_subscriptions")
  if (cloudSubscriptions !== undefined) return cloudSubscriptions

  try {
    return await readJsonDatabase<AdminPushSubscription>(pushSubscriptionsPath)
  } catch {
    return []
  }
}

export async function upsertAdminPushSubscription(subscription: PushSubscriptionJSON) {
  if (!subscription.endpoint) throw new Error("Push subscription endpoint is required.")

  const now = new Date().toISOString()
  const id = Buffer.from(subscription.endpoint).toString("base64url")
  const record: AdminPushSubscription = {
    id,
    endpoint: subscription.endpoint,
    subscription,
    createdAt: now,
    updatedAt: now,
  }
  const cloudSubscriptions = await getCloudRecords<AdminPushSubscription>("admin_push_subscriptions")

  if (cloudSubscriptions !== undefined) {
    const existing = cloudSubscriptions.find((item) => item.endpoint === subscription.endpoint)
    await upsertCloudRecord("admin_push_subscriptions", id, {
      ...record,
      createdAt: existing?.createdAt ?? record.createdAt,
    })
    return record
  }

  const subscriptions = await getAdminPushSubscriptions()
  const existingIndex = subscriptions.findIndex((item) => item.endpoint === subscription.endpoint)

  if (existingIndex >= 0) {
    subscriptions[existingIndex] = {
      ...record,
      createdAt: subscriptions[existingIndex].createdAt,
    }
  } else {
    subscriptions.unshift(record)
  }

  await writeJsonDatabase(pushSubscriptionsPath, subscriptions)
  return record
}

export async function deleteAdminPushSubscription(endpoint: string) {
  const id = Buffer.from(endpoint).toString("base64url")
  const cloudSubscriptions = await getCloudRecords<AdminPushSubscription>("admin_push_subscriptions")

  if (cloudSubscriptions !== undefined) {
    await deleteCloudRecord("admin_push_subscriptions", id)
    return true
  }

  const subscriptions = await getAdminPushSubscriptions()
  await writeJsonDatabase(
    pushSubscriptionsPath,
    subscriptions.filter((item) => item.endpoint !== endpoint),
  )
  return true
}
