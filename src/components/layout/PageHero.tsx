import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { Sparkles } from "lucide-react"

export function PageHero({ image, imageAlt, eyebrow, title, description }: { image: string; imageAlt: string; eyebrow: string; title: string; description: string }) {
  return <section className="relative isolate flex min-h-[24rem] items-center overflow-hidden bg-stone-950 py-16 sm:min-h-[28rem] lg:min-h-[32rem] lg:py-24">
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <ImageWithFallback src={image} alt={imageAlt} fill preload sizes="100vw" quality={85} parallax parallaxOffset={76} className="object-cover" fallbackClassName="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
    </div>
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 backdrop-blur-md sm:text-sm"><Sparkles size={16} className="shrink-0" />{eyebrow}</span>
        <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-7xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">{description}</p>
      </div>
    </div>
  </section>
}
