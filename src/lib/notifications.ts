import { CONTACT_EMAIL } from "./contact"

type NotificationPayload = {
  type: "lead" | "booking" | "media_upload_failure"
  title: string
  fields: Record<string, string | number | boolean | null | undefined>
}
export type EmailNotificationResult = { status: "sent" | "failed" | "skipped"; message: string; id?: string }

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}

export async function notifyOperations(payload: NotificationPayload) {
  const webhookUrl = process.env.OPERATIONS_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL
  const [email] = await Promise.all([
    sendEmailNotification(payload),
    webhookUrl ? sendWebhookNotification(webhookUrl, payload).catch(() => {
      console.error("Operations webhook failed")
    }) : Promise.resolve(),
  ])
  if (email.status !== "sent") console.error("Email notification:", email.message)
  return email
}

async function sendWebhookNotification(webhookUrl: string, payload: NotificationPayload) {
  const response = await fetch(webhookUrl, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, site: process.env.NEXT_PUBLIC_SITE_URL, sentAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error("Operations webhook rejected the request")
}

export async function sendEmailNotification(payload: NotificationPayload): Promise<EmailNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.NOTIFICATION_EMAIL_TO?.trim() || CONTACT_EMAIL
  const from = process.env.NOTIFICATION_EMAIL_FROM?.trim() || "Dunexplore Morocco <notifications@dunexplore-morocco.com>"
  if (!apiKey) return { status: "skipped", message: "RESEND_API_KEY is missing. Add it to Vercel Production and redeploy." }
  const rows = Object.entries(payload.fields).map(([key, value]) => `<tr><td style="padding:6px 12px;color:#57534e">${escapeHtml(key)}</td><td style="padding:6px 12px;font-weight:600;color:#1c1917;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from, to: to.split(",").map((email) => email.trim()).filter(Boolean), subject: payload.title,
        text: `${payload.title}\n\n${Object.entries(payload.fields).map(([key, value]) => `${key}: ${value ?? ""}`).join("\n")}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1c1917"><h1 style="font-size:20px">${escapeHtml(payload.title)}</h1><p>A new ${escapeHtml(payload.type.replace(/_/g, " "))} event was created on Dunexplore Morocco.</p><table style="border-collapse:collapse;border:1px solid #e7e5e4">${rows}</table></div>`,
      }),
    })
    const data = await response.json().catch(() => null) as { id?: string; name?: string; message?: string } | null
    if (!response.ok) {
      let message = `Resend rejected the email (HTTP ${response.status}). Check Resend Logs for details.`
      if (response.status === 401 || data?.name === "restricted_api_key" || data?.name === "suspended_api_key") message = "Resend rejected the API key. Check RESEND_API_KEY, its sending permissions, and domain access, then redeploy."
      else if (response.status === 403 && /domain|testing emails/i.test(data?.message || "")) message = "Resend rejected the sender. Set NOTIFICATION_EMAIL_FROM to Dunexplore Morocco <notifications@dunexplore-morocco.com> and confirm this domain is verified in the same Resend account as the API key."
      else if (response.status === 429) message = "Resend's sending limit was reached. Check your account's usage and retry later."
      return { status: "failed", message }
    }
    if (!data?.id) return { status: "failed", message: "Resend did not return an email ID. Check Resend Logs before retrying." }
    return { status: "sent", message: "Resend accepted the email. Check your inbox/spam and Resend Emails for delivery status.", id: data.id }
  } catch {
    return { status: "failed", message: "Could not reach Resend within 10 seconds. Retry and check Vercel runtime logs if this continues." }
  }
}
