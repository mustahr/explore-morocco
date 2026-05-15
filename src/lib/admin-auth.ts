import { createHmac, timingSafeEqual } from "crypto"

export const ADMIN_SESSION_COOKIE = "morocco-admin-session"

const SESSION_VALUE = "admin"
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "development" ? "admin123" : "")
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? getAdminPassword()
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex")
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer)
}

export function createAdminSessionToken() {
  return `${SESSION_VALUE}.${sign(SESSION_VALUE)}`
}

export function isValidAdminSessionToken(token: string | undefined | null) {
  if (!token) return false

  const [value, signature] = token.split(".")
  if (value !== SESSION_VALUE || !signature) return false

  return safeCompare(signature, sign(value))
}

export function isAdminRequest(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.split("=")[1]

  return isValidAdminSessionToken(cookie)
}

export function verifyAdminPassword(password: string) {
  const adminPassword = getAdminPassword()
  if (!adminPassword) return false

  return safeCompare(password, adminPassword)
}

export function unauthorizedResponse() {
  return Response.json({ error: "Admin authentication required" }, { status: 401 })
}

export function adminSessionCookieHeader() {
  return `${ADMIN_SESSION_COOKIE}=${createAdminSessionToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ONE_WEEK_SECONDS}`
}

export function clearAdminSessionCookieHeader() {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}
