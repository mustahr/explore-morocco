"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
} from "lucide-react"
import { type BlogPost } from "@/lib/data"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export default function BlogPostClient({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const whatsappMessage = encodeURIComponent(`Hi, I read "${post.title}" and want help planning a Morocco trip.`)

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <article className="bg-stone-50 pt-15 lg:pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            fill
            preload
            sizes="100vw"
            className="object-cover"
            fallbackClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-primary/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(217,119,6,0.42),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(14,165,233,0.2),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
            <ArrowLeft size={17} />
            Back to blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mt-10 max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-200 ring-1 ring-white/15 backdrop-blur-md">
              <Sparkles size={14} />
              {post.category}
            </span>
            <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl lg:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/82 md:text-xl">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/88">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-md">
                <Calendar size={16} />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-md">
                <Clock size={16} />
                {post.readTime} read
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-md">
                <MapPin size={16} />
                By {post.author}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <main className="relative z-10 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-primary hover:text-primary">
                  <Bookmark size={16} />
                  Save
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-primary hover:text-primary">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
              <button
                onClick={() => setSidebarOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 lg:hidden"
              >
                {sidebarOpen ? "Hide planning tools" : "Show planning tools"}
                <ChevronRight size={16} className={sidebarOpen ? "rotate-90 transition-transform" : "transition-transform"} />
              </button>
            </div>

            {post.tableOfContents.length > 0 && (
              <div className="mb-10 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Table of Contents</h2>
                    <p className="mt-1 text-sm text-stone-500">Jump to the section you need.</p>
                  </div>
                  <Sparkles size={20} className="text-primary" />
                </div>
                <nav className="grid gap-2 sm:grid-cols-2">
                  {post.tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-semibold text-stone-600 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                    >
                      <ChevronRight size={15} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {relatedPosts.length > 0 && (
              <section className="mt-14 border-t border-stone-200 pt-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Keep Reading</p>
                    <h2 className="mt-2 text-2xl font-bold text-stone-900">Related Articles</h2>
                  </div>
                  <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    All posts
                    <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <ImageWithFallback
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                          fallbackClassName="h-full w-full"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{relatedPost.category}</p>
                        <h3 className="mt-2 line-clamp-2 font-bold text-stone-900 group-hover:text-primary">{relatedPost.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-stone-500">{relatedPost.excerpt}</p>
                        <p className="mt-4 text-xs text-stone-400">{relatedPost.readTime} - {relatedPost.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className={`space-y-5 lg:sticky lg:top-28 ${sidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="rounded-[2rem] border border-primary/20 bg-white p-6 shadow-lg shadow-stone-900/5">
              <div className="mb-4 flex items-center gap-3">
                <Send size={20} className="text-primary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Plan from this guide</p>
                  <h2 className="font-bold text-stone-900">Turn ideas into a trip</h2>
                </div>
              </div>
              <p className="mb-5 text-sm leading-6 text-stone-600">Use this article as a starting point and get a Morocco route built around your dates.</p>
              <div className="grid gap-3">
                <Link href="/trip-generator" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
                  Generate itinerary
                </Link>
                <a
                  href={`https://wa.me/212XXXXXXXXX?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-500 hover:text-white"
                >
                  <MessageCircle size={16} />
                  Ask on WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles size={20} className="text-primary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Quick Tips</p>
                  <h2 className="font-bold text-stone-900">Use this story well</h2>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="rounded-2xl bg-stone-50 px-4 py-3">Bookmark useful sections before comparing itineraries.</li>
                <li className="rounded-2xl bg-stone-50 px-4 py-3">Share with your group before booking hotels.</li>
                <li className="rounded-2xl bg-stone-50 px-4 py-3">Use the table of contents for fast planning.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-stone-200 bg-stone-100 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Need inspiration?</p>
              <h2 className="mt-2 font-bold text-stone-900">Explore more guides</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">Discover places, food, and route ideas to build the perfect Morocco itinerary.</p>
              <Link href="/blog" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/5">
                Browse all posts
                <ChevronRight size={16} />
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-10 rounded-[2rem] bg-linear-to-r from-primary to-orange-500 p-8 text-center text-white shadow-[0_20px_60px_-30px_rgba(251,146,60,0.6)]">
          <h2 className="text-2xl font-bold">Ready to Plan Your Trip?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90">Let our AI create your perfect Morocco itinerary from the ideas in this guide.</p>
          <Link href="/trip-generator" className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold shadow-lg shadow-stone-950/20 transition hover:bg-stone-900">
            Generate Your Trip
          </Link>
        </div>
      </section>
    </article>
  )
}
