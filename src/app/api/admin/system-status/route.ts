import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { getSiteUrl } from "@/lib/site"
import { getDatabase, getDatabaseUrl, initializeDatabase } from "@/lib/postgres"

export const dynamic = "force-dynamic"

const requiredVariables = ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET", "NEXT_PUBLIC_SITE_URL", "DATABASE_URL"] as const
const optionalVariables = ["BLOB_READ_WRITE_TOKEN", "OPERATIONS_WEBHOOK_URL", "CONTACT_WEBHOOK_URL", "RESEND_API_KEY", "NOTIFICATION_EMAIL_TO", "NOTIFICATION_EMAIL_FROM", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_BOOKING_TEMPLATE", "WHATSAPP_API_VERSION", "WHATSAPP_TEMPLATE_LANGUAGE", "WHATSAPP_NOTIFICATION_TO"] as const

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  const configured = Boolean(getDatabaseUrl())
  let connected = false
  let message = "In Vercel, open Storage, create a Neon Postgres database, connect it to this project, and redeploy."
  if (configured) {
    try {
      await initializeDatabase()
      const sql = getDatabase()!
      await sql`SELECT 1`
      connected = true
      message = "Neon Postgres is connected. Content, bookings, leads, and settings are saved persistently."
    } catch {
      // Do not return driver errors: they can include connection strings or credentials.
      message = "Connection failed. Check the connected Neon database and DATABASE_URL in Vercel, then redeploy."
    }
  }
  return Response.json({
    siteUrl: getSiteUrl(),
    environment: process.env.NODE_ENV || "unknown",
    database: { provider: "Neon Postgres", configured, connected, message },
    variables: requiredVariables.map((name) => ({ name, configured: name === "DATABASE_URL" ? configured : Boolean(process.env[name]?.trim()), required: true })),
    optionalVariables: optionalVariables.map((name) => ({ name, configured: Boolean(process.env[name]?.trim()), required: false })),
  })
}
