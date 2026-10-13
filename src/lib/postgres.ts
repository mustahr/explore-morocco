import { neon } from "@neondatabase/serverless"
import trips from "../../data/trips.json"
import destinations from "../../data/destinations.json"
import experiences from "../../data/experiences.json"
import posts from "../../data/blog-posts.json"
import testimonials from "../../data/testimonials.json"
import guides from "../../data/guides.json"
import generatorOptions from "../../data/trip-generator-options.json"
import detailContent from "../../data/trip-detail-content.json"

export type DatabaseQuery = { text: string; values: unknown[] }
type SeedRecord = { record_type: string; record_key: string; data: unknown; position: number }

export function getDatabaseUrl() {
  return (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim()
}

export function getDatabase() {
  const url = getDatabaseUrl()
  if (!url) return null
  return neon(url, { fetchOptions: { signal: AbortSignal.timeout(15000) } })
}

export function seedRecords(): SeedRecord[] {
  const records: SeedRecord[] = []
  const add = (type: string, items: unknown[], key: string) => {
    items.forEach((item, position) => records.push({
      record_type: type,
      record_key: String((item as Record<string, unknown>)[key]),
      data: item,
      position,
    }))
  }
  add("trips", trips, "id")
  add("destinations", destinations, "slug")
  add("experiences", experiences, "id")
  add("blog_posts", posts, "slug")
  add("testimonials", testimonials, "id")
  add("guides", guides, "id")
  records.push(
    { record_type: "site_settings", record_key: "trip_generator_options", data: generatorOptions, position: 0 },
    { record_type: "site_settings", record_key: "trip_detail_content", data: detailContent, position: 1 },
  )
  // Sample bookings and leads are intentionally excluded from a new production database.
  return records
}

export function initializationQueries(): DatabaseQuery[] {
  return [
    { text: "SELECT pg_advisory_xact_lock(7136421)", values: [] },
    { text: `CREATE TABLE IF NOT EXISTS content_records (
      record_type text NOT NULL, record_key text NOT NULL, data jsonb NOT NULL,
      position integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (record_type, record_key))`, values: [] },
    { text: "CREATE INDEX IF NOT EXISTS content_records_type_position_idx ON content_records (record_type, position)", values: [] },
    { text: "CREATE TABLE IF NOT EXISTS app_metadata (key text PRIMARY KEY, value jsonb NOT NULL)", values: [] },
    { text: `INSERT INTO content_records (record_type, record_key, data, position)
      SELECT seed.record_type, seed.record_key, seed.data, seed.position
      FROM jsonb_to_recordset($1::jsonb) AS seed(record_type text, record_key text, data jsonb, position integer)
      WHERE NOT EXISTS (SELECT 1 FROM app_metadata WHERE key = 'initial_content_v1')
      ON CONFLICT (record_type, record_key) DO NOTHING`, values: [JSON.stringify(seedRecords())] },
    { text: "INSERT INTO app_metadata (key, value) VALUES ('initial_content_v1', 'true'::jsonb) ON CONFLICT (key) DO NOTHING", values: [] },
  ]
}

let initialization: Promise<void> | undefined

export function initializeDatabase(): Promise<void> {
  if (!initialization) {
    initialization = (async () => {
      const sql = getDatabase()
      if (!sql) throw new Error("Connect Neon Postgres in Vercel Storage to set DATABASE_URL.")
      await sql.transaction(initializationQueries().map((query) => sql.query(query.text, query.values)))
    })().catch((error) => {
      initialization = undefined
      throw error
    })
  }
  return initialization
}

export function replacementQueries(recordType: string, rows: Array<{ key: string; data: unknown }>): DatabaseQuery[] {
  if (new Set(rows.map((row) => row.key)).size !== rows.length) throw new Error("Duplicate record keys in replacement data.")
  return [
    { text: "SELECT pg_advisory_xact_lock(hashtext($1))", values: [`content:${recordType}`] },
    { text: "DELETE FROM content_records WHERE record_type = $1", values: [recordType] },
    ...rows.map((row, position) => ({
      text: "INSERT INTO content_records (record_type, record_key, data, position) VALUES ($1, $2, $3::jsonb, $4)",
      values: [recordType, row.key, JSON.stringify(row.data), position],
    })),
  ]
}
