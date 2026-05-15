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
