import {
  deleteAdminPushSubscription,
  getAdminPushSubscriptions,
  upsertAdminPushSubscription,
} from "@/lib/admin-db"
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { getAdminPushPublicKey, isAdminPushConfigured } from "@/lib/admin-push"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const subscriptions = await getAdminPushSubscriptions()

  return Response.json({
    configured: isAdminPushConfigured(),
    publicKey: getAdminPushPublicKey(),
    count: subscriptions.length,
  })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  if (!isAdminPushConfigured()) {
    return Response.json(
      { error: "VAPID push notification keys are not configured." },
      { status: 400 },
    )
  }

  const body = (await request.json()) as { subscription?: PushSubscriptionJSON }

  if (!body.subscription?.endpoint) {
    return Response.json({ error: "Subscription endpoint is required." }, { status: 400 })
  }

  const subscription = await upsertAdminPushSubscription(body.subscription)

  return Response.json({ subscription })
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  const body = (await request.json()) as { endpoint?: string }

  if (!body.endpoint) {
    return Response.json({ error: "Subscription endpoint is required." }, { status: 400 })
  }

  await deleteAdminPushSubscription(body.endpoint)

  return Response.json({ ok: true })
}
