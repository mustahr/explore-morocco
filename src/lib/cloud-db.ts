import { createClient, type SupabaseClient } from "@supabase/supabase-js"

type CloudRecord<T> = {
  record_key: string
  data: T
}

let cachedClient: SupabaseClient | null = null

export function isCloudDatabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey())
}

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}

function getSupabaseClient() {
  if (!isCloudDatabaseConfigured()) return null

  if (!cachedClient) {
    cachedClient = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return cachedClient
}

async function notifyAdminRecordChange(
  supabase: SupabaseClient,
  recordType: string,
  operation: "upsert" | "replace" | "delete",
  recordKey?: string,
) {
  const { error } = await supabase.from("admin_events").insert({
    record_type: recordType,
    operation,
    record_key: recordKey,
  })

  if (error) {
    console.error("Could not publish admin realtime event", error.message)
  }
}

export async function getCloudRecords<T>(recordType: string) {
  const supabase = getSupabaseClient()
  if (!supabase) return undefined

  const { data, error } = await supabase
    .from("content_records")
    .select("record_key,data")
    .eq("record_type", recordType)
    .order("position", { ascending: true })

  if (error) throw new Error(error.message)

  return (data as CloudRecord<T>[]).map((record) => record.data)
}

export async function getCloudRecord<T>(recordType: string, recordKey: string) {
  const supabase = getSupabaseClient()
  if (!supabase) return undefined

  const { data, error } = await supabase
    .from("content_records")
    .select("data")
    .eq("record_type", recordType)
    .eq("record_key", recordKey)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return data ? (data.data as T) : null
}

export async function upsertCloudRecord<T>(recordType: string, recordKey: string, data: T, position = 0) {
  const supabase = getSupabaseClient()
  if (!supabase) return undefined

  const { error } = await supabase.from("content_records").upsert(
    {
      record_type: recordType,
      record_key: recordKey,
      data,
      position,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "record_type,record_key" }
  )

  if (error) throw new Error(error.message)

  await notifyAdminRecordChange(supabase, recordType, "upsert", recordKey)

  return data
}

export async function replaceCloudRecords<T extends Record<string, unknown>>(
  recordType: string,
  rows: Array<{ key: string; data: T }>
) {
  const supabase = getSupabaseClient()
  if (!supabase) return undefined

  const { error: deleteError } = await supabase.from("content_records").delete().eq("record_type", recordType)
  if (deleteError) throw new Error(deleteError.message)

  if (rows.length === 0) {
    await notifyAdminRecordChange(supabase, recordType, "replace")
    return []
  }

  const { error } = await supabase.from("content_records").insert(
    rows.map((row, index) => ({
      record_type: recordType,
      record_key: row.key,
      data: row.data,
      position: index,
    }))
  )

  if (error) throw new Error(error.message)

  await notifyAdminRecordChange(supabase, recordType, "replace")

  return rows.map((row) => row.data)
}

export async function deleteCloudRecord(recordType: string, recordKey: string) {
  const supabase = getSupabaseClient()
  if (!supabase) return undefined

  const { error } = await supabase
    .from("content_records")
    .delete()
    .eq("record_type", recordType)
    .eq("record_key", recordKey)

  if (error) throw new Error(error.message)

  await notifyAdminRecordChange(supabase, recordType, "delete", recordKey)

  return true
}
