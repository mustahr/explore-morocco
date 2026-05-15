import { deleteTestimonial, updateTestimonial, type Testimonial } from "@/lib/content-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const updates = (await request.json()) as Partial<Testimonial>
  const testimonial = await updateTestimonial(id, updates)

  if (!testimonial) {
    return Response.json({ error: "Testimonial not found" }, { status: 404 })
  }

  return Response.json({ testimonial })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { id } = await params
  const deleted = await deleteTestimonial(id)

  if (!deleted) {
    return Response.json({ error: "Testimonial not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
