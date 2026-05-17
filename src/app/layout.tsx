import type { Metadata } from "next"
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/layout/AppShell"
import { AppProvider } from "@/context/AppContext"
import { GlobalImageHandler } from "@/components/ui/GlobalImageHandler"
import { getSiteUrl, siteName } from "@/lib/site"
import { Analytics } from "@vercel/analytics/react"
import { AnalyticsEvents } from "@/components/analytics/AnalyticsEvents"

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MoroccoAI - Plan Your Perfect Morocco Trip with AI",
    template: `%s | ${siteName}`,
  },
  description: "Discover curated experiences, hidden gems, and authentic adventures across Morocco. Let AI create your perfect itinerary.",
  keywords: ["Morocco travel", "Morocco tours", "AI travel planner", "Marrakech", "Sahara desert", "Chefchaouen", "Morocco experiences"],
  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "MoroccoAI - Plan Your Perfect Morocco Trip with AI",
    description: "Discover curated experiences, hidden gems, and authentic adventures across Morocco.",
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoroccoAI - Plan Your Perfect Morocco Trip with AI",
    description: "Discover curated experiences, hidden gems, and authentic adventures across Morocco.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <AppProvider>
          <GlobalImageHandler />
          <Analytics />
          <AnalyticsEvents />
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  )
}
