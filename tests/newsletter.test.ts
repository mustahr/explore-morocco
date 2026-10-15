import assert from "node:assert/strict"
import { test } from "node:test"
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

test("newsletter validates consent, saves normalized subscribers once, preserves records and protects production", async () => {
  const root = process.cwd()
  const temporary = await mkdtemp(path.join(tmpdir(), "morocco-newsletter-"))
  const keys = ["DATABASE_URL", "POSTGRES_URL", "VERCEL"]
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
  try {
    await mkdir(path.join(temporary, "data"))
    await writeFile(path.join(temporary, "data/leads.json"), "[]")
    keys.forEach((key) => delete process.env[key])
    process.chdir(temporary)
    const { POST } = await import("../src/app/api/newsletter/route")
    const submit = (body: unknown) => POST(new Request("https://example.com/api/newsletter", { method: "POST", body: JSON.stringify(body) }))
    assert.equal((await submit({ email: "invalid", consent: true })).status, 400)
    assert.equal((await submit({ email: "user@example.com", consent: false })).status, 400)
    assert.equal((await submit(null)).status, 400)
    assert.equal((await POST(new Request("https://example.com/api/newsletter", { method: "POST", body: "{" }))).status, 400)
    assert.equal((await submit({ email: "bot@example.com", consent: true, website: "spam" })).status, 200)
    const response = await submit({ email: " User@Example.COM ", consent: true })
    assert.deepEqual(await response.json(), { subscribed: true })
    const file = path.join(temporary, "data/leads.json")
    const leads = JSON.parse(await readFile(file, "utf8"))
    assert.equal(leads.length, 1)
    assert.equal(leads[0].email, "user@example.com")
    assert.equal(leads[0].source, "Website newsletter")
    assert.ok(Number.isFinite(Date.parse(leads[0].createdAt)))
    leads[0].status = "contacted"
    await writeFile(file, JSON.stringify(leads))
    await submit({ email: "user@example.com", consent: true })
    assert.deepEqual(JSON.parse(await readFile(file, "utf8")), leads)
    process.env.VERCEL = "1"
    assert.equal((await submit({ email: "other@example.com", consent: true })).status, 503)
    assert.deepEqual(JSON.parse(await readFile(file, "utf8")), leads)
  } finally {
    process.chdir(root)
    for (const [key, value] of Object.entries(original)) { if (value === undefined) delete process.env[key]; else process.env[key] = value }
    await rm(temporary, { recursive: true, force: true })
  }
})
