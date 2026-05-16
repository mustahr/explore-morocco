import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { getSiteUrl } from "@/lib/site"

export const dynamic = "force-dynamic"

const requiredVariables = [
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
] as const

const optionalVariables = [
  "OPERATIONS_WEBHOOK_URL",
  "CONTACT_WEBHOOK_URL",
  "RESEND_API_KEY",
  "NOTIFICATION_EMAIL_TO",
  "NOTIFICATION_EMAIL_FROM",
] as const

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  return Response.json({
    siteUrl: getSiteUrl(),
    environment: process.env.NODE_ENV || "unknown",
    variables: requiredVariables.map((name) => ({
      name,
      configured: Boolean(process.env[name]?.trim()),
      required: true,
    })),
    optionalVariables: optionalVariables.map((name) => ({
      name,
      configured: Boolean(process.env[name]?.trim()),
      required: false,
    })),
  })
}
