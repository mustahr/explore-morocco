"use client"

import Link from "next/link"
import { useState } from "react"
import { notFound } from "next/navigation"
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
import { blogPosts } from "@/lib/data"

export default function BlogPostClient({ params }: { params: { slug: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const post = blogPosts.find((item) => item.slug === params.slug)

  if (!post) notFound()

  const relatedPosts = blogPosts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 3)
  const whatsappMessage = encodeURIComponent(`Hi, I read "${post.title}" and want help planning a Morocco trip.`)

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <article className="bg-stone-50 pt-15 lg:pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
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
              className="prose prose-lg max-w-none prose-headings:text-stone-950 prose-h2:mt-12 prose-h2:mb-5 prose-h3:mt-8 prose-h3:mb-4 prose-p:text-stone-600 prose-p:leading-8 prose-p:mb-7 prose-a:text-primary prose-strong:text-stone-950 prose-ul:space-y-2 prose-ol:space-y-2"
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
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={relatedPost.image} alt={relatedPost.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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


// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { notFound } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   Clock,
//   ArrowLeft,
//   Share2,
//   Bookmark,
//   ChevronRight,
//   Sparkles,
//   MapPin,
//   MessageCircle,
//   Send,
// } from "lucide-react";
// import { blogPosts } from "@/lib/data";

// export default function BlogPostClient({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const post = blogPosts.find((p) => p.slug === params.slug);
//   if (!post) notFound();
//   const whatsappMessage = encodeURIComponent(`Hi, I read "${post.title}" and want help planning a Morocco trip.`);

//   // Get related posts (same category, excluding current post)
//   const relatedPosts = blogPosts
//     .filter((p) => p.category === post.category && p.slug !== post.slug)
//     .slice(0, 3);

//   const scrollToSection = (id: string) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="relative pt-20 lg:pt-24">
//       <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
//       <div className="pointer-events-none absolute right-0 top-10 h-52 w-52 rounded-full bg-primary/5 blur-3xl" />
//       <article className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
//         <Link
//           href="/blog"
//           className="inline-flex items-center gap-2 text-stone-500 hover:text-primary mb-8 transition-colors"
//         >
//           <ArrowLeft size={18} />
//           Back to Blog
//         </Link>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="rounded-4xl border border-stone-200 bg-white/95 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] p-8">
//             <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
//               <Sparkles size={14} />
//               {post.category}
//             </span>
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mt-5 mb-6 tracking-tight">
//               {post.title}
//             </h1>
//             <p className="mb-8 max-w-3xl text-lg leading-relaxed text-stone-600">
//               {post.excerpt}
//             </p>
//             <div className="relative overflow-hidden rounded-4xl mb-10 aspect-video shadow-inner shadow-stone-100">
//               <img
//                 src={post.image}
//                 alt={post.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-950/55 via-transparent to-transparent" />
//             </div>

//             <div className="grid gap-4 lg:grid-cols-[1fr_300px] items-start text-stone-500 mb-10 pb-8 border-b border-stone-200">
//               <div className="space-y-4">
//                 <div className="flex flex-wrap items-center gap-4 text-sm leading-none">
//                   <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2">
//                     <Calendar size={16} />
//                     {post.date}
//                   </span>
//                   <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2">
//                     <Clock size={16} />
//                     {post.readTime} read
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-3">
//                   <MapPin size={18} className="text-primary" />
//                   <span className="text-sm font-medium text-stone-700">
//                     By {post.author}
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-4 mb-10">
//                   <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-primary hover:text-primary text-sm transition-colors shadow-sm">
//                     <Bookmark size={16} />
//                     Save
//                   </button>
//                   <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-primary hover:text-primary text-sm transition-colors shadow-sm">
//                     <Share2 size={16} />
//                     Share
//                   </button>
//                 </div>
//               </div>

//               <div className="rounded-3xl border border-stone-200 bg-linear-to-br from-primary/5 via-white to-stone-50 p-5 shadow-sm">
//                 <div className="flex items-center gap-3 text-stone-700 mb-3">
//                   <MessageCircle size={18} className="text-primary" />
//                   <div>
//                     <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
//                       Pro tip
//                     </p>
//                     <p className="font-semibold">
//                       Read with a local mindset for deeper insights.
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-stone-500">
//                   Use the table of contents to jump straight to sections you
//                   care about, and keep this page open while planning your
//                   Morocco route.
//                 </p>
//               </div>
//             </div>

//             {post.tableOfContents && post.tableOfContents.length > 0 && (
//               <div className="rounded-4xl border border-stone-200 bg-stone-50 p-6 mb-10 shadow-sm">
//                 <div className="flex items-center justify-between gap-4 mb-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-stone-900">
//                       Table of Contents
//                     </h3>
//                     <p className="text-sm text-stone-500 mt-1">
//                       Jump to the section you need.
//                     </p>
//                   </div>
//                   <Sparkles size={20} className="text-primary" />
//                 </div>
//                 <nav className="grid gap-3">
//                   {post.tableOfContents.map((item) => (
//                     <button
//                       key={item.id}
//                       onClick={() => scrollToSection(item.id)}
//                       className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-stone-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition"
//                     >
//                       <ChevronRight size={16} />
//                       <span className="text-sm">{item.label}</span>
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             )}

//             <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
//               <div>
//                 <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
//                   Mobile tips
//                 </p>
//                 <h3 className="text-lg font-semibold text-stone-900">
//                   Quick Sidebar
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setSidebarOpen((prev) => !prev)}
//                 className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
//               >
//                 {sidebarOpen ? "Hide tips" : "Show tips"}
//                 <ChevronRight
//                   size={16}
//                   className={
//                     sidebarOpen
//                       ? "rotate-90 transition-transform"
//                       : "transition-transform"
//                   }
//                 />
//               </button>
//             </div>

