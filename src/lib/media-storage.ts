import { randomUUID } from "crypto"
import { put } from "@vercel/blob"

// Server uploads must stay below Vercel's request-body limit, including multipart overhead.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/gif": "gif", "image/avif": "avif",
}

export function isMediaStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

export async function uploadImageToStorage(file: File, folder = "uploads") {
  if (!isMediaStorageConfigured()) throw new Error("Create a public Vercel Blob store and connect it to this project before uploading images.")
  const extension = IMAGE_EXTENSIONS[file.type]
  if (!extension) throw new Error("Upload a JPG, PNG, WebP, GIF, or AVIF image.")
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Images must be between 1 byte and 4MB.")
  const safeFolder = folder.toLowerCase().replace(/[^a-z0-9/-]/g, "-").split("/").filter(Boolean).join("/") || "uploads"
  const blob = await put(`${safeFolder}/${randomUUID()}.${extension}`, file, {
    access: "public",
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
  return { bucket: "vercel-blob", path: blob.pathname, url: blob.url }
}
