type NotificationPayload = {
  type: "lead" | "booking" | "media_upload_failure"
  title: string
  fields: Record<string, string | number | boolean | null | undefined>
}

export async function notifyOperations(payload: NotificationPayload) {
  const webhookUrl = process.env.OPERATIONS_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL

  await Promise.allSettled([
    webhookUrl ? sendWebhookNotification(webhookUrl, payload) : Promise.resolve(),
    sendEmailNotification(payload),
  ])
}

async function sendWebhookNotification(webhookUrl: string, payload: NotificationPayload) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      site: process.env.NEXT_PUBLIC_SITE_URL,
      sentAt: new Date().toISOString(),
    }),
  })
}

async function sendEmailNotification(payload: NotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFICATION_EMAIL_TO
  const from = process.env.NOTIFICATION_EMAIL_FROM || "MoroccoAI <onboarding@resend.dev>"

  if (!apiKey || !to) return

  const rows = Object.entries(payload.fields)
    .map(([key, value]) => `<tr><td style="padding:6px 12px;color:#57534e">${key}</td><td style="padding:6px 12px;font-weight:600;color:#1c1917">${value ?? ""}</td></tr>`)
    .join("")

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((email) => email.trim()).filter(Boolean),
      subject: payload.title,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#1c1917">
          <h1 style="font-size:20px">${payload.title}</h1>
          <p style="color:#57534e">A new ${payload.type.replace(/_/g, " ")} event was created on MoroccoAI.</p>
          <table style="border-collapse:collapse;border:1px solid #e7e5e4">${rows}</table>
        </div>
      `,
    }),
  })
}
