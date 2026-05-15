import { readFile, writeFile } from "fs/promises"
import path from "path"
import { type Destination } from "@/lib/data"

const destinationsDatabasePath = path.join(process.cwd(), "data", "destinations.json")

async function readDestinationsDatabase(): Promise<Destination[]> {
  const file = await readFile(destinationsDatabasePath, "utf8")
  return JSON.parse(file) as Destination[]
}

async function writeDestinationsDatabase(destinations: Destination[]) {
  await writeFile(destinationsDatabasePath, `${JSON.stringify(destinations, null, 2)}\n`, "utf8")
}

export async function getDestinations() {
  return readDestinationsDatabase()
}

export async function getDestinationBySlug(slug: string) {
  const destinations = await readDestinationsDatabase()
  return destinations.find((destination) => destination.slug === slug) ?? null
}

export async function createDestination(destination: Destination) {
  const destinations = await readDestinationsDatabase()
  const existingDestination = destinations.find((item) => item.slug === destination.slug)

  if (existingDestination) {
    return null
  }

  destinations.push(destination)
  await writeDestinationsDatabase(destinations)

  return destination
}

export async function updateDestination(slug: string, updates: Partial<Destination>) {
  const destinations = await readDestinationsDatabase()
  const destinationIndex = destinations.findIndex((destination) => destination.slug === slug)

  if (destinationIndex === -1) {
    return null
  }

  const updatedDestination = {
    ...destinations[destinationIndex],
    ...updates,
    slug: destinations[destinationIndex].slug,
  }

  destinations[destinationIndex] = updatedDestination
  await writeDestinationsDatabase(destinations)

  return updatedDestination
}

export async function deleteDestination(slug: string) {
  const destinations = await readDestinationsDatabase()
  const filteredDestinations = destinations.filter((destination) => destination.slug !== slug)

  if (filteredDestinations.length === destinations.length) {
    return false
  }

  await writeDestinationsDatabase(filteredDestinations)
  return true
}
