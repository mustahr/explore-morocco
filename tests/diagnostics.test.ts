import assert from "node:assert/strict"
import { test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { diagnosticCleanupQueries, DIAGNOSTIC_CUSTOMER_NAME } from "../src/lib/diagnostics"
import { POST } from "../src/app/api/admin/diagnostics/route"
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "../src/lib/admin-auth"

test("diagnostics require admin auth and reject unknown tests before integrations run", async () => {
  assert.equal((await POST(new Request("https://example.test", { method: "POST", body: '{"action":"booking"}' }))).status, 401)
  const original = process.env.ADMIN_SESSION_SECRET
  process.env.ADMIN_SESSION_SECRET = "test-secret"
  try {
    const response = await POST(new Request("https://example.test", { method: "POST", headers: { cookie: `${ADMIN_SESSION_COOKIE}=${createAdminSessionToken()}` }, body: '{"action":"unknown"}' }))
    assert.equal(response.status, 400)
  } finally {
    if (original === undefined) delete process.env.ADMIN_SESSION_SECRET
    else process.env.ADMIN_SESSION_SECRET = original
  }
})

test("cleanup removes only marked test records and preserves real records even with the same name", async () => {
  const db = new PGlite()
  try {
    await db.exec("CREATE TABLE content_records (record_type text, record_key text, data jsonb)")
    for (const [type, key, data] of [
      ["bookings", "test-booking", { customerName: DIAGNOSTIC_CUSTOMER_NAME }],
      ["bookings", "real-booking", { customerName: DIAGNOSTIC_CUSTOMER_NAME }],
      ["leads", "test-message", { name: DIAGNOSTIC_CUSTOMER_NAME }],
      ["leads", "real-message", { name: "Real customer" }],
      ["diagnostic_records", "marker1", { type: "bookings", id: "test-booking" }],
      ["diagnostic_records", "marker2", { type: "leads", id: "test-message" }],
    ] as const) await db.query("INSERT INTO content_records VALUES ($1, $2, $3::jsonb)", [type, key, JSON.stringify(data)])
    await db.transaction(async (tx) => {
      for (const query of diagnosticCleanupQueries()) await tx.query(query.text, query.values)
    })
    const rows = await db.query<{record_key: string}>("SELECT record_key FROM content_records ORDER BY record_key")
    assert.deepEqual(rows.rows.map((row) => row.record_key), ["real-booking", "real-message"])
  } finally { await db.close() }
})
