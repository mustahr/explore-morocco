import assert from "node:assert/strict"
import { test } from "node:test"
import trips from "../data/trips.json"
import { fetchTrips } from "../src/lib/fetch-trips"

const signal = () => new AbortController().signal
const respond = (value: unknown, status = 200): typeof fetch => async () => Response.json(value, { status })

test("trip loading distinguishes an empty catalog from HTTP, network and malformed responses", async () => {
  assert.deepEqual(await fetchTrips(signal(), respond({ trips: [] })), [])
  assert.deepEqual(await fetchTrips(signal(), respond({ trips })), trips)
  await assert.rejects(fetchTrips(signal(), respond({ error: "Database down" }, 503)), /temporarily unavailable/)
  await assert.rejects(fetchTrips(signal(), async () => { throw new TypeError("fetch failed") }), /fetch failed/)
  await assert.rejects(fetchTrips(signal(), async () => new Response("<html>Unavailable</html>")))
  for (const data of [null, {}, { trips: null }, { trips: [{}] }, { trips: [{ ...trips[0], locations: null }] }, { trips: [{ ...trips[0], price: "3500" }] }]) {
    await assert.rejects(fetchTrips(signal(), respond(data)), /Invalid trip/)
  }
})

test("retry makes a fresh uncached request and can recover from a failed attempt", async () => {
  let attempts = 0
  const fetcher: typeof fetch = async (url, options) => {
    assert.equal(url, "/api/trips")
    assert.equal(options?.cache, "no-store")
    assert.ok(options?.signal)
    return ++attempts === 1 ? Response.json({ error: "Unavailable" }, { status: 503 }) : Response.json({ trips })
  }
  await assert.rejects(fetchTrips(signal(), fetcher))
  assert.deepEqual(await fetchTrips(signal(), fetcher), trips)
  assert.equal(attempts, 2)
})

test("trip requests pass through the abort signal for timeout and navigation cancellation", async () => {
  const controller = new AbortController()
  const pending = fetchTrips(controller.signal, async (_url, options) => {
    assert.equal(options?.signal, controller.signal)
    return new Promise<Response>((_resolve, reject) => {
      options!.signal!.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true })
    })
  })
  controller.abort()
  await assert.rejects(pending, { name: "AbortError" })
})
