import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  preload?: boolean
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  fill,
  width,
  height,
  sizes,
  preload,
  quality = 75,
  onLoad,
  onError,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center",
          fallbackClassName || className
        )}
        aria-hidden="true"
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : (width ?? 1200)}
      height={fill ? undefined : (height ?? 800)}
      sizes={sizes}
      preload={preload}
      quality={quality}
      className={className}
      onLoad={onLoad}
      onError={() => {
        onError?.()
        setError(true)
      }}
    />
  )
}