//             <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
//               <div className="space-y-10">
//                 <div
//                   className="prose prose-lg max-w-none prose-headings:text-stone-900 prose-p:text-stone-600 prose-p:mb-8 prose-h2:mt-12 prose-h2:mb-5 prose-h3:mt-8 prose-h3:mb-4 prose-ul:pl-5 prose-ul:space-y-3 prose-ol:pl-5 prose-ol:space-y-3 prose-li:mb-3 prose-a:text-primary prose-strong:text-stone-900 prose-strong:tracking-wide"
//                   dangerouslySetInnerHTML={{ __html: post.content }}
//                 />

//                 {relatedPosts.length > 0 && (
//                   <div className="mt-16 pt-12 border-t border-stone-200">
//                     <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
//                       <div>
//                         <h3 className="text-2xl font-bold text-stone-900">
//                           Related Articles
//                         </h3>
//                         <p className="text-sm text-stone-500">
//                           More stories from the same category.
//                         </p>
//                       </div>
//                       <div className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-primary text-xs font-semibold uppercase tracking-[0.24em]">
//                         Keep Reading
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
//                       {relatedPosts.map((relatedPost) => (
//                         <Link
//                           key={relatedPost.slug}
//                           href={`/blog/${relatedPost.slug}`}
//                           className="group block w-full overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                         >
//                           <div className="relative overflow-hidden aspect-16/10 transition-transform duration-300 group-hover:scale-[1.02]">
//                             <img
//                               src={relatedPost.image}
//                               alt={relatedPost.title}
//                               className="w-full h-full object-cover"
//                             />
//                             <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary shadow-sm">
//                               {relatedPost.category}
//                             </div>
//                           </div>
//                           <div className="p-5">
//                             <h4 className="font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//                               {relatedPost.title}
//                             </h4>
//                             <p className="text-stone-500 text-sm line-clamp-2">
//                               {relatedPost.excerpt}
//                             </p>
//                             <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
//                               <span>{relatedPost.readTime}</span>
//                               <span>-</span>
//                               <span>{relatedPost.date}</span>
//                             </div>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-12 rounded-4xl bg-linear-to-r from-primary to-orange-500 p-8 text-center text-white shadow-[0_20px_60px_-30px_rgba(251,146,60,0.6)]">
//                   <h3 className="text-xl font-bold mb-3">
//                     Ready to Plan Your Trip?
//                   </h3>
//                   <p className="text-sm text-white/90 mb-6">
//                     Let our AI create your perfect Morocco itinerary.
//                   </p>
//                   <Link
//                     href="/trip-generator"
//                     className="inline-flex items-center justify-center gap-3 rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold shadow-lg shadow-stone-950/20 transition hover:bg-stone-900"
//                   >
//                     Generate Your Trip
//                   </Link>
//                 </div>
//               </div>

//               <aside
//                 className={`mt-10 space-y-6 lg:mt-0 lg:sticky lg:top-28 ${sidebarOpen ? "block" : "hidden"} lg:block`}
//               >
//                 <div className="rounded-4xl border border-primary/20 bg-linear-to-br from-primary/10 via-white to-amber-50 p-6 shadow-sm">
//                   <div className="flex items-center gap-3 text-stone-700 mb-4">
//                     <Send size={20} className="text-primary" />
//                     <div>
//                       <p className="text-xs uppercase tracking-[0.24em] text-primary">
//                         Plan from this guide
//                       </p>
//                       <h4 className="font-semibold text-stone-900">
//                         Turn ideas into a trip
//                       </h4>
//                     </div>
//                   </div>
//                   <p className="text-sm text-stone-600 mb-4">
//                     Use this article as a starting point and get a custom Morocco route built around your dates.
//                   </p>
//                   <div className="grid gap-3">
//                     <Link
//                       href="/trip-generator"
//                       className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
//                     >
//                       Generate itinerary
//                     </Link>
//                     <a
//                       href={`https://wa.me/212XXXXXXXXX?text=${whatsappMessage}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-500 hover:text-white"
//                     >
//                       <MessageCircle size={16} />
//                       Ask on WhatsApp
//                     </a>
//                   </div>
//                 </div>

//                 <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-sm">
//                   <div className="flex items-center gap-3 text-stone-700 mb-4">
//                     <Sparkles size={20} className="text-primary" />
//                     <div>
//                       <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
//                         Quick Tips
//                       </p>
//                       <h4 className="font-semibold text-stone-900">
//                         Get more from this story
//                       </h4>
//                     </div>
//                   </div>
//                   <ul className="space-y-3 text-sm text-stone-600">
//                     <li className="rounded-2xl bg-stone-50 px-4 py-3">
//                       Bookmark this article to compare itineraries later.
//                     </li>
//                     <li className="rounded-2xl bg-stone-50 px-4 py-3">
//                       Save the sections you want to use in your travel plan.
//                     </li>
//                     <li className="rounded-2xl bg-stone-50 px-4 py-3">
//                       Share with your group before booking hotels.
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="rounded-4xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
//                   <div className="mb-4">
//                     <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
//                       Need inspiration?
//                     </p>
//                     <h4 className="font-semibold text-stone-900">
//                       Explore more guides
//                     </h4>
//                   </div>
//                   <p className="text-sm text-stone-600 mb-4">
//                     Discover places, food, and photo guides to build the perfect
//                     Morocco itinerary.
//                   </p>
//                   <Link
//                     href="/blog"
//                     className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/5"
//                   >
//                     Browse all blog posts
//                     <ChevronRight size={16} />
//                   </Link>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </motion.div>
//       </article>
//     </div>
//   );
// }
