import { createHash, randomUUID } from "node:crypto"
import { parseFavoriteKey } from "@/lib/favorite-keys"
import { syncFavorites } from "@/lib/favorites-db"
export const dynamic = "force-dynamic"
const cookieName = "morocco-favorites-visitor"

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    return Response.json({ error: "Invalid origin." }, { status: 403 })
  }
  let body: unknown
  try {
    const text = await request.text()
    if (text.length > 24000) return Response.json({ error: "Too many favorites." }, { status: 413 })
    body = JSON.parse(text)
  } catch { return Response.json({ error: "Invalid favorites." }, { status: 400 }) }
  const keys = (body as { keys?: unknown } | null)?.keys
  if (!Array.isArray(keys) || keys.length > 200 || !keys.every((key) => typeof key === "string" && parseFavoriteKey(key))) {
    return Response.json({ error: "Invalid favorites." }, { status: 400 })
  }
  const existing = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
  const token = existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing) ? existing : randomUUID()
  const visitorId = createHash("sha256").update(token).digest("hex")
  try {
    const count = await syncFavorites(visitorId, keys.map((key) => parseFavoriteKey(key)!))
    return Response.json({ saved: true, count }, { headers: {
      "Cache-Control": "no-store",
      "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`,
    } })
  } catch { return Response.json({ error: "Favorites could not be synced." }, { status: 503 }) }
}
