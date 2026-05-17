import webPush, { type PushSubscription } from "web-push"
import {
  deleteAdminPushSubscription,
  getAdminPushSubscriptions,
} from "@/lib/admin-db"

type AdminPushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
}

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!publicKey || !privateKey) return false

  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@moroccoai.com",
    publicKey,
    privateKey,
  )

  return true
}

export function isAdminPushConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
  )
}

export async function sendAdminPushNotification(payload: AdminPushPayload) {
  if (!configureWebPush()) return { sent: 0, configured: false }

  const subscriptions = await getAdminPushSubscriptions()
  let sent = 0

  await Promise.all(
    subscriptions.map(async (record) => {
      try {
        await webPush.sendNotification(
          record.subscription as PushSubscription,
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            url: payload.url || "/admin",
            tag: payload.tag,
          }),
        )
        sent += 1
      } catch (error) {
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error
            ? Number((error as { statusCode?: number }).statusCode)
            : 0

        if (statusCode === 404 || statusCode === 410) {
          await deleteAdminPushSubscription(record.endpoint)
        }
      }
    }),
  )

  return { sent, configured: true }
}
