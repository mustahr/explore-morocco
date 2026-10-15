import assert from "node:assert/strict"
import { test } from "node:test"
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

test("audience combines and retains contacts; campaigns protect addresses, opt-outs and duplicate sends", async () => {
  const root = process.cwd()
  const temporary = await mkdtemp(path.join(tmpdir(), "morocco-emails-"))
  const keys = ["DATABASE_URL", "POSTGRES_URL", "VERCEL", "RESEND_API_KEY", "ADMIN_SESSION_SECRET", "ADMIN_PASSWORD"]
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
  const originalFetch = globalThis.fetch
  try {
    await mkdir(path.join(temporary, "data"))
    keys.forEach((key) => delete process.env[key])
    process.env.ADMIN_SESSION_SECRET = "isolated-test-secret"
    const now = new Date().toISOString()
    await writeFile(path.join(temporary, "data/bookings.json"), JSON.stringify([{ customerEmail: " SAME@EXAMPLE.COM ", customerName: "Traveler", createdAt: now }]))
    await writeFile(path.join(temporary, "data/leads.json"), JSON.stringify([{ email: "same@example.com", name: "Newsletter subscriber", source: "Website newsletter", createdAt: now }, { email: "enquiry@example.com", name: "Enquiry", source: "Contact", createdAt: now }, { email: "invalid", name: "Bad", source: "Contact", createdAt: now }]))
    process.chdir(temporary)
    const m = await import("../src/lib/email-marketing")
    const auth = await import("../src/lib/admin-auth")
    const route = await import("../src/app/api/admin/email-marketing/route")
    const unsubscribe = await import("../src/app/api/unsubscribe/route")
    const req = (body: unknown, authenticated = true) => new Request("https://example.com/api/admin/email-marketing", { method: "POST", headers: authenticated ? { cookie: auth.adminSessionCookieHeader() } : {}, body: JSON.stringify(body) })
    assert.equal((await route.GET(req({} , false))).status, 401)
    assert.equal((await route.POST(req({ action: "send" }, false))).status, 401)
    const contacts = await m.emailAudience()
    assert.equal(contacts.length, 2)
    const combined = contacts.find((item) => item.email === "same@example.com")!
    assert.deepEqual(combined.sources, ["Booking", "Newsletter"])
    assert.equal(combined.subscribed, true)
    assert.equal(contacts.find((item) => item.email === "enquiry@example.com")?.subscribed, false)
    await writeFile(path.join(temporary, "data/bookings.json"), "[]")
    await writeFile(path.join(temporary, "data/leads.json"), "[]")
    assert.equal((await m.emailAudience()).length, 2)
    assert.equal((await route.POST(req({ action: "create", subject: "Offer", message: "Hi", audience: "all" }))).status, 400)
    const created = await route.POST(req({ action: "create", subject: "Offer <deal>", message: "Hello <script>alert(1)</script>", audience: "subscribers" }))
    const { campaign } = await created.json()
    assert.deepEqual(campaign.recipients, ["same@example.com"])
    const payload = m.campaignPayload(campaign.subject, campaign.message, "same@example.com")
    assert.ok(payload.html.includes("&lt;script&gt;"))
    assert.ok(!payload.html.includes("<script>"))
    assert.deepEqual(payload.to, ["same@example.com"])
    const token = m.unsubscribeToken("same@example.com")
    assert.equal(m.unsubscribeEmail(token), "same@example.com")
    assert.equal(m.unsubscribeEmail(token + "x"), null)
    let calls = 0
    process.env.RESEND_API_KEY = "test-key"
    globalThis.fetch = async (_url, options) => {
      calls++
      const messages = JSON.parse(String(options?.body))
      assert.equal(messages.length, 1)
      assert.deepEqual(messages[0].to, ["same@example.com"])
      assert.ok((options?.headers as Record<string, string>)["Idempotency-Key"])
      return Response.json({ data: [{ id: "provider-id" }] })
    }
    const sent = await route.POST(req({ action: "send", id: campaign.id }))
    assert.equal((await sent.json()).campaign.status, "complete")
    await route.POST(req({ action: "send", id: campaign.id }))
    assert.equal(calls, 1)
    const result = await unsubscribe.POST(new Request("https://example.com/api/unsubscribe", { method: "POST", body: JSON.stringify({ token }) }))
    assert.equal(result.status, 200)
    const all = await route.POST(req({ action: "create", subject: "Next", message: "Hello", audience: "all", permissionConfirmed: true }))
    const next = (await all.json()).campaign
    assert.deepEqual(next.recipients, ["enquiry@example.com"])
    globalThis.fetch = async () => Response.json({ message: "rate limited" }, { status: 429 })
    assert.equal((await route.POST(req({ action: "send", id: next.id }))).status, 502)
    const records = JSON.parse(await readFile(path.join(temporary, "data/email_campaigns.json"), "utf8"))
    assert.equal(Object.keys(records.find((item: { id: string }) => item.id === next.id).batches).length, 0)
    assert.equal((await unsubscribe.POST(new Request("https://example.com/api/unsubscribe", { method: "POST", body: JSON.stringify({ token: "forged" }) }))).status, 400)
  } finally {
    process.chdir(root); globalThis.fetch = originalFetch
    for (const [key, value] of Object.entries(original)) { if (value === undefined) delete process.env[key]; else process.env[key] = value }
    await rm(temporary, { recursive: true, force: true })
  }
})
