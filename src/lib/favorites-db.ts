import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertLocalWritesAllowed, getCloudRecords } from "./cloud-db"
import { getDatabase, initializeDatabase, type DatabaseQuery } from "./postgres"
import { getPublishedTrips } from "./trips-db"
import { getPublishedDestinations } from "./destinations-db"
import { getPublishedExperiences } from "./experiences-db"
import type { FavoriteItem } from "./favorite-keys"

export type FavoriteRecord = FavoriteItem & { key: string; visitorId: string; title: string; href: string; createdAt: string }
const file = () => path.join(process.cwd(), "data", "favorites.json")
let localWrites: Promise<void> = Promise.resolve()

export async function getFavorites(): Promise<FavoriteRecord[]> {
  const cloud = await getCloudRecords<FavoriteRecord>("favorites")
  if (cloud) return cloud
  if (process.env.VERCEL) throw new Error("Database unavailable")
  try { return JSON.parse(await readFile(file(), "utf8")) } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
    throw error
  }
}
export async function favoriteCatalog() {
  const [trips, destinations, experiences] = await Promise.all([getPublishedTrips(), getPublishedDestinations(), getPublishedExperiences()])
  return new Map<string, { title: string; href: string }>([
    ...trips.map((item) => [`trip:${item.id}`, { title: item.title, href: `/trips/${item.id}` }] as const),
    ...destinations.map((item) => [`destination:${item.slug}`, { title: item.name, href: `/destinations/${item.slug}` }] as const),
    ...experiences.map((item) => [`experience:${item.id}`, { title: item.title, href: `/experiences/${item.id}` }] as const),
  ])
}
export function favoriteSyncQueries(visitorId: string, records: FavoriteRecord[]): DatabaseQuery[] {
  return [
    { text: "DELETE FROM content_records WHERE record_type = 'favorites' AND data->>'visitorId' = $1 AND NOT (record_key = ANY($2::text[]))", values: [visitorId, records.map((r) => r.key)] },
    { text: `INSERT INTO content_records (record_type, record_key, data, position)
        SELECT 'favorites', item.key, to_jsonb(item), 0 FROM jsonb_to_recordset($1::jsonb)
        AS item(key text, "visitorId" text, kind text, id text, title text, href text, "createdAt" text)
        ON CONFLICT (record_type, record_key) DO NOTHING`, values: [JSON.stringify(records)] },
  ]
}
export async function syncFavorites(visitorId: string, items: FavoriteItem[]) {
  const catalog = await favoriteCatalog()
  const records: FavoriteRecord[] = [...new Map(items.map((item) => [`${item.kind}:${item.id}`, item])).values()].flatMap((item) => {
    const content = catalog.get(`${item.kind}:${item.id}`)
    if (!content) return [] // Removed or unpublished content is never collected.
    return [{ ...item, ...content, visitorId, key: createHash("sha256").update(`${visitorId}:${item.kind}:${item.id}`).digest("hex"), createdAt: new Date().toISOString() }]
  })
  const sql = getDatabase()
  if (sql) {
    await initializeDatabase()
    await sql.transaction(favoriteSyncQueries(visitorId, records).map((query) => sql.query(query.text, query.values)))
  } else {
    assertLocalWritesAllowed()
    const write = localWrites.then(async () => {
      const existing = await getFavorites()
      const byKey = new Map(existing.map((record) => [record.key, record]))
      const next = [...existing.filter((record) => record.visitorId !== visitorId), ...records.map((record) => byKey.get(record.key) ?? record)]
      await mkdir(path.dirname(file()), { recursive: true })
      await writeFile(file(), JSON.stringify(next, null, 2) + "\n")
    })
    localWrites = write.catch(() => {})
    await write
  }
  return records.length
}
