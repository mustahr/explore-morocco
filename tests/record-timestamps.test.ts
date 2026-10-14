import assert from "node:assert/strict"
import { test } from "node:test"
import { formatMoroccoDateTime, withRecordTimestamps } from "../src/lib/record-timestamps"

test("database timestamps fill older content and keep the original booking submission time", () => {
  const created = "2026-10-14T20:00:00.000Z"
  const updated = "2026-10-14T21:00:00.000Z"
  const original = { title: "Trip" }
  assert.deepEqual(withRecordTimestamps({ data: original, created_at: created, updated_at: updated }), { ...original, createdAt: created, updatedAt: updated })
  assert.deepEqual(original, { title: "Trip" })
  const booking = { createdAt: "2026-10-14T19:00:00.000Z", updatedAt: created }
  assert.deepEqual(withRecordTimestamps({ data: booking, created_at: created, updated_at: updated }), { ...booking, updatedAt: updated })
})

test("date display uses Casablanca regardless of the browser or server time zone", () => {
  assert.equal(formatMoroccoDateTime("2026-01-15T12:34:56Z"), "15 Jan 2026, 13:34:56")
  assert.equal(formatMoroccoDateTime(undefined), "Not recorded")
  assert.equal(formatMoroccoDateTime("invalid"), "Not recorded")
})
