import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

async function readJson(relativePath) {
  const file = await readFile(path.join(root, relativePath), "utf8")
  return JSON.parse(file)
}

async function replaceRecords(recordType, rows) {
  const { error: deleteError } = await supabase
    .from("content_records")
    .delete()
    .eq("record_type", recordType)

  if (deleteError) throw deleteError

  if (rows.length === 0) return

  const { error } = await supabase.from("content_records").insert(
    rows.map((row, index) => ({
      record_type: recordType,
      record_key: row.key,
      data: row.data,
      position: index,
    }))
  )

  if (error) throw error
}

const recordSets = [
  ["trips", "data/trips.json", (item) => item.id],
  ["destinations", "data/destinations.json", (item) => item.slug],
  ["experiences", "data/experiences.json", (item) => item.id],
  ["blog_posts", "data/blog-posts.json", (item) => item.slug],
  ["testimonials", "data/testimonials.json", (item) => item.id],
  ["bookings", "data/bookings.json", (item) => item.id],
  ["leads", "data/leads.json", (item) => item.id],
]

for (const [recordType, filePath, getKey] of recordSets) {
  const items = await readJson(filePath)
  await replaceRecords(
    recordType,
    items.map((item) => ({ key: getKey(item), data: item }))
  )
  console.log(`Seeded ${items.length} ${recordType} records.`)
}

const tripGeneratorOptions = await readJson("data/trip-generator-options.json")
const tripDetailContent = await readJson("data/trip-detail-content.json")

await replaceRecords("site_settings", [
  { key: "trip_generator_options", data: tripGeneratorOptions },
  { key: "trip_detail_content", data: tripDetailContent },
])

console.log("Seeded site settings.")
