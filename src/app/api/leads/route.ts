import { createLead, getLeads } from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { notifyOperations } from "@/lib/notifications"
import { sendAdminPushNotification } from "@/lib/admin-push"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const leads = await getLeads()
  return Response.json({ leads })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      interest?: string
      source?: string
      message?: string
    }

    if (!body.name?.trim() || !body.email?.trim()) {
      return Response.json({ error: "Name and email are required." }, { status: 400 })
    }

    const lead = await createLead({
      id: `lead-${Date.now()}`,
      name: body.name.trim(),
      email: body.email.trim(),
      interest: body.interest?.trim() || body.message?.trim() || "General inquiry",
      message: body.message?.trim(),
      source: body.source?.trim() || "Website contact form",
      status: "new",
      createdAt: new Date().toISOString(),
    })

    const notificationResults = await Promise.allSettled([
      notifyOperations({
        type: "lead",
        title: "New MoroccoAI lead",
        fields: {
          name: lead.name,
          email: lead.email,
          interest: lead.interest,
          message: lead.message,
          source: lead.source,
        },
      }),
      sendAdminPushNotification({
        title: `New message from ${lead.name}`,
        body: lead.message || lead.interest || lead.email,
        url: "/admin",
        tag: lead.id,
      }),
    ])

    notificationResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Lead notification failed", result.reason)
      }
    })

    return Response.json({ lead }, { status: 201 })
  } catch (error) {
    console.error("Lead submission failed", error)
    return Response.json(
      { error: "Could not send your message right now. Please try again in a moment." },
      { status: 500 },
    )
  }
}
