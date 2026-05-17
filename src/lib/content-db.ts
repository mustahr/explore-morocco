import { readFile, writeFile } from "fs/promises"
import path from "path"
import { deleteCloudRecord, getCloudRecord, getCloudRecords, replaceCloudRecords, upsertCloudRecord } from "@/lib/cloud-db"

export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  text: string
  rating: number
}

export interface Guide {
  id: string
  name: string
  role: string
  location: string
  image: string
  bio: string
  specialties: string[]
  languages: string[]
  yearsExperience: number
  status?: "draft" | "published"
}

export interface TravelStyle {
  id: string
  label: string
  icon: string
  description: string
}

export interface TripGeneratorOptions {
  travelStyles: TravelStyle[]
  destinations: string[]
}

export interface TripDetailFaq {
  id: string
  question: string
  answer: string
}

export interface TripDetailReview {
  id: string
  name: string
  location: string
  rating: number
  title: string
  body: string
  photo: string
}

export interface TripDetailContent {
  faqs: TripDetailFaq[]
  reviews: TripDetailReview[]
}

const testimonialsPath = path.join(process.cwd(), "data", "testimonials.json")
const guidesPath = path.join(process.cwd(), "data", "guides.json")
const tripGeneratorOptionsPath = path.join(process.cwd(), "data", "trip-generator-options.json")
const tripDetailContentPath = path.join(process.cwd(), "data", "trip-detail-content.json")

async function readJsonDatabase<T>(filePath: string): Promise<T> {
  const file = await readFile(filePath, "utf8")
  return JSON.parse(file) as T
}

async function writeJsonDatabase<T>(filePath: string, data: T) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

export async function getTestimonials() {
  return (await getCloudRecords<Testimonial>("testimonials")) ?? readJsonDatabase<Testimonial[]>(testimonialsPath)
}

export async function createTestimonial(testimonial: Testimonial) {
  const cloudTestimonials = await getCloudRecords<Testimonial>("testimonials")
  if (cloudTestimonials !== undefined) {
    if (cloudTestimonials.some((item) => item.id === testimonial.id)) return null
    await upsertCloudRecord("testimonials", testimonial.id, testimonial, cloudTestimonials.length)
    return testimonial
  }

  const testimonials = await getTestimonials()

  if (testimonials.some((item) => item.id === testimonial.id)) {
    return null
  }

  testimonials.push(testimonial)
  await writeJsonDatabase(testimonialsPath, testimonials)

  return testimonial
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const cloudTestimonial = await getCloudRecord<Testimonial>("testimonials", id)
  if (cloudTestimonial !== undefined) {
    if (!cloudTestimonial) return null
    const updatedTestimonial = { ...cloudTestimonial, ...updates, id }
    await upsertCloudRecord("testimonials", id, updatedTestimonial)
    return updatedTestimonial
  }

  const testimonials = await getTestimonials()
  const testimonialIndex = testimonials.findIndex((testimonial) => testimonial.id === id)

  if (testimonialIndex === -1) {
    return null
  }

  const updatedTestimonial = { ...testimonials[testimonialIndex], ...updates, id }
  testimonials[testimonialIndex] = updatedTestimonial
  await writeJsonDatabase(testimonialsPath, testimonials)

  return updatedTestimonial
}

export async function deleteTestimonial(id: string) {
  const cloudTestimonials = await getCloudRecords<Testimonial>("testimonials")
  if (cloudTestimonials !== undefined) {
    if (!cloudTestimonials.some((testimonial) => testimonial.id === id)) return false
    await deleteCloudRecord("testimonials", id)
    return true
  }

  const testimonials = await getTestimonials()
  const filteredTestimonials = testimonials.filter((testimonial) => testimonial.id !== id)

  if (filteredTestimonials.length === testimonials.length) {
    return false
  }

  await writeJsonDatabase(testimonialsPath, filteredTestimonials)
  return true
}

