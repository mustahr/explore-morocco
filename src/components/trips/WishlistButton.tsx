"use client"

import { favoriteKey, type FavoriteKind } from "@/lib/favorite-keys"
import { Heart } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { useTranslations } from "@/context/useTranslations"

export function WishlistButton({ tripId, title, kind = "trip", className = "" }: { tripId: string; title: string; kind?: FavoriteKind; className?: string }) {
  const { isWishlisted, toggleWishlist } = useApp()
  const { tr } = useTranslations()
  const key = favoriteKey(kind, tripId)
  const saved = isWishlisted(key)
  const label = tr(saved ? "Remove {trip} from favorites" : "Save {trip}", { trip: tr(title) })
  return <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={saved}
    onClick={() => toggleWishlist(key)}
    className={`inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/95 text-primary shadow-sm transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:hover:scale-105 motion-safe:active:scale-95 ${className}`}
  >
    <Heart size={20} aria-hidden="true" className={saved ? "fill-primary" : "text-stone-500"} />
  </button>
}
