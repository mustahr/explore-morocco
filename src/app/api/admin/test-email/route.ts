import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { sendEmailNotification } from "@/lib/notifications"

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()
  const result = await sendEmailNotification({
    type: "lead", title: "Dunexplore Morocco — notification test",
    fields: { message: "This is a test of your website's booking and contact email notifications.", time: new Date().toISOString() },
  })
  return Response.json(result, { status: result.status === "sent" ? 200 : result.status === "skipped" ? 503 : 502 })
}
