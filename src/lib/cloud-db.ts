import { withRecordTimestamps } from "@/lib/record-timestamps"
import { getDatabase, getDatabaseUrl, initializeDatabase, replacementQueries } from "@/lib/postgres"

export function isCloudDatabaseConfigured() {
  return Boolean(getDatabaseUrl())
}

export function assertLocalWritesAllowed() {
  if (process.env.VERCEL) {
    throw new Error("Connect Neon Postgres in Vercel Storage and redeploy before saving data. DATABASE_URL is required.")
  }
}

async function database() {
  const sql = getDatabase()
  if (!sql) return null
  await initializeDatabase()
  return sql
}

export async function getCloudRecords<T>(recordType: string): Promise<T[] | undefined> {
  const sql = await database()
  if (!sql) {
    // Never display the repository's sample customers on a deployed admin dashboard.
    if (process.env.VERCEL && ["bookings", "leads", "admin_push_subscriptions"].includes(recordType)) return []
    return undefined
  }
  const rows = await sql`SELECT data, created_at, updated_at FROM content_records WHERE record_type = ${recordType} ORDER BY position, record_key`
  return rows.map((row) => withRecordTimestamps({ data: row.data as T, created_at: row.created_at, updated_at: row.updated_at }))
}

export async function getCloudRecord<T>(recordType: string, recordKey: string): Promise<T | null | undefined> {
  const sql = await database()
  if (!sql) return undefined
  const rows = await sql`SELECT data, created_at, updated_at FROM content_records WHERE record_type = ${recordType} AND record_key = ${recordKey}`
  return rows.length ? withRecordTimestamps({ data: rows[0].data as T, created_at: rows[0].created_at, updated_at: rows[0].updated_at }) : null
}

export async function upsertCloudRecord<T>(recordType: string, recordKey: string, data: T, position = 0) {
  const sql = await database()
  if (!sql) {
    assertLocalWritesAllowed()
    return undefined
  }
  await sql`INSERT INTO content_records (record_type, record_key, data, position)
    VALUES (${recordType}, ${recordKey}, ${JSON.stringify(data)}::jsonb, ${position})
    ON CONFLICT (record_type, record_key) DO UPDATE SET data = EXCLUDED.data,
      position = EXCLUDED.position, updated_at = now()`
  return data
}

export async function replaceCloudRecords<T extends Record<string, unknown>>(
  recordType: string,
  rows: Array<{ key: string; data: T }>,
) {
  const sql = await database()
  if (!sql) {
    assertLocalWritesAllowed()
    return undefined
  }
  await sql.transaction(replacementQueries(recordType, rows).map((query) => sql.query(query.text, query.values)))
  return rows.map((row) => row.data)
}

export async function deleteCloudRecord(recordType: string, recordKey: string) {
  const sql = await database()
  if (!sql) {
    assertLocalWritesAllowed()
    return undefined
  }
  await sql`DELETE FROM content_records WHERE record_type = ${recordType} AND record_key = ${recordKey}`
  return true
}
