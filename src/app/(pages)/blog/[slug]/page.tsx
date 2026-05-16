import type { Metadata } from "next"
import { getPublishedBlogPostBySlug, getPublishedBlogPosts, getRelatedBlogPosts } from "@/lib/blog-db"
import { notFound } from "next/navigation"
import BlogPostClient from "./BlogPostClient"
import { blogPostJsonLd, cleanImageList } from "@/lib/seo"

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
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      images: cleanImageList([post.seo?.image, post.image]),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: cleanImageList([post.seo?.image, post.image]),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPublishedBlogPostBySlug(resolvedParams.slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedBlogPosts(post)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }}
      />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  )
}
