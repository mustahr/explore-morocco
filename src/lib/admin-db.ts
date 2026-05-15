import { readFile, writeFile } from "fs/promises"
import path from "path"

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type PaymentStatus = "unpaid" | "deposit" | "paid" | "refunded"
export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost"

export interface Booking {
  id: string
  tripId: string
  customerName: string
  customerEmail: string
  startDate: string
  travelers: number
  totalMAD: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  interest: string
  source: string
  status: LeadStatus
  createdAt: string
}

const bookingsPath = path.join(process.cwd(), "data", "bookings.json")
const leadsPath = path.join(process.cwd(), "data", "leads.json")

async function readJsonDatabase<T>(filePath: string): Promise<T[]> {
  const file = await readFile(filePath, "utf8")
  return JSON.parse(file) as T[]
}

async function writeJsonDatabase<T>(filePath: string, data: T[]) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

export async function getBookings() {
  return readJsonDatabase<Booking>(bookingsPath)
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  const bookings = await getBookings()
  const bookingIndex = bookings.findIndex((booking) => booking.id === id)

  if (bookingIndex === -1) return null

  const updatedBooking = { ...bookings[bookingIndex], ...updates, id }
  bookings[bookingIndex] = updatedBooking
  await writeJsonDatabase(bookingsPath, bookings)

  return updatedBooking
}

export async function deleteBooking(id: string) {
  const bookings = await getBookings()
  const filteredBookings = bookings.filter((booking) => booking.id !== id)

  if (filteredBookings.length === bookings.length) return false

  await writeJsonDatabase(bookingsPath, filteredBookings)
  return true
}

export async function getLeads() {
  return readJsonDatabase<Lead>(leadsPath)
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const leads = await getLeads()
  const leadIndex = leads.findIndex((lead) => lead.id === id)

  if (leadIndex === -1) return null

  const updatedLead = { ...leads[leadIndex], ...updates, id }
  leads[leadIndex] = updatedLead
  await writeJsonDatabase(leadsPath, leads)

  return updatedLead
}

export async function deleteLead(id: string) {
  const leads = await getLeads()
  const filteredLeads = leads.filter((lead) => lead.id !== id)

  if (filteredLeads.length === leads.length) return false

  await writeJsonDatabase(leadsPath, filteredLeads)
  return true
}
