import { type Destination } from "@/lib/data"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { deleteDestination, getDestinationBySlug, getPublishedDestinationBySlug, updateDestination } from "@/lib/destinations-db"

type RouteContext = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const destination = wantsAdminData && isAdminRequest(request) ? await getDestinationBySlug(slug) : await getPublishedDestinationBySlug(slug)

  if (!destination) {
    return Response.json({ error: "Destination not found" }, { status: 404 })
  }

  return Response.json({ destination })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { slug } = await params
  const updates = (await request.json()) as Partial<Destination>
  const destination = await updateDestination(slug, updates)

  if (!destination) {
    return Response.json({ error: "Destination not found" }, { status: 404 })
  }

  return Response.json({ destination })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { slug } = await params
  const deleted = await deleteDestination(slug)

  if (!deleted) {
    return Response.json({ error: "Destination not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
