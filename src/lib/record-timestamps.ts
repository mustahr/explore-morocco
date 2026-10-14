function iso(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined
}

export function withRecordTimestamps<T>(row: { data: T; created_at?: unknown; updated_at?: unknown }): T {
  if (!row.data || typeof row.data !== "object" || Array.isArray(row.data)) return row.data
  const data = row.data as Record<string, unknown>
  return {
    ...data,
    createdAt: iso(data.createdAt) || iso(row.created_at),
    updatedAt: iso(row.updated_at) || iso(data.updatedAt),
  } as T
}

export function formatMoroccoDateTime(value: unknown) {
  const timestamp = iso(value)
  if (!timestamp) return "Not recorded"
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Casablanca", day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).format(new Date(timestamp))
}
