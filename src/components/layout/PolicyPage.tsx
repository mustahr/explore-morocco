import Link from "next/link"
import { CONTACT_EMAIL, contactEmailHref } from "@/lib/contact"

export function PolicyPage({ title, introduction, sections }: {
  title: string
  introduction: string
  sections: Array<{ title: string; text: string }>
}) {
  return (
    <div className="pt-20 lg:pt-24">
      <header className="bg-stone-950 px-4 py-14 text-white sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-amber-200 hover:underline">Home</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-amber-200">Dunexplore Morocco</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-5 leading-relaxed text-white/80">{introduction}</p>
          <p className="mt-4 text-sm text-white/60">Last updated: 15 October 2026</p>
        </div>
      </header>
      <article className="mx-auto max-w-3xl space-y-9 px-4 py-12 sm:px-6 lg:py-16">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-stone-900">{section.title}</h2>
            <p className="mt-3 leading-8 text-stone-600">{section.text}</p>
          </section>
        ))}
        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <h2 className="text-xl font-bold text-stone-900">Contact us</h2>
          <p className="mt-3 leading-8 text-stone-600">For questions, contact our team at <a href={contactEmailHref()} className="break-all font-semibold text-stone-900 underline underline-offset-4">{CONTACT_EMAIL}</a>.</p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold text-stone-900">
            <Link href="/contact" className="hover:underline">Contact our team</Link>
            <Link href={title === "Privacy Policy" ? "/terms" : "/privacy"} className="hover:underline">{title === "Privacy Policy" ? "Terms of Service" : "Privacy Policy"}</Link>
          </div>
        </section>
      </article>
    </div>
  )
}
