import { normalizeCampaignDesign, renderCampaignEmail } from "@/lib/email-template"
import { getSiteUrl } from "@/lib/site"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { campaignPayload, emailAudience, emailValid, marketingRecords, newCampaign, saveMarketingRecord, sendCampaignBatch, setEmailPreference, contactId, type EmailContact, type Campaign } from "@/lib/email-marketing"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  try {
    const [contacts, campaigns] = await Promise.all([emailAudience(), marketingRecords<Campaign>("email_campaigns")])
    return Response.json({ contacts, campaigns: campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), configured: Boolean(process.env.RESEND_API_KEY?.trim()) }, { headers: { "Cache-Control": "no-store" } })
  } catch { return Response.json({ error: "Could not load the email audience. Check the database connection." }, { status: 503 }) }
}
export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  try {
    const body = await request.json()
    if (!body || typeof body.action !== "string") return Response.json({ error: "Invalid action." }, { status: 400 })
    if (body.action === "suppress") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
      if (!emailValid(email)) return Response.json({ error: "Invalid email." }, { status: 400 })
      await setEmailPreference(email, false, true)
      return Response.json({ saved: true })
    }
    if (body.action === "create" || body.action === "test" || body.action === "preview") {
      const subject = typeof body.subject === "string" ? body.subject.trim() : ""
      const message = typeof body.message === "string" ? body.message.trim() : ""
      if (!subject || subject.length > 180 || /[\r\n]/.test(subject) || !message || message.length > 20000) return Response.json({ error: "Add a subject (up to 180 characters) and message (up to 20,000 characters)." }, { status: 400 })
      let design
      try { design = normalizeCampaignDesign(body.design) } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Invalid design settings." }, { status: 400 }) }
      if (body.action === "preview") return Response.json({ html: renderCampaignEmail(subject, message, getSiteUrl(), "#unsubscribe-preview", design) })
      if (body.action === "test") {
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
        if (!emailValid(email)) return Response.json({ error: "Enter a valid test email." }, { status: 400 })
        if (!process.env.RESEND_API_KEY?.trim()) return Response.json({ error: "RESEND_API_KEY is missing. Add it to Vercel Production and redeploy." }, { status: 503 })
        const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(campaignPayload(`[TEST] ${subject}`, message, email, design)), signal: AbortSignal.timeout(20000) })
        const result = await response.json().catch(() => null)
        if (!response.ok || !result?.id) return Response.json({ error: `Test email rejected (HTTP ${response.status}). Check Resend logs and sender verification.` }, { status: 502 })
        return Response.json({ message: "Resend accepted the test email. Check inbox/spam; acceptance does not guarantee delivery." })
      }
      if (!["subscribers", "all", "single"].includes(body.audience) || (body.audience === "all" && body.permissionConfirmed !== true)) return Response.json({ error: "Choose an audience and confirm permission for all-contact campaigns." }, { status: 400 })
      const contacts = await emailAudience()
      let recipients: string[]
      if (body.audience === "single") {
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
        if (!emailValid(email) || /[,;]/.test(email)) return Response.json({ error: "Enter exactly one valid client email address." }, { status: 400 })
        const contact = contacts.find((item) => item.email === email)
        const preferences = await marketingRecords<{ email: string; unsubscribed: boolean }>("email_preferences")
        if (contact?.unsubscribed || preferences.some((item) => item.email === email && item.unsubscribed)) return Response.json({ error: "This client has unsubscribed from these emails." }, { status: 400 })
        const now = new Date().toISOString()
        await saveMarketingRecord<EmailContact>("email_contacts", {
          id: contactId(email), email, name: contact?.name || email,
          sources: [...new Set([...(contact?.sources || []), "Individual email"])],
          firstSeen: contact?.firstSeen || now, lastSeen: now,
          subscribed: contact?.subscribed || false, unsubscribed: false,
        })
        recipients = [email]
      } else {
        recipients = contacts.filter((contact) => !contact.unsubscribed && (body.audience === "all" || contact.subscribed)).map((contact) => contact.email).sort()
      }
      if (!recipients.length) return Response.json({ error: "No eligible contacts in this audience." }, { status: 400 })
      const campaign = newCampaign(subject, message, body.audience, recipients, design)
      await saveMarketingRecord("email_campaigns", campaign)
      return Response.json({ campaign })
    }
    if (body.action === "send") {
      const campaign = (await marketingRecords<Campaign>("email_campaigns")).find((item) => item.id === body.id)
      if (!campaign) return Response.json({ error: "Campaign not found." }, { status: 404 })
      if (campaign.status === "complete") return Response.json({ campaign })
      const index = Array.from({ length: Math.ceil(campaign.recipients.length / 100) }, (_, i) => i).find((i) => !campaign.batches[String(i)])!
      try { return Response.json({ campaign: await sendCampaignBatch(campaign, index) }) }
      catch (error) {
        campaign.lastError = error instanceof Error ? error.message : "Could not send campaign."
        await saveMarketingRecord("email_campaigns", campaign)
        return Response.json({ error: campaign.lastError, campaign }, { status: 502 })
      }
    }
    return Response.json({ error: "Unknown action." }, { status: 400 })
  } catch { return Response.json({ error: "Could not complete this action. Check the connection and try again." }, { status: 500 }) }
}
