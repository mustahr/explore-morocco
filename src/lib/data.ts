import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const currencies = {
  MAD: { symbol: "MAD", rate: 1, name: "Moroccan Dirham" },
  EUR: { symbol: "\u20AC", rate: 0.092, name: "Euro" },
  USD: { symbol: "$", rate: 0.1, name: "US Dollar" },
}

export function formatPrice(priceInMAD: number, currency: keyof typeof currencies = "MAD"): string {
  const { symbol, rate } = currencies[currency]
  const converted = Math.round(priceInMAD * rate)
  return `${symbol}${converted.toLocaleString()}`
}

export type ContentStatus = "draft" | "published"

export interface SeoFields {
  title?: string
  description?: string
  image?: string
}

export interface PublishableContent {
  status?: ContentStatus
  seo?: SeoFields
}

export function isPublished(item: PublishableContent) {
  return item.status !== "draft"
}

export interface Destination {
  slug: string
  name: string
  nameAr?: string
  nameFr?: string
  description: string
  image: string
  images: string[]
  rating: number
  reviews: number
  bestTime: string
  highlights: string[]
  experiences: string[]
  itineraries: { days: number; title: string; price: number }[]
  details?: DestinationDetails
  status?: ContentStatus
  seo?: SeoFields
}

export interface DestinationDetails {
  intro: string
  bestFor: string[]
  areas: { title: string; description: string }[]
  food: string[]
  localTips: string[]
  gettingAround: string
  whereToStay: string
}

export interface Trip {
  id: string
  title: string
  description: string
  image: string
  images: string[]
  category: "luxury" | "budget" | "adventure" | "cultural" | "romantic" | "family"
  duration: number
  price: number
  rating: number
  reviews: number
  locations: string[]
  itinerary: { day: number; title: string; description: string }[]
  highlights: string[]
  includes: string[]
  status?: ContentStatus
  seo?: SeoFields
}

export interface Experience {
  id: string
  title: string
  description: string
  image: string
  category: string
  duration: string
  price: number
  rating: number
  location: string
  status?: ContentStatus
  seo?: SeoFields
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  readTime: string
  author: string
  authorAvatar: string
  content: string
  tableOfContents: { id: string; label: string }[]
  status?: ContentStatus
  seo?: SeoFields
}
