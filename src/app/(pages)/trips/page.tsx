"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Clock, MapPin, Heart, SlidersHorizontal, X, ArrowRight, Sparkles } from "lucide-react"
import { type Trip } from "@/lib/data"
import { useApp } from "@/context/AppContext"
import { formatPrice } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"

const categories = ["all", "favorited", "luxury", "budget", "adventure", "cultural", "romantic", "family"]

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000])
  const [showFilters, setShowFilters] = useState(false)
  const { currency, toggleWishlist, isWishlisted } = useApp()

  useEffect(() => {
    let ignore = false

    async function loadTrips() {
      try {
        const response = await fetch("/api/trips")
        const data = (await response.json()) as { trips: Trip[] }

        if (!ignore) {
          setTrips(data.trips)
        }
      } finally {
        if (!ignore) {
          setIsLoadingTrips(false)
        }
      }
    }

    loadTrips()

    return () => {
      ignore = true
    }
  }, [])

  const filteredTrips = trips.filter((trip) => {
    const categoryMatch =
      selectedCategory === "all" ||
      (selectedCategory === "favorited" ? isWishlisted(trip.id) : trip.category === selectedCategory)
    const durationMatch = !selectedDuration || trip.duration === selectedDuration
    const priceMatch = trip.price >= priceRange[0] && trip.price <= priceRange[1]
    return categoryMatch && durationMatch && priceMatch
  })

  return (
    <div>
      <section className="relative min-h-[520px] lg:min-h-[600px] overflow-hidden bg-stone-950 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=80"
            alt="Morocco desert"
            fill
            preload
            sizes="100vw"
            quality={80}
            className="object-cover"
            fallbackClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-950/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-amber-400" />
              <span className="text-sm uppercase tracking-[0.24em] text-amber-200/90">Discover Your Next Adventure</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
              Luxury Trips & Tours in Morocco
            </h1>
            <p className="text-lg text-amber-100/90 max-w-2xl leading-8">
              Handcrafted itineraries by local experts. From desert escapes to coastal retreats, each journey is designed for unforgettable experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Best Sellers', 'Small Groups', 'Premium Guides'].map((badge) => (
                <span key={badge} className="rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-72 flex-shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-white px-4 py-3 rounded-3xl border border-stone-200 mb-4 shadow-sm cursor-pointer"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              <div className={`${showFilters ? "block" : "hidden"} lg:block bg-white rounded-[2rem] p-6 border border-stone-200 shadow-lg sticky top-28`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-stone-900 text-lg">Filter</h3>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden cursor-pointer">
                    <X size={20} className="text-stone-500" />
                  </button>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wider">Category</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-center px-4 py-3 rounded-3xl text-sm font-medium transition-all cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-primary text-white shadow-md"
                          : "text-stone-700 bg-stone-100 hover:bg-stone-200"
                      }`}
                    >
                      All
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      {categories
                        .filter((cat) => cat !== "all")
                        .map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-center px-3 py-3 rounded-3xl text-sm font-medium transition-all cursor-pointer ${
                              selectedCategory === cat
                                ? "bg-primary text-white shadow-md"
                                : "text-stone-700 bg-stone-100 hover:bg-stone-200"
                            }`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wider">Duration</h4>
                  <div className="flex flex-wrap gap-2">
                    {[2, 3, 4, 5, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() => setSelectedDuration(selectedDuration === days ? null : days)}
                        className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all cursor-pointer ${
                          selectedDuration === days
                            ? "bg-primary text-white shadow-md"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wider">Max Price</h4>
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <p className="text-sm font-semibold text-stone-900 mt-3">
                    Up to {formatPrice(priceRange[1], currency)}
                  </p>
                </div>
              </div>

              {trips.filter((trip) => isWishlisted(trip.id)).length > 0 && (
                <div className="mt-6 lg:mt-0 bg-white rounded-[2rem] p-6 border border-stone-200 shadow-lg z-50">
                  <div className="flex items-center gap-2 mb-6">
                    <Heart size={20} className="text-primary fill-primary" />
                    <h3 className="font-bold text-stone-900 text-lg">Favorited Trips</h3>
                  </div>

                  {/* <div className="space-y-3">
                    {trips
                      .filter((trip) => isWishlisted(trip.id))
                      .map((trip) => (
                        <Link
                          key={trip.id}
                          href={`/trips/${trip.id}`}
                          className="group block"
                        >
                          <div className="flex gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={trip.image}
                                alt={trip.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-stone-900 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {trip.title}
                              </h4>
                              <p className="text-xs text-stone-500 mt-1">
                                {trip.duration}d • {trip.category}
                              </p>
                              <p className="text-sm font-bold text-primary mt-2">
                                {formatPrice(trip.price, currency)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleWishlist(trip.id)
                              }}
                              className="flex-shrink-0 cursor-pointer"
                            >
                              <Heart size={16} className="fill-primary text-primary" />
                            </button>
                          </div>
                        </Link>
                      ))}
                  </div> */}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500 uppercase tracking-wider">Results</p>
                  <p className="text-2xl font-bold text-stone-900">
                    {isLoadingTrips ? "Loading trips..." : `${filteredTrips.length} trips found`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTrips.map((trip, index) => {
                  const originalPrice = Math.round(trip.price * 1.15)
                  const savings = originalPrice - trip.price
                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/trips/${trip.id}`} className="group block h-full">
                        <div className="h-full bg-white rounded-[2rem] overflow-hidden shadow-md border border-stone-200 hover:shadow-2xl transition-shadow duration-300">
                          <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                            <ImageWithFallback
                              src={trip.image}
                              alt={trip.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              fallbackClassName="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

                            <div className="absolute inset-x-0 top-4 px-6 flex flex-wrap gap-2">
                              {['Best Value', `${trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}`].map((badge) => (
                                <span key={badge} className="rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs uppercase tracking-wider text-white/90 backdrop-blur-md font-semibold">
                                  {badge}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleWishlist(trip.id)
                              }}
                              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg cursor-pointer"
                            >
                              <Heart
                                size={22}
                                className={isWishlisted(trip.id) ? "fill-primary text-primary" : "text-stone-400"}
                              />
                            </button>

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <h3 className="text-2xl font-bold tracking-tight text-white leading-tight group-hover:text-amber-200 transition-colors">
                                {trip.title}
                              </h3>
                            </div>
                          </div>

                          <div className="p-6">
                            <p className="text-stone-600 text-sm mb-4 line-clamp-2">{trip.description}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {trip.locations.slice(0, 2).map((loc) => (
                                <span key={loc} className="flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full">
                                  <MapPin size={12} />
                                  {loc}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-stone-200">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">Duration</p>
                                <p className="text-lg font-bold text-stone-900 flex items-center gap-1">
                                  <Clock size={16} className="text-primary" />
                                  {trip.duration}d
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">Rating</p>
                                <p className="text-lg font-bold text-stone-900 flex items-center gap-1">
                                  <Star size={16} className="fill-accent text-accent" />
                                  {trip.rating}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">Reviews</p>
                                <p className="text-lg font-bold text-stone-900">{trip.reviews}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-stone-500 mb-1">Starting from</p>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-bold text-primary">{formatPrice(trip.price, currency)}</span>
                                  <span className="text-sm text-stone-400 line-through">{formatPrice(originalPrice, currency)}</span>
                                </div>
                                <p className="text-xs text-green-600 font-semibold mt-1">Save {formatPrice(savings, currency)}</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center gap-2 text-primary font-semibold hover:text-amber-600 transition-colors">
                                  Explore <ArrowRight size={18} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {filteredTrips.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-stone-200">
                  <p className="text-stone-500 text-lg mb-6">No trips match your filters</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedDuration(null)
                      setPriceRange([0, 15000])
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-3xl font-semibold hover:bg-amber-700 transition-colors cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
