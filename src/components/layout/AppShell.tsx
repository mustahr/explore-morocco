"use client"

import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLElement>(null)
  const [footerSpace, setFooterSpace] = useState(0)
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main ref={contentRef} style={!isAdminRoute && footerSpace ? { marginBottom: footerSpace } : undefined} className={!isAdminRoute ? "relative z-10 mb-0 bg-background shadow-[0_30px_80px_rgba(13,13,13,0.35)]" : "min-w-0 w-full max-w-full flex-1"}>
        {children}
      </main>
      {!isAdminRoute && <Footer contentRef={contentRef} onRevealHeightChange={setFooterSpace} />}
    </>
  )
}
