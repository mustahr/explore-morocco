import { absoluteUrl, siteName } from "@/lib/site"
import { type BlogPost, type Destination, type Experience, type Trip } from "@/lib/data"

export function cleanImageList(images: Array<string | undefined>) {
  return images.filter((image): image is string => Boolean(image?.trim()))
}

export function tripJsonLd(trip: Trip) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.description,
    image: cleanImageList([trip.seo?.image, trip.image, ...trip.images]),
    itinerary: trip.locations.map((location) => ({
      "@type": "Place",
      name: location,
    })),
    offers: {
      "@type": "Offer",
      price: trip.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/trips/${trip.id}`),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: trip.rating,
      reviewCount: trip.reviews,
    },
    provider: {
      "@type": "TravelAgency",
      name: siteName,
      url: absoluteUrl("/"),
    },
  }
}

export function destinationJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.description,
    image: cleanImageList([destination.seo?.image, destination.image, ...destination.images]),
    url: absoluteUrl(`/destinations/${destination.slug}`),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: destination.rating,
      reviewCount: destination.reviews,
    },
  }
}

export function experienceJsonLd(experience: Experience) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: experience.title,
    description: experience.description,
    image: cleanImageList([experience.seo?.image, experience.image]),
    url: absoluteUrl(`/experiences/${experience.id}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: experience.location,
      addressCountry: "MA",
    },
    offers: {
      "@type": "Offer",
      price: experience.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: experience.rating,
    },
  }
}

export function blogPostJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: cleanImageList([post.seo?.image, post.image]),
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }
}
