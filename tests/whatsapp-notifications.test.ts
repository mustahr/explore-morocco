import assert from "node:assert/strict"
import { test } from "node:test"
import { sendBookingWhatsApp } from "../src/lib/whatsapp-notifications"

test("WhatsApp never claims success without configuration and a provider message ID", async () => {
  const keys = ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_BOOKING_TEMPLATE", "WHATSAPP_API_VERSION", "WHATSAPP_NOTIFICATION_TO"]
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
  const originalFetch = globalThis.fetch
  const booking = { id: "TEST-123", tripId: "trip", tripTitle: "Chefchaouen", customerName: "Client", customerEmail: "client@example.com", customerPhone: "0600000000", startDate: "2099-01-01", travelers: 2 }
  try {
    keys.forEach((key) => { delete process.env[key] })
    assert.equal((await sendBookingWhatsApp(booking)).status, "skipped")
    Object.assign(process.env, { WHATSAPP_ACCESS_TOKEN: "test-token", WHATSAPP_PHONE_NUMBER_ID: "123", WHATSAPP_BOOKING_TEMPLATE: "booking_alert", WHATSAPP_API_VERSION: "v23.0" })
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body))
      assert.equal(body.type, "template")
      assert.match(body.template.components[0].parameters[0].text, /TEST-123.*Chefchaouen.*Client/)
      return Response.json({ messages: [{ id: "provider-message-id" }] })
    }
    assert.equal((await sendBookingWhatsApp(booking)).status, "sent")
    globalThis.fetch = async () => Response.json({ error: {} }, { status: 403 })
    assert.equal((await sendBookingWhatsApp(booking)).status, "failed")
  } finally {
    globalThis.fetch = originalFetch
    for (const [key, value] of Object.entries(original)) { if (value === undefined) delete process.env[key]; else process.env[key] = value }
  }
})
