import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { sendAdminPushNotification } from "@/lib/admin-push"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const result = await sendAdminPushNotification({
    title: "Saharavanta test notification",
    body: "Background notifications are connected for this device.",
    url: "/admin",
    tag: `admin-push-test-${Date.now()}`,
  })

  return Response.json(result)
}
