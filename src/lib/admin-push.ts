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

function sanitizeVapidKey(key: string | undefined) {
  return (key || "").trim().replace(/^["']|["']$/g, "").replace(/\s/g, "")
}

export function getAdminPushPublicKey() {
  return sanitizeVapidKey(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
}

export function isValidVapidPublicKey(publicKey: string) {
  try {
    const padding = "=".repeat((4 - (publicKey.length % 4)) % 4)
    const bytes = Buffer.from(
      `${publicKey}${padding}`.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    )

    return bytes.length === 65 && bytes[0] === 4
  } catch {
    return false
  }
}

function configureWebPush() {
  const publicKey = getAdminPushPublicKey()
  const privateKey = sanitizeVapidKey(process.env.VAPID_PRIVATE_KEY)

  if (!publicKey || !privateKey || !isValidVapidPublicKey(publicKey)) return false

  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@moroccoai.com",
    publicKey,
    privateKey,
  )

  return true
}

export function isAdminPushConfigured() {
  const publicKey = getAdminPushPublicKey()

  return Boolean(publicKey && isValidVapidPublicKey(publicKey) && sanitizeVapidKey(process.env.VAPID_PRIVATE_KEY))
}

export async function sendAdminPushNotification(payload: AdminPushPayload) {
  if (!configureWebPush()) return { sent: 0, configured: false }

  const subscriptions = await getAdminPushSubscriptions()
  let sent = 0
  let failed = 0

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
        failed += 1
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error
            ? Number((error as { statusCode?: number }).statusCode)
            : 0

        if (statusCode === 404 || statusCode === 410) {
          await deleteAdminPushSubscription(record.endpoint)
        }

        console.error("Admin push notification failed", {
          endpoint: record.endpoint,
          statusCode,
          error,
        })
      }
    }),
  )

  return { sent, failed, configured: true }
}
