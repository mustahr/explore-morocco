"use client"

import { useTranslations } from "@/context/useTranslations"

import { BookingRequestButton } from "@/components/booking/BookingRequestButton"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, MapPin, Calendar, ArrowLeft, ArrowRight, Heart, Share2, Clock, Utensils, Navigation, Hotel, Lightbulb, MessageCircle, Mail, Send, ChevronDown } from "lucide-react"
import { type Destination, type DestinationDetails } from "@/lib/data"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

export default function DestinationDetailClient({ destination }: { destination: Destination }) {
  const { tr, language } = useTranslations()
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedExp, setExpandedExp] = useState<number | null>(null)

  const dest = { ...destination, name: language === "fr" ? destination.nameFr || tr(destination.name) : language === "ar" ? destination.nameAr || tr(destination.name) : destination.name }
  const detail: DestinationDetails = dest.details ?? {
    intro: dest.description,
    bestFor: ["Culture", "Local experiences", "Scenic stays", "Guided trips"],
    areas: dest.highlights.slice(0, 3).map((highlight) => ({
      title: highlight,
      description: tr("A signature part of {place}, best explored with time and local context.", { place: dest.name }),
    })),
    food: ["Traditional Moroccan tagine", "Mint tea", "Seasonal local specialties"],
    localTips: ["Start early for quieter streets and better light.", "Book guided activities ahead in peak season.", "Keep small cash for taxis, tips, and market stops."],
    gettingAround: tr("Use a mix of walking, taxis, and private transfers depending on where you stay in {place}.", { place: dest.name }),
    whereToStay: tr("Choose a central stay in {place} if you want easy access to restaurants, guides, and main sights.", { place: dest.name }),
  }

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "things", label: "Things to Do" },
    { key: "itineraries", label: "Itineraries" },
    { key: "experiences", label: "Experiences" },
  ]

  return (
    <div className="min-w-0 overflow-x-clip pt-20 lg:pt-24">
      <div className="relative isolate h-[50svh] min-h-[26rem] overflow-hidden bg-stone-900 sm:min-h-[30rem] lg:h-[60vh] lg:min-h-[32rem]">
        <ImageWithFallback
          src={dest.images[0] || dest.image}
          alt={dest.name}
          fill
          preload
          sizes="100vw"
          parallax
          parallaxOffset={84}
          className="object-cover"
          fallbackClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link href="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} />{tr("All Destinations")}</Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{tr(dest.name)}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <span className="flex items-center gap-1">
              <Star size={18} className="fill-accent text-accent" />
              <span className="font-semibold">{dest.rating}</span>
              <span className="text-white/60">({dest.reviews.toLocaleString()} {tr("reviews)")}</span>
            </span>
            <span className="flex min-w-0 items-start gap-2">
              <Calendar size={16} className="mt-1 shrink-0" />
              <span>{tr("Best:")} {tr(dest.bestTime)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative min-w-0 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="min-w-0 lg:col-span-2">
            <div aria-label={tr("Destination sections")} className="grid grid-cols-2 gap-1 mb-8 border-b border-stone-200 sm:flex sm:flex-wrap">
              {tabs.map((tab) => (
                <button type="button" aria-pressed={activeTab === tab.key} key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === tab.key ? "text-primary" : "text-stone-500 hover:text-stone-700"}`}>
                  {tr(tab.label)}
                  {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">{tr("Why go")}</span>
                  <h2 className="mt-3 text-3xl font-bold text-stone-900">{tr("The feel of")} {tr(dest.name)}</h2>
                  <p className="mt-5 text-stone-600 text-lg leading-relaxed">{tr(detail.intro)}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4">{tr("Best for")}</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {detail.bestFor.map((item) => (
                      <div key={item} className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm">
                        <Star size={18} className="mx-auto fill-accent text-accent" />
                        <p className="mt-2 text-sm font-semibold text-stone-700">{tr(item)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4">{tr("Highlights")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dest.highlights.map((highlight, i) => (
                      <motion.div key={highlight} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                        <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-stone-700">{tr(highlight)}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4">{tr("Key areas to know")}</h3>
                  <div className="space-y-4">
                    {detail.areas.map((area, i) => (
                      <motion.div
                        key={area.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <Navigation size={20} className="mt-1 flex-shrink-0 text-primary" />
                          <div>
                            <h4 className="font-bold text-stone-900">{tr(area.title)}</h4>
                            <p className="mt-1 text-stone-500">{tr(area.description)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-stone-50 p-5">
                    <div className="flex items-center gap-3">
                      <Utensils size={20} className="text-primary" />
                      <h3 className="text-xl font-bold text-stone-900">{tr("What to taste")}</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {detail.food.map((item) => (
                        <p key={item} className="text-stone-600">{tr(item)}</p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-5">
                    <div className="flex items-center gap-3">
                      <Lightbulb size={20} className="text-primary" />
                      <h3 className="text-xl font-bold text-stone-900">{tr("Local tips")}</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {detail.localTips.map((item) => (
                        <p key={item} className="text-stone-600">{tr(item)}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4">{tr("Gallery")}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dest.images.map((img, i) => (
                      <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                        <ImageWithFallback
                          src={img}
                          alt={`${dest.name} ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition-opacity hover:opacity-90"
                          fallbackClassName="h-full w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "things" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">{tr("Things to do")}</span>
                  <h2 className="mt-3 text-3xl font-bold text-stone-900">{tr("Build your days around the right pace")}</h2>
                  <p className="mt-4 text-stone-600 text-lg">{tr(dest.name)} {tr("offers a wealth of activities and experiences for every type of traveler.")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.highlights.map((highlight, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border border-stone-100 shadow-sm">
                      <h4 className="font-bold text-stone-900 mb-2">{tr(highlight)}</h4>
                      <p className="text-stone-500 text-sm">{tr("Experience")} {highlight.toLowerCase()} {tr("with enough context, time for photos, and practical local guidance.")}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
                    <h3 className="font-bold text-stone-900">{tr("Getting around")}</h3>
                    <p className="mt-2 text-stone-600">{tr(detail.gettingAround)}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
                    <h3 className="font-bold text-stone-900">{tr("Where to stay")}</h3>
                    <p className="mt-2 text-stone-600">{tr(detail.whereToStay)}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "itineraries" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <p className="text-stone-600 text-lg">{tr("Choose from our curated itineraries designed by local experts.")}</p>
                <div className="space-y-4">
                  {dest.itineraries.map((it, i) => (
                    <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                      <button onClick={() => setExpandedExp(expandedExp === i ? null : i)} className="w-full flex items-center justify-between p-6 text-start">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{it.days}</span>
                            <h4 className="font-bold text-stone-900">{tr(it.title)}</h4>
                          </div>
                          <p className="text-stone-400 text-sm">{it.days} {tr("days itinerary")}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-end">
                            <p className="text-xl font-bold text-primary">{it.price.toLocaleString()} MAD</p>
                            <p className="text-stone-400 text-xs">{tr("per person")}</p>
                          </div>
                          <span
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                            aria-hidden="true"
                          >
                            <ChevronDown
                              size={20}
                              className={`transition-transform duration-300 ${expandedExp === i ? "rotate-180" : ""}`}
                            />
                          </span>
                        </div>
                      </button>
                      {expandedExp === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-6 pb-6 border-t border-stone-100 pt-4">
                          <div className="space-y-3">
                            {Array.from({ length: it.days }).map((_, day) => (
                              <div key={day} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-medium flex-shrink-0">{day + 1}</span>
                                <div>
                                  <p className="font-medium text-stone-700">{tr("Day")} {day + 1}</p>
                                  <p className="text-sm text-stone-500">
                                    {day === 0
                                      ? tr("Arrive, settle in, and take a guided first look at {place}.", { place: dest.name })
                                      : day === it.days - 1
                                        ? tr("Slow morning, final viewpoints or shopping, then departure.")
                                        : tr("Combine {highlight} with local food and neighborhood time.", { highlight: tr(dest.highlights[day % dest.highlights.length]) })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <BookingRequestButton destinationSlug={dest.slug} itineraryIndex={i} title={`${dest.name} — ${it.title}`} className="mt-6 btn-primary px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2">{tr("Book This Itinerary")}<ArrowRight size={16} />
                          </BookingRequestButton>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "experiences" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <p className="text-stone-600 text-lg">{tr("Immerse yourself in authentic experiences unique to")} {tr(dest.name)}.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.experiences.map((exp, i) => (
                    <div key={i} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden card-hover">
                      <div className="p-5">
                        <h4 className="font-bold text-stone-900 mb-2">{tr(exp)}</h4>
                        <div className="flex items-center gap-4 text-sm text-stone-400 mb-3">
                          <span className="flex items-center gap-1"><Clock size={14} />{tr("2-4 hours")}</span>
                          <span className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent" />4.8+</span>
                        </div>
                        <Link href="/experiences" className="text-primary text-sm font-medium">{tr("Learn more")}</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-28">
              <h3 className="text-lg font-bold text-stone-900 mb-4">{tr("Plan Your Trip")}</h3>
              <Link href="/trip-generator" className="w-full btn-primary text-white py-4 rounded-xl font-semibold mb-4 flex items-center justify-center gap-2">{tr("Generate Itinerary")}<ArrowRight size={18} />
              </Link>
              <BookingRequestButton destinationSlug={dest.slug} title={`${dest.name} trip`} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-white px-4 py-3 font-semibold text-primary hover:bg-primary hover:text-white">
                <Send size={17} /> {tr("Book a trip to {place}", { place: dest.name })}</BookingRequestButton>
              <BookingRequestButton destinationSlug={dest.slug} title={`${dest.name} trip`} className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700">
                <MessageCircle size={17} />{tr("Request via WhatsApp")}</BookingRequestButton>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-stone-50 p-3 text-sm">
                  <Hotel size={17} className="mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-stone-800">{tr("Stay style")}</p>
                    <p className="mt-1 text-stone-500">{tr(detail.whereToStay)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{tr("Best time to visit")}</span>
                  <span className="text-stone-700 font-medium">{tr(dest.bestTime)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{tr("Starting from")}</span>
                  <span className="text-primary font-bold">{dest.itineraries[0].price.toLocaleString()} MAD</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{tr("Rating")}</span>
                  <span className="text-stone-700 font-medium flex items-center gap-1">
                    <Star size={14} className="fill-accent text-accent" />
                    {dest.rating}
                  </span>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-amber-50 p-4">
                <p className="font-bold text-amber-900">{tr("Local note")}</p>
                <p className="mt-2 text-sm text-amber-800">{tr(detail.localTips[0])}</p>
              </div>
              <div className="mt-5 rounded-2xl border border-stone-100 bg-stone-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-bold text-stone-900">{tr("Need a custom route?")}</p>
                    <p className="mt-1 text-sm text-stone-500">{tr("Tell us your dates, travel style, and group size. We’ll shape a plan around")} {tr(dest.name)}.</p>
                    <Link href="/contact" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">{tr("Contact the team")}</Link>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-primary hover:text-primary font-medium text-sm transition-colors flex items-center justify-center gap-2">
                  <Heart size={16} />{tr("Save")}</button>
                <button className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-primary hover:text-primary font-medium text-sm transition-colors flex items-center justify-center gap-2">
                  <Share2 size={16} />{tr("Share")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
