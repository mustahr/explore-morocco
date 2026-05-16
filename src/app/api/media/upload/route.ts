import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { uploadImageToStorage } from "@/lib/media-storage"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const folder = formData.get("folder")

    if (!(file instanceof File)) {
      return Response.json({ error: "No image file was provided." }, { status: 400 })
    }

    const upload = await uploadImageToStorage(file, typeof folder === "string" ? folder : "uploads")

    return Response.json(upload, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not upload image." },
      { status: 500 }
    )
  }
}
