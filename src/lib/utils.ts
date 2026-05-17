import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const currencies = {
  MAD: { symbol: "MAD", rate: 1, name: "Moroccan Dirham" },
  EUR: { symbol: "\u20AC", rate: 0.092, name: "Euro" },
  USD: { symbol: "$", rate: 0.1, name: "US Dollar" },
} as const

export type CurrencyCode = keyof typeof currencies

export function formatPrice(priceInMAD: number, currency: CurrencyCode = "MAD"): string {
  const { symbol, rate } = currencies[currency]
  const converted = Math.round(priceInMAD * rate)
  return `${symbol}${converted.toLocaleString()}`
}

export const translations = {
  en: {
    nav: { home: "Home", trips: "Trips & Tours", destinations: "Destinations", experiences: "Experiences", blog: "Blog", about: "About", contact: "Contact", generateTrip: "AI Trip Generator" },
    hero: { headline: "Moroccan Trips & Tours, Planned with AI", subheadline: "Explore authentic Moroccan tours, desert escapes, medina walks, and coastal adventures. Tell us your dream trip, and our AI helps shape it into a personalized Morocco itinerary.", ctaGenerate: "Create my dream trip", ctaExplore: "Explore Morocco tours", promptPlaceholder: "Tell us your dream Moroccan tour..." },
    common: { price: "Price", duration: "Duration", rating: "Rating", reviews: "Reviews", bookNow: "Book Now", learnMore: "Learn More", readMore: "Read More", viewAll: "View All", featured: "Featured", popular: "Popular", search: "Search", filter: "Filter", save: "Save", share: "Share" },
    footer: { description: "Moroccan trips and tours with smart AI planning, local expertise, and unforgettable experiences.", quickLinks: "Quick Links", support: "Support", newsletter: "Newsletter", newsletterPlaceholder: "Enter your email", subscribe: "Subscribe", rights: "All rights reserved." },
  },
  fr: {
    nav: { home: "Accueil", trips: "Voyages & Circuits", destinations: "Destinations", experiences: "Exp\u00E9riences", blog: "Blog", about: "\u00C0 propos", contact: "Contact", generateTrip: "G\u00E9n\u00E9rateur IA" },
    hero: { headline: "Planifiez votre voyage au Maroc en quelques secondes avec l'IA", subheadline: "D\u00E9couvrez des exp\u00E9riences curatoriales, des joyaux cach\u00E9s et des aventures authentiques \u00E0 travers le Maroc.", ctaGenerate: "G\u00E9n\u00E9rer votre voyage", ctaExplore: "Explorer les voyages", promptPlaceholder: "D\u00E9crivez votre voyage r\u00EAv\u00E9 au Maroc..." },
    common: { price: "Prix", duration: "Dur\u00E9e", rating: "Note", reviews: "Avis", bookNow: "R\u00E9server", learnMore: "En savoir plus", readMore: "Lire plus", viewAll: "Voir tout", featured: "En vedette", popular: "Populaire", search: "Rechercher", filter: "Filtrer", save: "Sauvegarder", share: "Partager" },
    footer: { description: "Votre plateforme de voyage marocaine aliment\u00E9e par l'IA. Exp\u00E9riences authentiques, expertise locale, souvenirs inoubliables.", quickLinks: "Liens rapides", support: "Support", newsletter: "Newsletter", newsletterPlaceholder: "Entrez votre email", subscribe: "S'abonner", rights: "Tous droits r\u00E9serv\u00E9s." },
  },
  ar: {
    nav: { home: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", trips: "\u0627\u0644\u0631\u062D\u0644\u0627\u062A", destinations: "\u0627\u0644\u0648\u062C\u0647\u0627\u062A", experiences: "\u0627\u0644\u062A\u062C\u0627\u0631\u0628", blog: "\u0627\u0644\u0645\u062F\u0648\u0646\u0629", about: "\u0645\u0646 \u0646\u062D\u0646", contact: "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627", generateTrip: "\u0645\u0648\u0644\u062F \u0627\u0644\u0631\u062D\u0644\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621" },
    hero: { headline: "\u062E\u0637\u0637 \u0644\u0631\u062D\u0644\u062A\u0643 \u0625\u0644\u0649 \u0627\u0644\u0645\u063A\u0631\u0628 \u0641\u064A \u062B\u0648\u0627\u0646\u064D \u0645\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A", subheadline: "\u0627\u0643\u062A\u0634\u0641 \u062A\u062C\u0627\u0631\u0628 \u0645\u0646\u062A\u0642\u0627\u0629 \u0648\u062C\u0648\u0627\u0647\u0631 \u0645\u062E\u0641\u064A\u0629 \u0648\u0645\u063A\u0627\u0645\u0631\u0627\u062A \u0623\u0635\u064A\u0644\u0629 \u0639\u0628\u0631 \u0627\u0644\u0645\u063A\u0631\u0628.", ctaGenerate: "\u0623\u0646\u0634\u0626 \u0631\u062D\u0644\u062A\u0643", ctaExplore: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u0631\u062D\u0644\u0627\u062A", promptPlaceholder: "\u0635\u0641 \u0631\u062D\u0644\u062A\u0643 \u0627\u0644\u0645\u063A\u0631\u0628\u064A\u0629 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629..." },
    common: { price: "\u0627\u0644\u0633\u0639\u0631", duration: "\u0627\u0644\u0645\u062F\u0629", rating: "\u0627\u0644\u062A\u0642\u064A\u064A\u0645", reviews: "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0627\u062A", bookNow: "\u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646", learnMore: "\u0627\u0639\u0631\u0641 \u0627\u0644\u0645\u0632\u064A\u062F", readMore: "\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064A\u062F", viewAll: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644", featured: "\u0645\u0645\u064A\u0632", popular: "\u0634\u0627\u0626\u0639", search: "\u0628\u062D\u062B", filter: "\u062A\u0635\u0641\u064A\u0629", save: "\u062D\u0641\u0638", share: "\u0645\u0634\u0627\u0631\u0643\u0629" },
    footer: { description: "\u0645\u0646\u0635\u062A\u0643 \u0644\u0644\u0633\u0641\u0631 \u0625\u0644\u0649 \u0627\u0644\u0645\u063A\u0631\u0628 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A. \u062A\u062C\u0627\u0631\u0628 \u0623\u0635\u064A\u0644\u0629 \u0648\u062E\u0628\u0631\u0629 \u0645\u062D\u0644\u064A\u0629 \u0648\u0630\u0643\u0631\u064A\u0627\u062A \u0644\u0627 \u062A\u064F\u0646\u0633\u0649.", quickLinks: "\u0631\u0648\u0627\u0628\u0637 \u0633\u0631\u064A\u0639\u0629", support: "\u0627\u0644\u062F\u0639\u0645", newsletter: "\u0627\u0644\u0646\u0634\u0631\u0629 \u0627\u0644\u0625\u062E\u0628\u0627\u0631\u064A\u0629", newsletterPlaceholder: "\u0623\u062F\u062E\u0644 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A", subscribe: "\u0627\u0634\u062A\u0631\u0643", rights: "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629." },
  },
}

export type LanguageCode = keyof typeof translations
