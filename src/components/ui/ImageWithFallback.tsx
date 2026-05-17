"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useSpring } from "framer-motion"
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
  parallax?: boolean
  parallaxOffset?: number
  parallaxClassName?: string
  parallaxStrength?: number
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
  parallax = true,
  parallaxOffset = 36,
  parallaxClassName,
  parallaxStrength = 1,
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

  const image = (
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

  if (!parallax) {
    return image
  }

  return (
    <ParallaxImage
      fill={fill}
      offset={parallaxOffset}
      className={parallaxClassName}
      strength={parallaxStrength}
    >
      {image}
    </ParallaxImage>
  )
}

function ParallaxImage({
  children,
  fill,
  offset,
  className,
  strength,
}: {
  children: ReactNode
  fill?: boolean
  offset: number
  className?: string
  strength: number
}) {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const y = useSpring(0, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  })

  useEffect(() => {
    if (shouldReduceMotion) {
      y.set(0)
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const node = parallaxRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const progress = Math.min(
        1,
        Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height))
      )

      y.set((offset - progress * offset * 2) * strength)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [offset, shouldReduceMotion, strength, y])

  if (fill) {
    return (
      <div
        ref={parallaxRef}
        className="absolute inset-0"
      >
        <motion.div
          className={cn("absolute inset-x-0", className)}
          style={{
            y,
            top: -offset,
            bottom: -offset,
            scale: shouldReduceMotion ? 1 : 1 + Math.min(0.18, offset / 260),
            willChange: "transform",
          }}
        >
          {children}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      ref={parallaxRef}
      className={className}
      style={{ y, willChange: "transform" }}
    >
      {children}
    </motion.div>
  )
}
