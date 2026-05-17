"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "relative z-10 mb-0 bg-background shadow-[0_30px_80px_rgba(13,13,13,0.35)] md:mb-[28rem]" : "flex-1"}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  )
}
