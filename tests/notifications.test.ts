import assert from "node:assert/strict"
import { test } from "node:test"
import { sendEmailNotification } from "../src/lib/notifications"

test("email reports missing config and provider failures, and only accepts a real email ID", async () => {
  const originalFetch = globalThis.fetch
  const original = { RESEND_API_KEY: process.env.RESEND_API_KEY, NOTIFICATION_EMAIL_TO: process.env.NOTIFICATION_EMAIL_TO, NOTIFICATION_EMAIL_FROM: process.env.NOTIFICATION_EMAIL_FROM }
  const payload = { type: "booking" as const, title: "Booking <test>", fields: { name: '<img src=x onerror="bad()">' } }
  try {
    delete process.env.RESEND_API_KEY
    let called = false
    globalThis.fetch = async () => { called = true; throw new Error("unexpected") }
    assert.equal((await sendEmailNotification(payload)).status, "skipped")
    assert.equal(called, false)
    process.env.RESEND_API_KEY = "test-key"
    delete process.env.NOTIFICATION_EMAIL_TO
    delete process.env.NOTIFICATION_EMAIL_FROM
    globalThis.fetch = async () => Response.json({ name: "validation_error", message: "The domain is not verified" }, { status: 403 })
    const rejected = await sendEmailNotification(payload)
    assert.equal(rejected.status, "failed")
    assert.match(rejected.message, /sender/)
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body))
      assert.deepEqual(body.to, ["contact@dunexplore-morocco.com"])
      assert.equal(body.from, "Dunexplore Morocco <notifications@dunexplore-morocco.com>")
      assert.ok(!body.html.includes("<img"))
      assert.ok(body.html.includes("&lt;img"))
      return Response.json({ id: "email-123" })
    }
    assert.deepEqual((await sendEmailNotification(payload)).id, "email-123")
    globalThis.fetch = async () => Response.json({})
    assert.equal((await sendEmailNotification(payload)).status, "failed")
    globalThis.fetch = async () => { throw new Error("secret-connection-info") }
    const network = await sendEmailNotification(payload)
    assert.equal(network.status, "failed")
    assert.ok(!network.message.includes("secret-connection-info"))
  } finally {
    globalThis.fetch = originalFetch
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
})
