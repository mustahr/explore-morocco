import { randomUUID } from "crypto"
import { createClient } from "@supabase/supabase-js"

const DEFAULT_BUCKET = "morocco-travel-images"
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"])

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}

function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET
}

function sanitizePathSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^-+|-+$/g, "")
    .replace(/^\/|\/$/g, "")
}

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName

  return file.type.split("/").pop()?.replace("jpeg", "jpg") || "jpg"
}

function isWebSafeImage(file: File) {
  return ALLOWED_IMAGE_TYPES.has(file.type)
}

export function isMediaStorageConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey())
}

export async function uploadImageToStorage(file: File, folder = "uploads") {
  if (!isMediaStorageConfigured()) {
    throw new Error("Supabase storage is not configured.")
  }

  if (!isWebSafeImage(file)) {
    throw new Error("Upload a JPG, PNG, WebP, GIF, or AVIF image so it can preview correctly in the browser.")
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 10MB or smaller.")
  }

  const bucket = getStorageBucket()
  const supabase = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw new Error(listError.message)

  const existingBucket = buckets.find((item) => item.name === bucket)

  if (!existingBucket) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
    })

    if (createError) throw new Error(createError.message)
  } else if (!existingBucket.public) {
    const { error: updateError } = await supabase.storage.updateBucket(bucket, {
      public: true,
    })

    if (updateError) throw new Error(updateError.message)
  }

  const safeFolder = sanitizePathSegment(folder) || "uploads"
  const path = `${safeFolder}/${Date.now()}-${randomUUID()}.${extensionFor(file)}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  const publicResponse = await fetch(data.publicUrl, { method: "HEAD" })

  if (!publicResponse.ok) {
    throw new Error(
      "Image uploaded, but its public URL is not readable. Make the Supabase storage bucket public and try again."
    )
  }

  return {
    bucket,
    path,
    url: data.publicUrl,
  }
}
