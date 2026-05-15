import { createBlogPost, getBlogPosts, getPublishedBlogPosts } from "@/lib/blog-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { type BlogPost } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const wantsAdminData = new URL(request.url).searchParams.get("admin") === "1"
  const posts = wantsAdminData && isAdminRequest(request) ? await getBlogPosts() : await getPublishedBlogPosts()
  return Response.json({ posts })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const post = (await request.json()) as BlogPost
  const createdPost = await createBlogPost(post)

  if (!createdPost) {
    return Response.json({ error: "Blog post already exists" }, { status: 409 })
  }

  return Response.json({ post: createdPost }, { status: 201 })
}
