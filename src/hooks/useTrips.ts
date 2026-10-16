"use client"

import { useCallback, useEffect, useState } from "react"
import type { Trip } from "@/lib/data"
import { fetchTrips } from "@/lib/fetch-trips"

type TripState = { trips: Trip[]; status: "loading" | "success" | "error" }
export function useTrips() {
  const [state, setState] = useState<TripState>({ trips: [], status: "loading" })
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => {
    setState({ trips: [], status: "loading" })
    setAttempt((value) => value + 1)
  }, [])
  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    fetchTrips(controller.signal)
      .then((trips) => { if (active) setState({ trips, status: "success" }) })
      .catch(() => { if (active) setState({ trips: [], status: "error" }) })
      .finally(() => window.clearTimeout(timeout))
    return () => { active = false; window.clearTimeout(timeout); controller.abort() }
  }, [attempt])
  return { ...state, retry }
}
