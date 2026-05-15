import { readFile, writeFile } from "fs/promises"
import path from "path"
import { isPublished, type BlogPost } from "@/lib/data"
import { deleteCloudRecord, getCloudRecord, getCloudRecords, replaceCloudRecords, upsertCloudRecord } from "@/lib/cloud-db"

const blogPostsDatabasePath = path.join(process.cwd(), "data", "blog-posts.json")
const recordType = "blog_posts"

async function readBlogPostsDatabase(): Promise<BlogPost[]> {
  const file = await readFile(blogPostsDatabasePath, "utf8")
  return JSON.parse(file) as BlogPost[]
}

async function writeBlogPostsDatabase(posts: BlogPost[]) {
  await writeFile(blogPostsDatabasePath, `${JSON.stringify(posts, null, 2)}\n`, "utf8")
}

export async function getBlogPosts() {
  return (await getCloudRecords<BlogPost>(recordType)) ?? readBlogPostsDatabase()
}

export async function getPublishedBlogPosts() {
  const posts = await getBlogPosts()
  return posts.filter(isPublished)
}

export async function getBlogPostBySlug(slug: string) {
  const cloudPost = await getCloudRecord<BlogPost>(recordType, slug)
  if (cloudPost !== undefined) return cloudPost

  const posts = await readBlogPostsDatabase()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const post = await getBlogPostBySlug(slug)
  return post && isPublished(post) ? post : null
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const posts = await getPublishedBlogPosts()
  return posts.filter((item) => item.category === post.category && item.slug !== post.slug).slice(0, limit)
}

export async function createBlogPost(post: BlogPost) {
  const cloudPosts = await getCloudRecords<BlogPost>(recordType)
  if (cloudPosts !== undefined) {
    if (cloudPosts.some((item) => item.slug === post.slug)) return null
    await upsertCloudRecord(recordType, post.slug, post, cloudPosts.length)
    return post
  }

  const posts = await readBlogPostsDatabase()
  const existingPost = posts.find((item) => item.slug === post.slug)

  if (existingPost) {
    return null
  }

  posts.push(post)
  await writeBlogPostsDatabase(posts)

  return post
}

export async function updateBlogPost(slug: string, updates: Partial<BlogPost>) {
  const cloudPost = await getCloudRecord<BlogPost>(recordType, slug)
  if (cloudPost !== undefined) {
    if (!cloudPost) return null
    const updatedPost = { ...cloudPost, ...updates, slug }
    await upsertCloudRecord(recordType, slug, updatedPost)
    return updatedPost
  }

  const posts = await readBlogPostsDatabase()
  const postIndex = posts.findIndex((post) => post.slug === slug)

  if (postIndex === -1) {
    return null
  }

  const updatedPost = {
    ...posts[postIndex],
    ...updates,
    slug: posts[postIndex].slug,
  }

  posts[postIndex] = updatedPost
  await writeBlogPostsDatabase(posts)

  return updatedPost
}

export async function deleteBlogPost(slug: string) {
  const cloudPosts = await getCloudRecords<BlogPost>(recordType)
  if (cloudPosts !== undefined) {
    if (!cloudPosts.some((post) => post.slug === slug)) return false
    await deleteCloudRecord(recordType, slug)
    return true
  }

  const posts = await readBlogPostsDatabase()
  const filteredPosts = posts.filter((post) => post.slug !== slug)

  if (filteredPosts.length === posts.length) {
    return false
  }

  await writeBlogPostsDatabase(filteredPosts)
  return true
}

export async function replaceBlogPosts(posts: BlogPost[]) {
  await replaceCloudRecords(recordType, posts.map((post) => ({ key: post.slug, data: post as unknown as Record<string, unknown> })))
  return posts
}
