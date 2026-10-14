import { del } from "@vercel/blob"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { getDatabase, initializeDatabase } from "@/lib/postgres"
import { getCloudRecords } from "@/lib/cloud-db"
import { getPublishedTrips } from "@/lib/trips-db"
import { sendAdminPushNotification } from "@/lib/admin-push"
import { uploadImageToStorage } from "@/lib/media-storage"
import { DIAGNOSTIC_CUSTOMER_NAME, diagnosticCleanupQueries } from "@/lib/diagnostics"
import { CONTACT_EMAIL } from "@/lib/contact"
import { POST as submitBooking } from "@/app/api/bookings/route"
import { POST as submitMessage } from "@/app/api/leads/route"

export const maxDuration = 60
const testName = DIAGNOSTIC_CUSTOMER_NAME
const ok = (message: string) => Response.json({ status: "passed", message })
const blocked = (message: string) => Response.json({ status: "blocked", message }, { status: 503 })

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  const body = await request.json().catch(() => null) as { action?: string } | null
  const action = body?.action
  if (!["database", "catalog", "booking", "message", "storage", "webhook", "push", "cleanup"].includes(action || "")) {
    return Response.json({ status: "failed", message: "Unknown test." }, { status: 400 })
  }
  try {
    if (action === "push") {
      const result = await sendAdminPushNotification({ title: "Dunexplore Morocco — test notification", body: "Your website's background notification test.", tag: `test-${crypto.randomUUID()}`, url: "/admin?section=settings" })
      if (!result.configured) return blocked("Push keys are missing or invalid. Configure VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY, then redeploy.")
      if (!result.sent) return blocked("No device accepted the test. Enable background notifications in the admin header on your device, then retry.")
      return ok(`Push service accepted ${result.sent} notification(s). Check your device's notification centre.`)
    }
    if (action === "webhook") {
      const url = process.env.OPERATIONS_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL
      if (!url) return blocked("No operations webhook is configured. This integration is optional.")
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(10000), body: JSON.stringify({ type: "diagnostic", title: "Dunexplore Morocco test", test: true, sentAt: new Date().toISOString() }) })
      return response.ok ? ok("Webhook endpoint accepted the test. Check your connected automation for its final result.") : blocked(`Webhook rejected the test (HTTP ${response.status}). Check your automation settings.`)
    }
    if (action === "storage") {
      if (!process.env.BLOB_READ_WRITE_TOKEN) return blocked("BLOB_READ_WRITE_TOKEN is missing. Connect a public Vercel Blob store and redeploy.")
      const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=", "base64")
      const file = new File([png], "diagnostic.png", { type: "image/png" })
      const upload = await uploadImageToStorage(file, "admin-diagnostics")
      let readable = false
      try {
        const response = await fetch(upload.url, { method: "HEAD", signal: AbortSignal.timeout(10000), cache: "no-store" })
        readable = response.ok && Boolean(response.headers.get("content-type")?.startsWith("image/"))
      } finally { await del(upload.url, { token: process.env.BLOB_READ_WRITE_TOKEN }) }
      return readable ? ok("Image upload, public access, and deletion passed. The test image was removed.") : blocked("Upload succeeded but public image access failed. The test image was removed; check that the Blob store is public.")
    }
    const sql = getDatabase()
    if (!sql) return blocked("DATABASE_URL is missing. Connect Neon and redeploy.")
    await initializeDatabase()
    if (action === "database") {
      const id = `probe-${crypto.randomUUID()}`
      const results = await sql.transaction([
        sql.query("INSERT INTO content_records (record_type, record_key, data) VALUES ('diagnostic_probe', $1, '{\"test\":true}'::jsonb)", [id]),
        sql.query("SELECT data FROM content_records WHERE record_type = 'diagnostic_probe' AND record_key = $1", [id]),
        sql.query("DELETE FROM content_records WHERE record_type = 'diagnostic_probe' AND record_key = $1", [id]),
      ])
      if (results[1]?.length !== 1) return blocked("The database read did not return the test record.")
      return ok("Database write, read, and deletion passed. No test record remains.")
    }
    if (action === "catalog") {
      const types = ["trips", "destinations", "experiences", "blog_posts", "guides", "testimonials"]
      const records = await Promise.all(types.map((type) => getCloudRecords<Record<string, unknown>>(type)))
      const total = records.reduce((sum, rows) => sum + (rows?.length || 0), 0)
      return ok(`All six catalog collections are readable (${total} records). Use Content control for detailed image and required-field checks.`)
    }
    if (action === "cleanup") {
      const results = await sql.transaction(diagnosticCleanupQueries().map((query) => sql.query(query.text, query.values)))
      return ok(`Removed ${results[0].length} marked test record(s). Real bookings and messages were kept.`)
    }
    const correlation = crypto.randomUUID()
    const createRequest = (payload: unknown) => new Request("https://diagnostic.local/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    let response: Response
    let recordType: string
    if (action === "booking") {
      const trip = (await getPublishedTrips())[0]
      if (!trip) return blocked("Publish a trip before testing reservations.")
      response = await submitBooking(createRequest({ tripId: trip.id, customerName: testName, customerEmail: CONTACT_EMAIL, startDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), travelers: 1, notes: `Not a real reservation. Admin test ${correlation}.` }))
      recordType = "bookings"
    } else {
      response = await submitMessage(createRequest({ name: testName, email: CONTACT_EMAIL, interest: "Contact form test", message: `Not a real customer enquiry. Admin test ${correlation}.`, source: "Admin diagnostics" }))
      recordType = "leads"
    }
    const result = await response.json()
    const record = result.booking || result.lead
    if (!response.ok || !record?.id) return blocked("The submission endpoint failed. Check Vercel runtime logs and the admin list before retrying.")
    // A marker ties cleanup to this exact test, not merely a name or a prefix.
    await sql.query("INSERT INTO content_records (record_type, record_key, data) VALUES ('diagnostic_records', $1, $2::jsonb)", [correlation, JSON.stringify({ type: recordType, id: record.id })])
    const rows = await sql.query("SELECT record_key FROM content_records WHERE record_type = $1 AND record_key = $2", [recordType, record.id])
    if (!rows.length) return blocked("Submission returned an ID, but the saved record could not be read back.")
    return ok(`Submission and persistence passed. Reference: ${record.id}. Open ${recordType === "bookings" ? "Bookings" : "Leads"} to view it. Notifications were attempted; use the separate email/push tests to confirm those channels.`)
  } catch {
    return Response.json({ status: "failed", message: `The ${action} test failed. Check Vercel runtime logs and the integration's configuration. If a test record or file was created, check the admin list or Blob store before retrying.` }, { status: 502 })
  }
}
