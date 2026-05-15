import { readFile, writeFile } from "fs/promises"
import path from "path"
import { type Trip } from "@/lib/data"

const tripsDatabasePath = path.join(process.cwd(), "data", "trips.json")

async function readTripsDatabase(): Promise<Trip[]> {
  const file = await readFile(tripsDatabasePath, "utf8")
  return JSON.parse(file) as Trip[]
}

async function writeTripsDatabase(trips: Trip[]) {
  await writeFile(tripsDatabasePath, `${JSON.stringify(trips, null, 2)}\n`, "utf8")
}

export async function getTrips() {
  return readTripsDatabase()
}

export async function getTripById(id: string) {
  const trips = await readTripsDatabase()
  return trips.find((trip) => trip.id === id) ?? null
}

export async function getFeaturedTrips(limit = 6) {
  const trips = await readTripsDatabase()
  return trips.slice(0, limit)
}

export async function getRelatedTrips(id: string, limit = 3) {
  const trips = await readTripsDatabase()
  return trips.filter((trip) => trip.id !== id).slice(0, limit)
}

export async function createTrip(trip: Trip) {
  const trips = await readTripsDatabase()
  const existingTrip = trips.find((item) => item.id === trip.id)

  if (existingTrip) {
    return null
  }

  trips.push(trip)
  await writeTripsDatabase(trips)

  return trip
}

export async function updateTrip(id: string, updates: Partial<Trip>) {
  const trips = await readTripsDatabase()
  const tripIndex = trips.findIndex((trip) => trip.id === id)

  if (tripIndex === -1) {
    return null
  }

  const updatedTrip = {
    ...trips[tripIndex],
    ...updates,
    id: trips[tripIndex].id,
  }

  trips[tripIndex] = updatedTrip
  await writeTripsDatabase(trips)

  return updatedTrip
}

export async function deleteTrip(id: string) {
  const trips = await readTripsDatabase()
  const filteredTrips = trips.filter((trip) => trip.id !== id)

  if (filteredTrips.length === trips.length) {
    return false
  }

  await writeTripsDatabase(filteredTrips)
  return true
}
