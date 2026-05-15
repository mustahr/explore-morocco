import { deleteLead, updateLead, type Lead } from "@/lib/admin-db"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params
  const updates = (await request.json()) as Partial<Lead>
  const lead = await updateLead(id, updates)

  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 })
  }

  return Response.json({ lead })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const deleted = await deleteLead(id)

  if (!deleted) {
    return Response.json({ error: "Lead not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
