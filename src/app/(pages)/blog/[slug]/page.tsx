import type { Metadata } from "next"
import { getPublishedBlogPostBySlug, getPublishedBlogPosts, getRelatedBlogPosts } from "@/lib/blog-db"
import { notFound } from "next/navigation"
import BlogPostClient from "./BlogPostClient"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const blogPosts = await getPublishedBlogPosts()
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) return {}

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: [post.seo?.image || post.image],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPublishedBlogPostBySlug(resolvedParams.slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedBlogPosts(post)

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}
