import { type Destination } from "@/lib/data"
import { deleteDestination, getDestinationBySlug, updateDestination } from "@/lib/destinations-db"

type RouteContext = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)

  if (!destination) {
    return Response.json({ error: "Destination not found" }, { status: 404 })
  }

  return Response.json({ destination })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { slug } = await params
  const updates = (await request.json()) as Partial<Destination>
  const destination = await updateDestination(slug, updates)

  if (!destination) {
    return Response.json({ error: "Destination not found" }, { status: 404 })
  }

  return Response.json({ destination })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { slug } = await params
  const deleted = await deleteDestination(slug)

  if (!deleted) {
    return Response.json({ error: "Destination not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
