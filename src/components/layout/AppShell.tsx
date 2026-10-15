"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [footerSpace, setFooterSpace] = useState(0)
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main style={!isAdminRoute && footerSpace ? { marginBottom: footerSpace } : undefined} className={!isAdminRoute ? "relative z-10 mb-0 bg-background shadow-[0_30px_80px_rgba(13,13,13,0.35)]" : "flex-1"}>
        {children}
      </main>
      {!isAdminRoute && <Footer onRevealHeightChange={setFooterSpace} />}
    </>
  )
}
