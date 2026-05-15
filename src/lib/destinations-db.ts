import { readFile, writeFile } from "fs/promises"
import path from "path"
import { isPublished, type Destination } from "@/lib/data"
import { deleteCloudRecord, getCloudRecord, getCloudRecords, replaceCloudRecords, upsertCloudRecord } from "@/lib/cloud-db"

const destinationsDatabasePath = path.join(process.cwd(), "data", "destinations.json")
const recordType = "destinations"

async function readDestinationsDatabase(): Promise<Destination[]> {
  const file = await readFile(destinationsDatabasePath, "utf8")
  return JSON.parse(file) as Destination[]
}

async function writeDestinationsDatabase(destinations: Destination[]) {
  await writeFile(destinationsDatabasePath, `${JSON.stringify(destinations, null, 2)}\n`, "utf8")
}

export async function getDestinations() {
  return (await getCloudRecords<Destination>(recordType)) ?? readDestinationsDatabase()
}

export async function getPublishedDestinations() {
  const destinations = await getDestinations()
  return destinations.filter(isPublished)
}

export async function getDestinationBySlug(slug: string) {
  const cloudDestination = await getCloudRecord<Destination>(recordType, slug)
  if (cloudDestination !== undefined) return cloudDestination

  const destinations = await readDestinationsDatabase()
  return destinations.find((destination) => destination.slug === slug) ?? null
}

export async function getPublishedDestinationBySlug(slug: string) {
  const destination = await getDestinationBySlug(slug)
  return destination && isPublished(destination) ? destination : null
}

export async function createDestination(destination: Destination) {
  const cloudDestinations = await getCloudRecords<Destination>(recordType)
  if (cloudDestinations !== undefined) {
    if (cloudDestinations.some((item) => item.slug === destination.slug)) return null
    await upsertCloudRecord(recordType, destination.slug, destination, cloudDestinations.length)
    return destination
  }

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
  const cloudDestination = await getCloudRecord<Destination>(recordType, slug)
  if (cloudDestination !== undefined) {
    if (!cloudDestination) return null
    const updatedDestination = { ...cloudDestination, ...updates, slug }
    await upsertCloudRecord(recordType, slug, updatedDestination)
    return updatedDestination
  }

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
  const cloudDestinations = await getCloudRecords<Destination>(recordType)
  if (cloudDestinations !== undefined) {
    if (!cloudDestinations.some((destination) => destination.slug === slug)) return false
    await deleteCloudRecord(recordType, slug)
    return true
  }

  const destinations = await readDestinationsDatabase()
  const filteredDestinations = destinations.filter((destination) => destination.slug !== slug)

  if (filteredDestinations.length === destinations.length) {
    return false
  }

  await writeDestinationsDatabase(filteredDestinations)
  return true
}

export async function replaceDestinations(destinations: Destination[]) {
  await replaceCloudRecords(recordType, destinations.map((destination) => ({ key: destination.slug, data: destination as unknown as Record<string, unknown> })))
  return destinations
}
