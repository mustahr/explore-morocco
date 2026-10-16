import type { Trip } from "./data"

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}
function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") return false
  const trip = value as Record<string, unknown>
  return ["id", "title", "description", "image", "category"].every((key) => typeof trip[key] === "string") && Boolean(trip.id)
    && ["duration", "price", "rating", "reviews"].every((key) => typeof trip[key] === "number" && Number.isFinite(trip[key]))
    && ["locations", "images", "highlights", "includes"].every((key) => stringArray(trip[key]))
    && Array.isArray(trip.itinerary) && trip.itinerary.every((day) => day && typeof day === "object" && typeof day.day === "number" && typeof day.title === "string" && typeof day.description === "string")
}

export async function fetchTrips(signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<Trip[]> {
  const response = await fetcher("/api/trips", { signal, cache: "no-store" })
  if (!response.ok) throw new Error("Trips are temporarily unavailable.")
  const data: unknown = await response.json()
  if (!data || typeof data !== "object" || !Array.isArray((data as { trips?: unknown }).trips)) throw new Error("Invalid trip response.")
  const trips = (data as { trips: unknown[] }).trips
  if (!trips.every(isTrip)) throw new Error("Invalid trip content.")
  return trips
}
