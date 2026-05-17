import { deleteGuide, updateGuide, type Guide } from "@/lib/content-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const updates = (await request.json()) as Partial<Guide>
  const guide = await updateGuide(id, updates)

  if (!guide) {
    return Response.json({ error: "Guide not found" }, { status: 404 })
  }

  return Response.json({ guide })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const deleted = await deleteGuide(id)

  if (!deleted) {
    return Response.json({ error: "Guide not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
