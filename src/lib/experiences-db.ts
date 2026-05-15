import { readFile, writeFile } from "fs/promises"
import path from "path"
import { type Experience } from "@/lib/data"

const experiencesDatabasePath = path.join(process.cwd(), "data", "experiences.json")

async function readExperiencesDatabase(): Promise<Experience[]> {
  const file = await readFile(experiencesDatabasePath, "utf8")
  return JSON.parse(file) as Experience[]
}

async function writeExperiencesDatabase(experiences: Experience[]) {
  await writeFile(experiencesDatabasePath, `${JSON.stringify(experiences, null, 2)}\n`, "utf8")
}

export async function getExperiences() {
  return readExperiencesDatabase()
}

export async function getExperienceById(id: string) {
  const experiences = await readExperiencesDatabase()
  return experiences.find((experience) => experience.id === id) ?? null
}

export async function getFeaturedExperiences(limit = 8) {
  const experiences = await readExperiencesDatabase()
  return experiences.slice(0, limit)
}

export async function getRelatedExperiences(experience: Experience, limit = 3) {
  const experiences = await readExperiencesDatabase()

  return experiences
    .filter((item) => item.id !== experience.id && (item.category === experience.category || item.location === experience.location))
    .slice(0, limit)
}

export async function createExperience(experience: Experience) {
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
  const experiences = await readExperiencesDatabase()
  const filteredExperiences = experiences.filter((experience) => experience.id !== id)

  if (filteredExperiences.length === experiences.length) {
    return false
  }

  await writeExperiencesDatabase(filteredExperiences)
  return true
}
