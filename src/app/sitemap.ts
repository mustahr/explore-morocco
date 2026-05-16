import type { MetadataRoute } from "next"
import { getPublishedBlogPosts } from "@/lib/blog-db"
import { getPublishedDestinations } from "@/lib/destinations-db"
import { getPublishedExperiences } from "@/lib/experiences-db"
import { getPublishedTrips } from "@/lib/trips-db"
import { absoluteUrl } from "@/lib/site"

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/contact",
  "/destinations",
  "/experiences",
  "/trip-generator",
  "/trips",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, destinations, experiences, posts] = await Promise.all([
    getPublishedTrips(),
    getPublishedDestinations(),
    getPublishedExperiences(),
    getPublishedBlogPosts(),
  ])

  const now = new Date()

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route ? 0.7 : 1,
    })),
    ...trips.map((trip) => ({
      url: absoluteUrl(`/trips/${trip.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: cleanImages([trip.seo?.image, trip.image]),
    })),
    ...destinations.map((destination) => ({
      url: absoluteUrl(`/destinations/${destination.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      images: cleanImages([destination.seo?.image, destination.image]),
    })),
    ...experiences.map((experience) => ({
      url: absoluteUrl(`/experiences/${experience.id}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      images: cleanImages([experience.seo?.image, experience.image]),
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
      images: cleanImages([post.seo?.image, post.image]),
    })),
  ]
}

function cleanImages(images: Array<string | undefined>) {
  return images.filter((image): image is string => Boolean(image?.trim()))
}
