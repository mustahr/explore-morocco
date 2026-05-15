import type { Metadata } from "next"
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/layout/AppShell"
import { AppProvider } from "@/context/AppContext"
import { GlobalImageHandler } from "@/components/ui/GlobalImageHandler"

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
  title: "MoroccoAI - Plan Your Perfect Morocco Trip with AI",
  description: "Discover curated experiences, hidden gems, and authentic adventures across Morocco. Let AI create your perfect itinerary.",
  keywords: ["Morocco travel", "Morocco tours", "AI travel planner", "Marrakech", "Sahara desert", "Chefchaouen", "Morocco experiences"],
  openGraph: {
    title: "MoroccoAI - Plan Your Perfect Morocco Trip with AI",
    description: "Discover curated experiences, hidden gems, and authentic adventures across Morocco.",
    type: "website",
    locale: "en_US",
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
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProvider>
          <GlobalImageHandler />
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  )
}
