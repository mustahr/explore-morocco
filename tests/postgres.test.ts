import assert from "node:assert/strict"
import { test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { initializationQueries, replacementQueries, type DatabaseQuery } from "../src/lib/postgres"
import { assertLocalWritesAllowed, getCloudRecords, upsertCloudRecord } from "../src/lib/cloud-db"

async function run(db: PGlite, queries: DatabaseQuery[]) {
  await db.transaction(async (tx) => {
    for (const query of queries) await tx.query(query.text, query.values)
  })
}

test("first initialization loads content but not demo customers; later runs preserve edits and deletions", async () => {
  const db = new PGlite()
  try {
    await run(db, initializationQueries())
    const initial = await db.query<{ count: number }>("SELECT count(*)::int AS count FROM content_records")
    assert.ok(initial.rows[0].count > 0)
    const customers = await db.query("SELECT * FROM content_records WHERE record_type IN ('bookings','leads')")
    assert.equal(customers.rows.length, 0)
    await db.query("UPDATE content_records SET data = '{\"title\":\"Admin edit\"}' WHERE record_type = 'blog_posts'")
    await db.query("DELETE FROM content_records WHERE record_type = 'trips'")
    await run(db, initializationQueries())
    assert.equal((await db.query("SELECT * FROM content_records WHERE record_type = 'trips'")).rows.length, 0)
    assert.equal((await db.query<{ data: { title: string } }>("SELECT data FROM content_records WHERE record_type = 'blog_posts'")).rows[0].data.title, "Admin edit")
  } finally { await db.close() }
})

test("replacement is atomic and a failed insert preserves existing records", async () => {
  const db = new PGlite()
  try {
    await run(db, initializationQueries())
    await run(db, replacementQueries("leads", [{ key: "one", data: { name: "Original" } }]))
    const broken = replacementQueries("leads", [{ key: "two", data: { name: "Replacement" } }])
    broken.push({ text: "INSERT INTO content_records (record_type, record_key, data) VALUES ($1, $2, NULL)", values: ["leads", "invalid"] })
    await assert.rejects(run(db, broken))
    const leads = await db.query<{ record_key: string }>("SELECT record_key FROM content_records WHERE record_type = 'leads'")
    assert.deepEqual(leads.rows.map((row) => row.record_key), ["one"])
    await run(db, replacementQueries("leads", []))
    assert.equal((await db.query("SELECT * FROM content_records WHERE record_type = 'leads'")).rows.length, 0)
    assert.throws(() => replacementQueries("leads", [{ key: "same", data: {} }, { key: "same", data: {} }]), /Duplicate/)
  } finally { await db.close() }
})

test("Vercel without a database never writes to local files or exposes demo customers", async () => {
  const original = { VERCEL: process.env.VERCEL, DATABASE_URL: process.env.DATABASE_URL, POSTGRES_URL: process.env.POSTGRES_URL }
  process.env.VERCEL = "1"
  delete process.env.DATABASE_URL
  delete process.env.POSTGRES_URL
  try {
    assert.throws(assertLocalWritesAllowed, /DATABASE_URL/)
    assert.deepEqual(await getCloudRecords("bookings"), [])
    assert.deepEqual(await getCloudRecords("leads"), [])
    await assert.rejects(upsertCloudRecord("leads", "test", {}), /DATABASE_URL/)
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
})
