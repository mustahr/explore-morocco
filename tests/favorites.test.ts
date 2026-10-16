import assert from "node:assert/strict"
import { test } from "node:test"
import { mkdtemp, mkdir, cp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { PGlite } from "@electric-sql/pglite"
import { favoriteKey, parseFavoriteKey } from "../src/lib/favorite-keys"
import { favoriteSyncQueries } from "../src/lib/favorites-db"
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "../src/lib/admin-auth"

test("legacy trip keys stay compatible and other favorite types cannot collide", () => {
  assert.equal(favoriteKey("trip", "marrakech"), "marrakech")
  assert.equal(favoriteKey("destination", "marrakech"), "destination:marrakech")
  assert.deepEqual(parseFavoriteKey("camel-ride"), { kind: "trip", id: "camel-ride" })
  assert.deepEqual(parseFavoriteKey("experience:camel-ride"), { kind: "experience", id: "camel-ride" })
  assert.equal(parseFavoriteKey("admin:settings"), null)
  assert.equal(parseFavoriteKey("destination:../../private"), null)
})

test("favorites sync persists real content, deduplicates, removes only this browser and protects admin records", async () => {
  const root = process.cwd()
  const temporary = await mkdtemp(path.join(tmpdir(), "morocco-favorites-"))
  const envKeys = ["VERCEL", "DATABASE_URL", "POSTGRES_URL", "ADMIN_SESSION_SECRET"]
  const original = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]))
  try {
    await mkdir(path.join(temporary, "data"))
    await cp(path.join(root, "data"), path.join(temporary, "data"), { recursive: true })
    envKeys.forEach((key) => { delete process.env[key] })
    process.env.ADMIN_SESSION_SECRET = "favorites-test-secret"
    process.chdir(temporary)
    const { POST } = await import("../src/app/api/favorites/route")
    const { GET } = await import("../src/app/api/admin/favorites/route")
    const { getFavorites } = await import("../src/lib/favorites-db")
    const submit = (keys: unknown, cookie = "", origin = "https://example.test") => POST(new Request("https://example.test/api/favorites", { method: "POST", headers: { cookie, origin }, body: JSON.stringify({ keys }) }))
    assert.equal((await GET(new Request("https://example.test/api/admin/favorites"))).status, 401)
    assert.equal((await submit(["desert-3day"], "", "https://evil.test")).status, 403)
    assert.equal((await submit(["admin:settings"])).status, 400)
    const first = await submit(["desert-3day", "desert-3day", "destination:marrakech", "experience:camel-ride", "not-a-real-trip"])
    assert.equal(first.status, 200)
    assert.equal((await first.json()).count, 3)
    assert.match(first.headers.get("set-cookie")!, /HttpOnly; SameSite=Lax/)
    const cookie = first.headers.get("set-cookie")!.split(";")[0]
    const records = await getFavorites()
    assert.equal(records.length, 3)
    assert.equal(records.find((r) => r.kind === "destination")?.title, "Marrakech")
    assert.ok(records.every((r) => !r.visitorId.includes(cookie.split("=")[1]) && !Number.isNaN(Date.parse(r.createdAt))))
    await submit(["desert-3day", "destination:marrakech", "experience:camel-ride"], cookie)
    assert.deepEqual((await getFavorites()).map((r) => r.createdAt), records.map((r) => r.createdAt))
    await submit(["desert-3day"])
    assert.equal((await getFavorites()).length, 4)
    await submit([], cookie)
    assert.equal((await getFavorites()).length, 1)
    const admin = await GET(new Request("https://example.test/api/admin/favorites", { headers: { cookie: `${ADMIN_SESSION_COOKIE}=${createAdminSessionToken()}` } }))
    const data = await admin.json()
    assert.equal(data.total, 1); assert.equal(data.visitors, 1); assert.equal(data.items[0].count, 1)
    assert.equal(data.recent[0].visitorId, undefined)
    process.env.VERCEL = "1"
    assert.equal((await submit(["desert-3day"])).status, 503)
  } finally {
    process.chdir(root)
    envKeys.forEach((key) => { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key] })
    await rm(temporary, { recursive: true, force: true })
  }
})

test("Postgres sync preserves first-save timestamps and never deletes another visitor", async () => {
  const db = new PGlite()
  try {
    await db.exec("CREATE TABLE content_records (record_type text, record_key text, data jsonb, position integer, PRIMARY KEY(record_type, record_key))")
    const record = (key: string, visitorId: string, createdAt: string) => ({ key, visitorId, createdAt, kind: "trip" as const, id: "desert-3day", title: "Trusted title", href: "/trips/desert-3day" })
    async function sync(visitor: string, records: ReturnType<typeof record>[]) { for (const q of favoriteSyncQueries(visitor, records)) await db.query(q.text, q.values) }
    await sync("a", [record("a-key", "a", "2026-10-15T10:00:00Z")])
    await sync("b", [record("b-key", "b", "2026-10-15T11:00:00Z")])
    await sync("a", [record("a-key", "a", "2026-10-15T12:00:00Z")])
    const first = await db.query<{data: {createdAt: string}}>("SELECT data FROM content_records WHERE record_key='a-key'")
    assert.equal(first.rows[0].data.createdAt, "2026-10-15T10:00:00Z")
    await sync("a", [])
    const remaining = await db.query<{record_key: string}>("SELECT record_key FROM content_records")
    assert.deepEqual(remaining.rows.map((r) => r.record_key), ["b-key"])
  } finally { await db.close() }
})
