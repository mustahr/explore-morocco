import { adminSessionCookieHeader, verifyAdminPassword } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return Response.json({ error: "Invalid admin password" }, { status: 401 })
  }

  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": adminSessionCookieHeader(),
      },
    }
  )
}
