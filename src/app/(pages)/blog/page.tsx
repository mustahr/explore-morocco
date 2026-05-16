"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react"
import { type BlogPost } from "@/lib/data"
import { useEffect, useMemo, useState } from "react"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))],
    [blogPosts]
  )

  useEffect(() => {
    let ignore = false

    fetch("/api/blog")
      .then((response) => response.json() as Promise<{ posts: BlogPost[] }>)
      .then((data) => {
        if (!ignore) setBlogPosts(data.posts)
      })

    return () => {
      ignore = true
    }
  }, [])

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="pt-15 lg:pt-20">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=80"
            alt="Morocco coastal travel journal"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-primary/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(217,119,6,0.45),transparent_27%),radial-gradient(circle_at_18%_80%,rgba(14,165,233,0.22),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200 ring-1 ring-white/15 backdrop-blur-md">
              <BookOpen size={16} />
              Travel Journal
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold text-white">
              Morocco Travel Blog
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              Expert guides, insider tips, and stories from the heart of Morocco.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
                <Sparkles size={15} className="text-amber-200" />
                {blogPosts.length} guides
              </span>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
                Local-first travel advice
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center gap-3 rounded-3xl border border-stone-200 bg-white p-3 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                }`}
              >
                {cat}
                <span className="ml-2 text-xs opacity-70">
                  {cat === "All" ? blogPosts.length : blogPosts.filter((post) => post.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-stone-900">No articles in this category yet</h2>
              <p className="mt-3 text-stone-500">Try another category or come back soon for new Morocco guides.</p>
            </div>
          ) : (
            <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {filteredPosts.slice(0, 1).map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-6">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackClassName="w-full h-full"
                    />
                  </div>
                  <span className="text-primary text-sm font-semibold">{post.category}</span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 mt-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-stone-500 text-lg mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                    <span>By {post.author}</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            <div className="space-y-6">
              {filteredPosts.slice(1, 4).map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group flex gap-4">
                    <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        fallbackClassName="w-full h-full"
                      />
                    </div>
                    <div>
                      <span className="text-primary text-xs font-semibold">{post.category}</span>
                      <h3 className="font-bold text-stone-900 mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-stone-400 mt-2">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(4).map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 card-hover">
                    <div className="aspect-[16/10] overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        fallbackClassName="w-full h-full"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-primary text-xs font-semibold">{post.category}</span>
                      <h3 className="text-lg font-bold text-stone-900 mt-2 mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-stone-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {post.date}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <span className="text-primary text-sm font-medium flex items-center gap-1">
                          Read <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
