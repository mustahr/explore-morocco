import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { getFavorites } from "@/lib/favorites-db"
export const dynamic = "force-dynamic"
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  try {
    const records = await getFavorites()
    const groups = new Map<string, { kind: string; id: string; title: string; href: string; count: number; lastSavedAt: string }>()
    for (const record of records) {
      const key = `${record.kind}:${record.id}`
      const group = groups.get(key) ?? { kind: record.kind, id: record.id, title: record.title, href: record.href, count: 0, lastSavedAt: record.createdAt }
      group.count++
      if (record.createdAt > group.lastSavedAt) group.lastSavedAt = record.createdAt
      groups.set(key, group)
    }
    return Response.json({
      total: records.length,
      visitors: new Set(records.map((record) => record.visitorId)).size,
      items: [...groups.values()].sort((a, b) => b.count - a.count || b.lastSavedAt.localeCompare(a.lastSavedAt)),
      recent: records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100).map(({ visitorId, ...record }) => ({ ...record, visitor: `Visitor ${visitorId.slice(0, 8)}` })),
    }, { headers: { "Cache-Control": "no-store" } })
  } catch { return Response.json({ error: "Could not load favorites. Check the database connection." }, { status: 503 }) }
}
