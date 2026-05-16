"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"

export function AnalyticsEvents() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith("/trips/")) {
      track("trip_detail_view", { path: pathname })
    } else if (pathname === "/trip-generator") {
      track("trip_generator_view")
    } else if (pathname === "/contact") {
      track("contact_page_view")
    }
  }, [pathname])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      const element = target?.closest<HTMLElement>("[data-analytics-event]")
      const eventName = element?.dataset.analyticsEvent
      if (!eventName) return

      track(eventName, {
        path: window.location.pathname,
        label: element.dataset.analyticsLabel,
      })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null
}