export async function getGuides() {
  const cloudGuides = await getCloudRecords<Guide>("guides")
  if (cloudGuides !== undefined && cloudGuides.length > 0) return cloudGuides

  return readJsonDatabase<Guide[]>(guidesPath)
}

export async function getPublishedGuides() {
  const guides = await getGuides()
  return guides.filter((guide) => guide.status !== "draft")
}

export async function createGuide(guide: Guide) {
  const cloudGuides = await getCloudRecords<Guide>("guides")
  if (cloudGuides !== undefined) {
    if (cloudGuides.some((item) => item.id === guide.id)) return null
    await upsertCloudRecord("guides", guide.id, guide, cloudGuides.length)
    return guide
  }

  const guides = await getGuides()

  if (guides.some((item) => item.id === guide.id)) {
    return null
  }

  guides.push(guide)
  await writeJsonDatabase(guidesPath, guides)

  return guide
}

export async function updateGuide(id: string, updates: Partial<Guide>) {
  const cloudGuide = await getCloudRecord<Guide>("guides", id)
  if (cloudGuide !== undefined) {
    const fallbackGuides = await readJsonDatabase<Guide[]>(guidesPath)
    const fallbackGuide = fallbackGuides.find((guide) => guide.id === id)

    if (!cloudGuide && !fallbackGuide) return null

    const updatedGuide = { ...(cloudGuide ?? fallbackGuide), ...updates, id } as Guide
    await upsertCloudRecord("guides", id, updatedGuide)
    return updatedGuide
  }

  const guides = await getGuides()
  const guideIndex = guides.findIndex((guide) => guide.id === id)

  if (guideIndex === -1) {
    return null
  }

  const updatedGuide = { ...guides[guideIndex], ...updates, id }
  guides[guideIndex] = updatedGuide
  await writeJsonDatabase(guidesPath, guides)

  return updatedGuide
}

export async function deleteGuide(id: string) {
  const cloudGuides = await getCloudRecords<Guide>("guides")
  if (cloudGuides !== undefined && cloudGuides.length > 0) {
    if (!cloudGuides.some((guide) => guide.id === id)) return false
    await deleteCloudRecord("guides", id)
    return true
  }

  const guides = await readJsonDatabase<Guide[]>(guidesPath)
  const filteredGuides = guides.filter((guide) => guide.id !== id)

  if (filteredGuides.length === guides.length) {
    return false
  }

  await writeJsonDatabase(guidesPath, filteredGuides)
  return true
}

export async function getTripGeneratorOptions() {
  return (await getCloudRecord<TripGeneratorOptions>("site_settings", "trip_generator_options")) ?? readJsonDatabase<TripGeneratorOptions>(tripGeneratorOptionsPath)
}

export async function updateTripGeneratorOptions(options: TripGeneratorOptions) {
  const cloudOptions = await upsertCloudRecord("site_settings", "trip_generator_options", options)
  if (cloudOptions !== undefined) return cloudOptions

  await writeJsonDatabase(tripGeneratorOptionsPath, options)
  return options
}

export async function getTripDetailContent() {
  return (await getCloudRecord<TripDetailContent>("site_settings", "trip_detail_content")) ?? readJsonDatabase<TripDetailContent>(tripDetailContentPath)
}

export async function updateTripDetailContent(content: TripDetailContent) {
  const cloudContent = await upsertCloudRecord("site_settings", "trip_detail_content", content)
  if (cloudContent !== undefined) return cloudContent

  await writeJsonDatabase(tripDetailContentPath, content)
  return content
}

export async function replaceTestimonials(testimonials: Testimonial[]) {
  await replaceCloudRecords("testimonials", testimonials.map((testimonial) => ({ key: testimonial.id, data: testimonial as unknown as Record<string, unknown> })))
  return testimonials
}

export async function replaceGuides(guides: Guide[]) {
  await replaceCloudRecords("guides", guides.map((guide) => ({ key: guide.id, data: guide as unknown as Record<string, unknown> })))
  return guides
}
