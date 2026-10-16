"use client"
import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react"
import { useTranslations } from "@/context/useTranslations"

export function TripLoadState({ status, onRetry }: { status: "loading" | "error"; onRetry: () => void }) {
  const { tr } = useTranslations()
  if (status === "loading") return <div role="status" className="rounded-3xl border border-stone-200 bg-white px-5 py-12 text-center">
    <LoaderCircle size={28} aria-hidden="true" className="mx-auto text-primary motion-safe:animate-spin" />
    <p className="mt-4 font-semibold text-stone-600">{tr("Loading trips...")}</p>
  </div>
  return <div role="alert" className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-10 text-center sm:px-8">
    <AlertCircle size={30} aria-hidden="true" className="mx-auto text-amber-700" />
    <h3 className="mt-4 text-xl font-bold text-stone-900">{tr("We couldn’t load the trips")}</h3>
    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">{tr("Check your connection and try again. Your saved favorites and filter choices are kept.")}</p>
    <button type="button" onClick={onRetry} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-stone-950 transition hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      <RefreshCw size={17} aria-hidden="true" />{tr("Retry")}
    </button>
  </div>
}
