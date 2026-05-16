import { createLead, getLeads } from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { notifyOperations } from "@/lib/notifications"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const leads = await getLeads()
  return Response.json({ leads })
}

export async function POST(request: Request) {
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
    source: body.source?.trim() || "Website contact form",
    status: "new",
    createdAt: new Date().toISOString(),
  })

  await notifyOperations({
    type: "lead",
    title: "New MoroccoAI lead",
    fields: {
      name: lead.name,
      email: lead.email,
      interest: lead.interest,
      source: lead.source,
    },
  })

  return Response.json({ lead }, { status: 201 })
}
