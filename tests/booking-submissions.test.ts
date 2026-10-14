import assert from "node:assert/strict"
import { test } from "node:test"
import { mkdtemp, mkdir, cp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

test("trip, destination, experience and generated bookings are really saved with trusted titles and prices", async () => {
  const root = process.cwd()
  const temporary = await mkdtemp(path.join(tmpdir(), "morocco-booking-test-"))
  const keys = ["VERCEL", "DATABASE_URL", "POSTGRES_URL", "RESEND_API_KEY", "OPERATIONS_WEBHOOK_URL", "CONTACT_WEBHOOK_URL", "VAPID_PUBLIC_KEY", "NEXT_PUBLIC_VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "WHATSAPP_ACCESS_TOKEN"]
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
  const originalFetch = globalThis.fetch
  try {
    await mkdir(path.join(temporary, "data"))
    await cp(path.join(root, "data"), path.join(temporary, "data"), { recursive: true })
    keys.forEach((key) => { delete process.env[key] })
    globalThis.fetch = async () => { throw new Error("Tests must not send real notifications") }
    process.chdir(temporary)
    const { POST } = await import("../src/app/api/bookings/route")
    const common = { customerName: "Test customer", customerEmail: "customer@example.com", customerPhone: "+212600000000", startDate: "2099-01-01", travelers: 2, notes: "Keep my request details" }
    async function submit(selection: Record<string, unknown>) {
      const response = await POST(new Request("https://example.test/api/bookings", { method: "POST", body: JSON.stringify({ ...common, ...selection }) }))
      return { status: response.status, data: await response.json() }
    }
    const destination = await submit({ destinationSlug: "chefchaouen", totalMAD: 999999, customTripTitle: "Forged title" })
    assert.equal(destination.status, 201)
    assert.match(destination.data.booking.tripTitle, /Chefchaouen/)
    assert.equal(destination.data.booking.totalMAD, 0)
    const experience = await submit({ experienceId: "camel-ride", totalMAD: 999999 })
    assert.equal(experience.status, 201)
    assert.equal(experience.data.booking.tripTitle, "Camel Trekking in the Sahara")
    assert.equal(experience.data.booking.totalMAD, 700)
    const trip = await submit({ tripId: "desert-3day", totalMAD: 1 })
    assert.equal(trip.status, 201)
    assert.equal(trip.data.booking.totalMAD, 7000)
    const custom = await submit({ tripId: "custom-ai-trip-test", customTripTitle: "My route", totalMAD: 2500 })
    assert.equal(custom.status, 201)
    assert.equal(custom.data.booking.tripTitle, "My route")
    const invalid = await submit({ destinationSlug: "does-not-exist" })
    assert.equal(invalid.status, 404)
    const invalidEmail = await submit({ tripId: "desert-3day", customerEmail: "invalid" })
    assert.equal(invalidEmail.status, 400)
    const saved = JSON.parse(await readFile(path.join(temporary, "data/bookings.json"), "utf8"))
    for (const result of [destination, experience, trip, custom]) {
      assert.ok(saved.some((record: { id: string; notes: string }) => record.id === result.data.booking.id && record.notes === common.notes))
      assert.equal(result.data.notifications.email, "skipped")
      assert.equal(result.data.notifications.whatsapp, "skipped")
    }
  } finally {
    process.chdir(root); globalThis.fetch = originalFetch
    for (const [key, value] of Object.entries(original)) { if (value === undefined) delete process.env[key]; else process.env[key] = value }
    await rm(temporary, { recursive: true, force: true })
  }
})
