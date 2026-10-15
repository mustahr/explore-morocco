import { normalizeCampaignDesign, renderCampaignEmail } from "@/lib/email-template"
import { getSiteUrl } from "@/lib/site"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { campaignPayload, emailAudience, emailValid, marketingRecords, newCampaign, saveMarketingRecord, sendCampaignBatch, setEmailPreference, contactId, deleteMarketingRecord, type EmailContact, type Campaign } from "@/lib/email-marketing"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  try {
    const [contacts, campaigns] = await Promise.all([emailAudience(), marketingRecords<Campaign>("email_campaigns")])
    return Response.json({ siteUrl: getSiteUrl(), contacts, campaigns: campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), configured: Boolean(process.env.RESEND_API_KEY?.trim()) }, { headers: { "Cache-Control": "no-store" } })
  } catch { return Response.json({ error: "Could not load the email audience. Check the database connection." }, { status: 503 }) }
}
export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  try {
    const body = await request.json()
    if (!body || typeof body.action !== "string") return Response.json({ error: "Invalid action." }, { status: 400 })
    if (body.action === "delete") {
      const campaign = (await marketingRecords<Campaign>("email_campaigns")).find((item) => item.id === body.id)
      if (!campaign) return Response.json({ error: "History entry not found." }, { status: 404 })
      if (campaign.status === "sending" && !campaign.lastError) return Response.json({ error: "This campaign is sending. Wait until it finishes before deleting its history." }, { status: 409 })
      await deleteMarketingRecord("email_campaigns", campaign.id)
      return Response.json({ deleted: true })
    }
    if (body.action === "suppress") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
      if (!emailValid(email)) return Response.json({ error: "Invalid email." }, { status: 400 })
      await setEmailPreference(email, false, true)
      return Response.json({ saved: true })
    }
    if (body.action === "create" || body.action === "update" || body.action === "test" || body.action === "preview") {
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
      if (!["subscribers", "all", "single", "selected"].includes(body.audience) || (body.audience === "all" && body.permissionConfirmed !== true)) return Response.json({ error: "Choose an audience and confirm permission for all-contact campaigns." }, { status: 400 })
      let existing: Campaign | undefined
      if (body.action === "update") {
        existing = (await marketingRecords<Campaign>("email_campaigns")).find((item) => item.id === body.id)
        if (!existing) return Response.json({ error: "Draft not found." }, { status: 404 })
        if (existing.status !== "draft" || Object.keys(existing.batches).length || existing.lastError) return Response.json({ error: "Sending has already been attempted. Use Edit as new to create a separate draft." }, { status: 409 })
      }
      const contacts = await emailAudience()
      let recipients: string[]
      if (body.audience === "single" || body.audience === "selected") {
        const raw = body.audience === "single" ? [body.email] : body.emails
        if (!Array.isArray(raw) || !raw.length || raw.length > 1000 || raw.some((email) => typeof email !== "string" || !emailValid(email.trim()) || /[,;]/.test(email))) return Response.json({ error: "Select 1 to 1,000 valid client email addresses." }, { status: 400 })
        recipients = [...new Set(raw.map((email: string) => email.trim().toLowerCase()))].sort()
        const preferences = await marketingRecords<{ email: string; unsubscribed: boolean }>("email_preferences")
        if (recipients.some((email) => contacts.some((contact) => contact.email === email && contact.unsubscribed) || preferences.some((item) => item.email === email && item.unsubscribed))) return Response.json({ error: "A selected client has unsubscribed. Remove that address before sending." }, { status: 400 })
        const now = new Date().toISOString()
        for (const email of recipients) {
          if (contacts.some((contact) => contact.email === email)) continue
          await saveMarketingRecord<EmailContact>("email_contacts", {
            id: contactId(email), email, name: email, sources: ["Individual email"],
            firstSeen: now, lastSeen: now, subscribed: false, unsubscribed: false,
          })
        }
      } else {
        recipients = contacts.filter((contact) => !contact.unsubscribed && (body.audience === "all" || contact.subscribed)).map((contact) => contact.email).sort()
      }
      if (!recipients.length) return Response.json({ error: "No eligible contacts in this audience." }, { status: 400 })
      const draft = newCampaign(subject, message, body.audience, recipients, design)
      const campaign: Campaign = existing ? { ...draft, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString(), draftEditedAt: new Date().toISOString() } : draft
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
