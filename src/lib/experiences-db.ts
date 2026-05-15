import { readFile, writeFile } from "fs/promises"
import path from "path"
import { isPublished, type Experience } from "@/lib/data"
import { deleteCloudRecord, getCloudRecord, getCloudRecords, replaceCloudRecords, upsertCloudRecord } from "@/lib/cloud-db"

const experiencesDatabasePath = path.join(process.cwd(), "data", "experiences.json")
const recordType = "experiences"

async function readExperiencesDatabase(): Promise<Experience[]> {
  const file = await readFile(experiencesDatabasePath, "utf8")
  return JSON.parse(file) as Experience[]
}

async function writeExperiencesDatabase(experiences: Experience[]) {
  await writeFile(experiencesDatabasePath, `${JSON.stringify(experiences, null, 2)}\n`, "utf8")
}

export async function getExperiences() {
  return (await getCloudRecords<Experience>(recordType)) ?? readExperiencesDatabase()
}

export async function getPublishedExperiences() {
  const experiences = await getExperiences()
  return experiences.filter(isPublished)
}

export async function getExperienceById(id: string) {
  const cloudExperience = await getCloudRecord<Experience>(recordType, id)
  if (cloudExperience !== undefined) return cloudExperience

  const experiences = await readExperiencesDatabase()
  return experiences.find((experience) => experience.id === id) ?? null
}

export async function getPublishedExperienceById(id: string) {
  const experience = await getExperienceById(id)
  return experience && isPublished(experience) ? experience : null
}

export async function getFeaturedExperiences(limit = 8) {
  const experiences = await getPublishedExperiences()
  return experiences.slice(0, limit)
}

export async function getRelatedExperiences(experience: Experience, limit = 3) {
  const experiences = await getPublishedExperiences()

  return experiences
    .filter((item) => item.id !== experience.id && (item.category === experience.category || item.location === experience.location))
    .slice(0, limit)
}

export async function createExperience(experience: Experience) {
  const cloudExperiences = await getCloudRecords<Experience>(recordType)
  if (cloudExperiences !== undefined) {
    if (cloudExperiences.some((item) => item.id === experience.id)) return null
    await upsertCloudRecord(recordType, experience.id, experience, cloudExperiences.length)
    return experience
  }

  const experiences = await readExperiencesDatabase()
  const existingExperience = experiences.find((item) => item.id === experience.id)

  if (existingExperience) {
    return null
  }

  experiences.push(experience)
  await writeExperiencesDatabase(experiences)

  return experience
}

export async function updateExperience(id: string, updates: Partial<Experience>) {
  const cloudExperience = await getCloudRecord<Experience>(recordType, id)
  if (cloudExperience !== undefined) {
    if (!cloudExperience) return null
    const updatedExperience = { ...cloudExperience, ...updates, id }
    await upsertCloudRecord(recordType, id, updatedExperience)
    return updatedExperience
  }

  const experiences = await readExperiencesDatabase()
  const experienceIndex = experiences.findIndex((experience) => experience.id === id)

  if (experienceIndex === -1) {
    return null
  }

  const updatedExperience = {
    ...experiences[experienceIndex],
    ...updates,
    id: experiences[experienceIndex].id,
  }

  experiences[experienceIndex] = updatedExperience
  await writeExperiencesDatabase(experiences)

  return updatedExperience
}

export async function deleteExperience(id: string) {
  const cloudExperiences = await getCloudRecords<Experience>(recordType)
  if (cloudExperiences !== undefined) {
    if (!cloudExperiences.some((experience) => experience.id === id)) return false
    await deleteCloudRecord(recordType, id)
    return true
  }

  const experiences = await readExperiencesDatabase()
  const filteredExperiences = experiences.filter((experience) => experience.id !== id)

  if (filteredExperiences.length === experiences.length) {
    return false
  }

  await writeExperiencesDatabase(filteredExperiences)
  return true
}

export async function replaceExperiences(experiences: Experience[]) {
  await replaceCloudRecords(recordType, experiences.map((experience) => ({ key: experience.id, data: experience as unknown as Record<string, unknown> })))
  return experiences
}
