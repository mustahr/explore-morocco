export const siteName = "Dunexplore Morocco"
export const defaultSiteUrl = "https://www.dunexplore-morocco.com"

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    defaultSiteUrl

  const withProtocol = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`

  return withProtocol.replace(/\/+$/, "")
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}
