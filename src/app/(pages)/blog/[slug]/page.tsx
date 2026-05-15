import { blogPosts } from "@/lib/data"
import BlogPostClient from "./BlogPostClient"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return <BlogPostClient params={resolvedParams} />
}
