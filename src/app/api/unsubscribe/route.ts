import { setEmailPreference, unsubscribeEmail } from "@/lib/email-marketing"
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body?.token === "string" && body.token.length <= 1000 ? unsubscribeEmail(body.token) : null
    if (!email) return Response.json({ error: "This unsubscribe link is invalid." }, { status: 400 })
    await setEmailPreference(email, false, true)
    return Response.json({ message: "You are unsubscribed from newsletters and offers." })
  } catch { return Response.json({ error: "Could not unsubscribe. Please contact contact@dunexplore-morocco.com." }, { status: 503 }) }
}
