import { deleteBlogPost, getBlogPostBySlug, getPublishedBlogPostBySlug, updateBlogPost } from "@/lib/blog-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { type BlogPost } from "@/lib/data"

type RouteContext = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const post = wantsAdminData && isAdminRequest(request) ? await getBlogPostBySlug(slug) : await getPublishedBlogPostBySlug(slug)

  if (!post) {
    return Response.json({ error: "Blog post not found" }, { status: 404 })
  }

  return Response.json({ post })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { slug } = await params
  const updates = (await request.json()) as Partial<BlogPost>
  const post = await updateBlogPost(slug, updates)

  if (!post) {
    return Response.json({ error: "Blog post not found" }, { status: 404 })
  }

  return Response.json({ post })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const { slug } = await params
  const deleted = await deleteBlogPost(slug)

  if (!deleted) {
    return Response.json({ error: "Blog post not found" }, { status: 404 })
  }

  return Response.json({ ok: true })
}
