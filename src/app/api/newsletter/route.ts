import { createHash } from "node:crypto"
import { createLead, getLeads, type Lead } from "@/lib/admin-db"
import { getDatabase, initializeDatabase } from "@/lib/postgres"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: { email?: unknown; consent?: unknown; website?: unknown }
  try { body = await request.json() } catch {
    return Response.json({ error: "Please send a valid subscription request." }, { status: 400 })
  }
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body?.consent !== true) {
    return Response.json({ error: "Enter a valid email and agree to receive travel emails." }, { status: 400 })
  }
  if (body.website) return Response.json({ subscribed: true })
  try {
    const sql = getDatabase()
    if (!sql && process.env.VERCEL) return Response.json({ error: "Subscriptions are temporarily unavailable. Please try again later." }, { status: 503 })
    const id = `newsletter-${createHash("sha256").update(email).digest("hex")}`
    const lead: Lead = {
      id, email, name: "Newsletter subscriber", interest: "Travel newsletter subscription",
      source: "Website newsletter", status: "new", createdAt: new Date().toISOString(),
      message: "Agreed to receive travel inspiration and offers through the website newsletter form.",
    }
    if (sql) {
      await initializeDatabase()
      // A stable key and atomic insert prevent duplicates without resetting admin edits.
      await sql`INSERT INTO content_records (record_type, record_key, data, position)
        VALUES ('leads', ${id}, ${JSON.stringify(lead)}::jsonb, 0)
        ON CONFLICT (record_type, record_key) DO NOTHING`
    } else {
      const leads = await getLeads()
      if (!leads.some((item) => item.id === id)) await createLead(lead)
    }
    // Do not expose stored customer details or whether an address already existed.
    return Response.json({ subscribed: true })
  } catch {
    return Response.json({ error: "We could not save your subscription. Please try again." }, { status: 500 })
  }
}
