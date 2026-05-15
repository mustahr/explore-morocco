import { createTestimonial, getTestimonials, type Testimonial } from "@/lib/content-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const testimonials = await getTestimonials()
  return Response.json({ testimonials })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const testimonial = (await request.json()) as Testimonial
  const createdTestimonial = await createTestimonial(testimonial)

  if (!createdTestimonial) {
    return Response.json({ error: "Testimonial already exists" }, { status: 409 })
  }

  return Response.json({ testimonial: createdTestimonial }, { status: 201 })
}
