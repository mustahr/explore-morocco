import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const currencies = {
  MAD: { symbol: "MAD", rate: 1, name: "Moroccan Dirham" },
  EUR: { symbol: "\u20AC", rate: 0.092, name: "Euro" },
  USD: { symbol: "$", rate: 0.1, name: "US Dollar" },
}

export function formatPrice(priceInMAD: number, currency: keyof typeof currencies = "MAD"): string {
  const { symbol, rate } = currencies[currency]
  const converted = Math.round(priceInMAD * rate)
  return `${symbol}${converted.toLocaleString()}`
}

export interface Destination {
  slug: string
  name: string
  nameAr?: string
  nameFr?: string
  description: string
  image: string
  images: string[]
  rating: number
  reviews: number
  bestTime: string
  highlights: string[]
  experiences: string[]
  itineraries: { days: number; title: string; price: number }[]
  details?: DestinationDetails
}

export interface DestinationDetails {
  intro: string
  bestFor: string[]
  areas: { title: string; description: string }[]
  food: string[]
  localTips: string[]
  gettingAround: string
  whereToStay: string
}

export interface Trip {
  id: string
  title: string
  description: string
  image: string
  images: string[]
  category: "luxury" | "budget" | "adventure" | "cultural" | "romantic" | "family"
  duration: number
  price: number
  rating: number
  reviews: number
  locations: string[]
  itinerary: { day: number; title: string; description: string }[]
  highlights: string[]
  includes: string[]
}

export interface Experience {
  id: string
  title: string
  description: string
  image: string
  category: string
  duration: string
  price: number
  rating: number
  location: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  readTime: string
  author: string
  authorAvatar: string
  content: string
  tableOfContents: { id: string; label: string }[]
}

export const destinations: Destination[] = [
  {
    slug: "marrakech",
    name: "Marrakech",
    nameFr: "Marrakech",
    nameAr: "\u0645\u0631\u0627\u0643\u0634",
    description: "The Red City enchants with its bustling medina, vibrant souks, and the iconic Jemaa el-Fnaa square. A sensory feast of colors, spices, and sounds.",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1569407228235-9a74cc843afa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545071677-7a1dfc4c5d26?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.8,
    reviews: 2847,
    bestTime: "March to May, September to November",
    highlights: ["Jemaa el-Fnaa Square", "Majorelle Garden", "Bahia Palace", "Koutoubia Mosque", "Souks of the Medina"],
    experiences: ["Cooking class in a traditional riad", "Hot air balloon ride at sunrise", "Hammam spa experience", "Motorcycle tour of the Atlas Mountains"],
    itineraries: [
      { days: 3, title: "Marrakech Essentials", price: 2500 },
      { days: 5, title: "Marrakech & Atlas Mountains", price: 4500 },
      { days: 7, title: "Complete Marrakech Experience", price: 7000 },
    ],
  },
  {
    slug: "chefchaouen",
    name: "Chefchaouen",
    nameFr: "Chefchaouen",
    nameAr: "\u0634\u0641\u0634\u0627\u0648\u0646",
    description: "The Blue Pearl of Morocco is a photographer's paradise with its striking blue-washed buildings nestled in the Rif Mountains.",
    image: "https://images.unsplash.com/photo-1553264941-928f4e0c9946?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553264941-928f4e0c9946?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548074180-4778572c6051?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599827519735-1c46b9bfd6a4?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.9,
    reviews: 1923,
    bestTime: "April to June, September to October",
    highlights: ["Blue Medina", "Kasbah Museum", "Spanish Mosque viewpoint", "Akchour Waterfalls", "Rif Mountains hiking"],
    experiences: ["Photography walking tour", "Traditional weaving workshop", "Hiking to Akchour Waterfalls", "Local cuisine tasting tour"],
    itineraries: [
      { days: 2, title: "Blue City Escape", price: 1500 },
      { days: 4, title: "Chefchaouen & Rif Mountains", price: 3000 },
    ],
  },
  {
    slug: "sahara-desert",
    name: "Sahara Desert",
    nameFr: "Sahara",
    nameAr: "\u0627\u0644\u0635\u062D\u0631\u0627\u0621 \u0627\u0644\u0643\u0628\u0631\u0649",
    description: "Experience the magic of the world's largest hot desert. Sleep under a canopy of stars in a luxury desert camp and ride camels across golden dunes.",
    image: "https://images.unsplash.com/photo-1509023465459-a9b73850b759?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509023465459-a9b73850b759?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.9,
    reviews: 3156,
    bestTime: "October to April",
    highlights: ["Merzouga Dunes", "Luxury Desert Camp", "Camel Trekking", "Stargazing", "Todra Gorge"],
    experiences: ["Sunrise camel trek", "Desert camping under stars", "4x4 dune bashing", "Berber music evening"],
    itineraries: [
      { days: 3, title: "Sahara Express", price: 3500 },
      { days: 4, title: "Desert & Kasbahs Trail", price: 5000 },
      { days: 7, title: "Grand Sahara Adventure", price: 9000 },
    ],
  },
  {
    slug: "fes",
    name: "Fes",
    nameFr: "F\u00E8s",
    nameAr: "\u0641\u0627\u0633",
    description: "Morocco's cultural and spiritual heart, home to the world's oldest university and the largest car-free urban area. A living museum of medieval Islamic architecture.",
    image: "https://images.unsplash.com/photo-1577147442772-4be1a2475140?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1577147442772-4be1a2475140?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553522991-71439aa5763f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548678793751-03273a13ebc6?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.7,
    reviews: 1654,
    bestTime: "March to May, September to November",
    highlights: ["Fes el-Bali Medina", "Chouara Tannery", "Al Quaraouiyine University", "Bou Inania Madrasa", "Artisan Workshops"],
    experiences: ["Traditional pottery making", "Leather tannery visit", "Food tour in the medina", "Calligraphy workshop"],
    itineraries: [
      { days: 2, title: "Fes Cultural Discovery", price: 1800 },
      { days: 4, title: "Fes & Imperial Cities", price: 4000 },
    ],
  },
  {
    slug: "essaouira",
    name: "Essaouira",
    nameFr: "Essaouira",
    nameAr: "\u0627\u0644\u0635\u0648\u064A\u0631\u0629",
    description: "A laid-back coastal town with Portuguese fortifications, artistic vibes, fresh seafood, and some of Africa's best windsurfing conditions.",
    image: "https://images.unsplash.com/photo-1518392446948-b180898fa4b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518392446948-b180898fa4b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553531580-a3919965b9ea?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.6,
    reviews: 1289,
    bestTime: "June to September",
    highlights: ["Skala de la Ville", "Fishing Port", "Windsurfing Beach", "Art Galleries", "Fresh Seafood Market"],
    experiences: ["Windsurfing lessons", "Fish market cooking class", "Horse riding on the beach", "Gnawa music festival"],
    itineraries: [
      { days: 2, title: "Coastal Escape", price: 1200 },
      { days: 4, title: "Essaouira & Surroundings", price: 2800 },
    ],
  },
]

export const trips: Trip[] = [
  {
    id: "desert-3day",
    title: "3-Day Sahara Desert Adventure",
    description: "Journey from Marrakech through the Atlas Mountains to the golden dunes of Merzouga. Sleep under the stars in a luxury desert camp.",
    image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509023465459-a9b73850b759?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=80",
    ],
    category: "adventure",
    duration: 3,
    price: 3500,
    rating: 4.9,
    reviews: 847,
    locations: ["Marrakech", "Todra Gorge", "Merzouga", "Erg Chebbi"],
    itinerary: [
      { day: 1, title: "Marrakech to Dades Valley", description: "Cross the Tizi n'Tichka pass, visit Ait Ben Haddou kasbah, overnight in Dades." },
      { day: 2, title: "Dades to Merzouga", description: "Explore Todra Gorge, arrive at Erg Chebbi dunes, camel trek to desert camp." },
      { day: 3, title: "Sunrise & Return", description: "Sunrise over the dunes, return journey through Ziz Valley to Marrakech." },
    ],
    highlights: ["Camel trekking", "Luxury desert camp", "Ait Ben Haddou", "Todra Gorge", "Stargazing"],
    includes: ["Transport", "Accommodation", "Meals", "Camel ride", "Guide"],
  },
  {
    id: "imperial-cities",
    title: "7-Day Imperial Cities Tour",
    description: "Discover Morocco's four imperial cities: Casablanca, Rabat, Fes, and Marrakech. A cultural immersion through history and architecture.",
    image: "https://plus.unsplash.com/premium_photo-1674156433236-2338418ec4d9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1577147442772-4be1a2475140?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553264941-928f4e0c9946?auto=format&fit=crop&w=800&q=80",
    ],
    category: "cultural",
    duration: 7,
    price: 8500,
    rating: 4.8,
    reviews: 523,
    locations: ["Casablanca", "Rabat", "Meknes", "Fes", "Marrakech"],
    itinerary: [
      { day: 1, title: "Arrival in Casablanca", description: "Visit Hassan II Mosque, explore the Art Deco downtown." },
      { day: 2, title: "Rabat", description: "Explore the Kasbah of the Udayas, Hassan Tower, and Royal Palace." },
      { day: 3, title: "Meknes & Volubilis", description: "Visit the imperial city of Meknes and Roman ruins of Volubilis." },
      { day: 4, title: "Fes Medina", description: "Guided tour of the world's largest car-free urban area." },
      { day: 5, title: "Fes Experiences", description: "Cooking class, tannery visit, artisan workshops." },
      { day: 6, title: "Travel to Marrakech", description: "Scenic drive through Middle Atlas, arrive in Marrakech." },
      { day: 7, title: "Marrakech", description: "Explore Jemaa el-Fnaa, souks, Majorelle Garden." },
    ],
    highlights: ["Hassan II Mosque", "Fes Medina", "Volubilis Ruins", "Marrakech Souks", "Riad Stays"],
    includes: ["Transport", "Riad accommodation", "Breakfast", "Guided tours", "Entrance fees"],
  },
  {
    id: "chefchaouen-blue",
    title: "2-Day Chefchaouen Blue City Escape",
    description: "Get lost in the mesmerizing blue streets of Chefchaouen. Perfect for photography lovers and those seeking tranquility.",
    image: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1553264941-928f4e0c9946?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548074180-4778572c6051?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599827519735-1c46b9bfd6a4?auto=format&fit=crop&w=800&q=80",
    ],
    category: "romantic",
    duration: 2,
    price: 1500,
    rating: 4.9,
    reviews: 612,
    locations: ["Chefchaouen", "Rif Mountains"],
    itinerary: [
      { day: 1, title: "Explore the Blue Medina", description: "Wander through the blue-washed streets, visit the Kasbah, enjoy local cuisine." },
      { day: 2, title: "Spanish Mosque & Waterfalls", description: "Sunrise at Spanish Mosque viewpoint, optional hike to Akchour Waterfalls." },
    ],
    highlights: ["Blue Medina", "Kasbah Museum", "Spanish Mosque", "Local cuisine", "Mountain views"],
    includes: ["Transport from Fes", "Riad accommodation", "Breakfast", "Local guide"],
  },
  {
    id: "marrakech-luxury",
    title: "5-Day Luxury Marrakech Retreat",
    description: "Indulge in the finest riads, private cooking classes, spa treatments, and exclusive experiences in the Red City.",
    image: "https://plus.unsplash.com/premium_photo-1697730075333-822144628df6?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1569407228235-9a74cc843afa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545071677-7a1dfc4c5d26?auto=format&fit=crop&w=800&q=80",
    ],
    category: "luxury",
    duration: 5,
    price: 12000,
    rating: 4.9,
    reviews: 234,
    locations: ["Marrakech", "Atlas Mountains", "Ourika Valley"],
    itinerary: [
      { day: 1, title: "Arrival & Riad Welcome", description: "Private airport transfer, luxury riad check-in, evening welcome dinner." },
      { day: 2, title: "Medina & Souks", description: "Private guide through the medina, exclusive souk shopping experience." },
      { day: 3, title: "Spa & Cooking", description: "Traditional hammam spa, private cooking class with a local chef." },
      { day: 4, title: "Atlas Mountains Day Trip", description: "Helicopter tour over the Atlas, lunch at a mountain lodge." },
      { day: 5, title: "Majorelle & Departure", description: "Private visit to Majorelle Garden, farewell brunch." },
    ],
    highlights: ["Luxury Riad Stay", "Private Hammam", "Helicopter Tour", "Cooking Class", "Exclusive Souk Access"],
    includes: ["Luxury riad", "All meals", "Private transfers", "Spa treatments", "Personal guide"],
  },
  {
    id: "essaouira-coastal",
    title: "3-Day Essaouira Coastal Adventure",
    description: "Windsurf, explore the historic medina, enjoy fresh seafood, and experience the bohemian vibe of Morocco's wind city.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518392446948-b180898fa4b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553531580-a3919965b9ea?auto=format&fit=crop&w=800&q=80",
    ],
    category: "adventure",
    duration: 3,
    price: 2200,
    rating: 4.7,
    reviews: 389,
    locations: ["Essaouira", "Diabat", "Sidi Kaouki"],
    itinerary: [
      { day: 1, title: "Arrival & Medina", description: "Explore the UNESCO-listed medina, visit the Skala fortress, sunset at the port." },
      { day: 2, title: "Windsurfing & Beach", description: "Morning windsurfing lesson, afternoon horse riding on the beach." },
      { day: 3, title: "Sidi Kaouki & Departure", description: "Day trip to Sidi Kaouki beach, fresh seafood lunch, return to Marrakech." },
    ],
    highlights: ["Windsurfing", "Horse Riding", "Fresh Seafood", "UNESCO Medina", "Gnawa Music"],
    includes: ["Transport", "Boutique hotel", "Windsurfing lesson", "Horse riding", "Breakfast"],
  },
  {
    id: "budget-backpacker",
    title: "5-Day Budget Morocco Explorer",
    description: "See the best of Morocco without breaking the bank. Hostels, local transport, and authentic experiences.",
    image: "https://images.unsplash.com/photo-1624805098931-098c0d918b34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1545071677-7a1dfc4c5d26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553522991-71439aa5763f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518392446948-b180898fa4b2?auto=format&fit=crop&w=800&q=80",
    ],
    category: "budget",
    duration: 5,
    price: 1800,
    rating: 4.5,
    reviews: 756,
    locations: ["Marrakech", "Essaouira", "Agafay Desert"],
    itinerary: [
      { day: 1, title: "Marrakech Arrival", description: "Check into hostel, explore Jemaa el-Fnaa, street food dinner." },
      { day: 2, title: "Marrakech Exploration", description: "Free walking tour, Bahia Palace, Koutoubia, souk browsing." },
      { day: 3, title: "Essaouira Day Trip", description: "Local bus to Essaouira, explore the medina and port." },
      { day: 4, title: "Agafay Desert", description: "Budget-friendly quad biking in Agafay, Berber dinner." },
      { day: 5, title: "Markets & Departure", description: "Morning market visit, last-minute shopping, departure." },
    ],
    highlights: ["Street Food", "Free Walking Tour", "Agafay Quad", "Hostel Life", "Local Transport"],
    includes: ["Hostel accommodation", "Some meals", "Group activities", "Guide"],
  },
]

export const experiences: Experience[] = [
  { id: "camel-ride", title: "Camel Trekking in the Sahara", description: "Ride through golden dunes at sunset and spend the night in a desert camp", image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=80", category: "Adventure", duration: "3 hours", price: 350, rating: 4.9, location: "Merzouga" },
  { id: "hammam", title: "Traditional Hammam Experience", description: "Authentic Moroccan steam bath and black soap scrub in a historic hammam", image: "https://images.unsplash.com/photo-1545071677-7a1dfc4c5d26?auto=format&fit=crop&w=800&q=80", category: "Wellness", duration: "2 hours", price: 200, rating: 4.8, location: "Marrakech" },
  { id: "cooking-class", title: "Moroccan Cooking Class", description: "Learn to make tagine, couscous, and pastilla with a local family", image: "https://images.unsplash.com/photo-1569407228235-9a74cc843afa?auto=format&fit=crop&w=800&q=80", category: "Food & Drink", duration: "4 hours", price: 400, rating: 4.9, location: "Marrakech" },
  { id: "quad-biking", title: "Quad Biking Adventure", description: "Race through palm groves, Berber villages, and desert landscapes", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80", category: "Adventure", duration: "2 hours", price: 500, rating: 4.7, location: "Agafay Desert" },
  { id: "surfing", title: "Surfing Lessons", description: "Catch waves on Morocco's Atlantic coast with expert instructors", image: "https://images.unsplash.com/photo-1518392446948-b180898fa4b2?auto=format&fit=crop&w=800&q=80", category: "Adventure", duration: "3 hours", price: 300, rating: 4.6, location: "Essaouira" },
  { id: "hot-air-balloon", title: "Hot Air Balloon Ride", description: "Float over the Atlas Mountains and Marrakech countryside at sunrise", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80", category: "Adventure", duration: "1.5 hours", price: 1500, rating: 4.9, location: "Marrakech" },
  { id: "pottery", title: "Pottery Making Workshop", description: "Create your own Moroccan ceramic masterpiece with master artisans", image: "https://images.unsplash.com/photo-1553522991-71439aa5763f?auto=format&fit=crop&w=800&q=80", category: "Culture", duration: "3 hours", price: 250, rating: 4.7, location: "Fes" },
  { id: "spa-riad", title: "Luxury Riad Spa Day", description: "Full day of argan oil massage, facial, and relaxation in a premium riad", image: "https://images.unsplash.com/photo-1599827519735-1c46b9bfd6a4?auto=format&fit=crop&w=800&q=80", category: "Wellness", duration: "Full day", price: 800, rating: 4.8, location: "Marrakech" },
  { id: "food-tour", title: "Street Food Tour", description: "Taste your way through the medina's best hidden food stalls", image: "https://images.unsplash.com/photo-1577147442772-4be1a2475140?auto=format&fit=crop&w=800&q=80", category: "Food & Drink", duration: "3 hours", price: 200, rating: 4.8, location: "Fes" },
  { id: "horse-riding", title: "Beach Horse Riding", description: "Gallop along the Atlantic coastline at sunset", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80", category: "Adventure", duration: "2 hours", price: 400, rating: 4.7, location: "Essaouira" },
  { id: "photography", title: "Photography Walking Tour", description: "Capture the perfect shots of blue streets and hidden corners", image: "https://images.unsplash.com/photo-1548074180-4778572c6051?auto=format&fit=crop&w=800&q=80", category: "Culture", duration: "4 hours", price: 350, rating: 4.9, location: "Chefchaouen" },
  { id: "spice-market", title: "Spice Market Tour", description: "Discover Morocco's aromatic spices and learn their uses", image: "https://images.unsplash.com/photo-1548678793751-03273a13ebc6?auto=format&fit=crop&w=800&q=80", category: "Food & Drink", duration: "2 hours", price: 150, rating: 4.6, location: "Marrakech" },
]

export const blogPosts: BlogPost[] = [
  {
    slug: "ultimate-morocco-itinerary",
    title: "The Ultimate 10-Day Morocco Itinerary",
    excerpt: "From the Sahara to the Atlantic, this complete itinerary covers everything you need to see in Morocco.",
    image: "https://images.unsplash.com/photo-1509023465459-a9b73850b759?auto=format&fit=crop&w=800&q=80",
    category: "Itineraries",
    date: "2025-03-15",
    readTime: "12 min",
    author: "Amina El Fassi",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2 id="why-this-itinerary">Why This 10-Day Itinerary Works</h2>
      <p>Morocco is a country of incredible diversity, from the snow-capped Atlas Mountains to the golden sands of the Sahara Desert. This carefully crafted 10-day itinerary balances cultural immersion, adventure, and relaxation while covering Morocco's most iconic destinations.</p>

      <h2 id="marrakech">Days 1-2: Marrakech - The Red City</h2>
      <p>Begin your Moroccan adventure in Marrakech, the vibrant heart of the country. Spend your first day exploring the Jemaa el-Fnaa square, watching street performers and sampling local street food. Visit the Bahia Palace and the Saadian Tombs to witness Morocco's rich architectural heritage.</p>

      <h2 id="atlas-mountains">Days 3-4: Atlas Mountains - Berber Villages</h2>
      <p>Travel to the Atlas Mountains for a cultural immersion experience. Stay in a traditional Berber village, hike through terraced fields, and learn about local customs. Visit the UNESCO-listed Ksar of Ait-Ben-Haddou, a stunning example of earthen clay architecture.</p>

      <h2 id="sahara-desert">Days 5-6: Sahara Desert - Desert Adventure</h2>
      <p>Embark on a desert adventure to the Erg Chebbi dunes. Ride camels at sunset, spend the night in a luxury desert camp under the stars, and experience the silence and beauty of the Sahara. This is truly a once-in-a-lifetime experience.</p>

      <h2 id="fes">Days 7-8: Fes - The Imperial City</h2>
      <p>Head north to Fes, Morocco's oldest imperial city and a UNESCO World Heritage site. Explore the labyrinthine medina, visit the world's oldest university, and experience traditional Moroccan crafts. Don't miss the tanneries and the Royal Palace.</p>

      <h2 id="chefchaouen-return">Days 9-10: Chefchaouen & Return to Marrakech</h2>
      <p>Visit the Blue City of Chefchaouen, nestled in the Rif Mountains. Wander through the blue-washed streets, hike to nearby waterfalls, and enjoy the cooler mountain air. Return to Marrakech for last-minute shopping and relaxation before your departure.</p>

      <h2 id="essential-tips">Essential Tips for Your Trip</h2>
      <ul>
        <li>Book desert camps and mountain accommodations in advance</li>
        <li>Carry cash for rural areas where cards aren't accepted</li>
        <li>Respect local customs and dress modestly</li>
        <li>Stay hydrated and use sunscreen in desert areas</li>
        <li>Learn basic Arabic phrases for better interactions</li>
      </ul>
    `,
    tableOfContents: [
      { id: "why-this-itinerary", label: "Why This 10-Day Itinerary Works" },
      { id: "marrakech", label: "Days 1-2: Marrakech" },
      { id: "atlas-mountains", label: "Days 3-4: Atlas Mountains" },
      { id: "sahara-desert", label: "Days 5-6: Sahara Desert" },
      { id: "fes", label: "Days 7-8: Fes" },
      { id: "chefchaouen-return", label: "Days 9-10: Chefchaouen & Return" },
      { id: "essential-tips", label: "Essential Tips" }
    ]
  },
  {
    slug: "best-riads-marrakech",
    title: "10 Best Riads to Stay in Marrakech",
    excerpt: "Our curated list of the most beautiful and authentic riads in the Red City for every budget.",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
    category: "Destinations",
    date: "2025-03-10",
    readTime: "8 min",
    author: "Youssef Benali",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2 id="what-makes-great-riad">What Makes a Great Riad?</h2>
      <p>Riads are traditional Moroccan homes built around a central courtyard, offering privacy, tranquility, and authentic local architecture. The best riads combine traditional design with modern amenities, creating unforgettable stays in the heart of Marrakech's medina.</p>

      <h2 id="luxury-riads">Luxury Riads ($$$$)</h2>
      <h3>Riad Kniza</h3>
      <p>This award-winning riad features stunning architecture with intricate zellij tilework and a beautiful courtyard pool. The rooftop terrace offers panoramic views of the medina.</p>

      <h3>Dar Moha</h3>
      <p>A masterpiece of Moroccan architecture with hand-carved cedar wood, marble fountains, and lush gardens. Each room is uniquely decorated with antique furnishings.</p>

      <h2 id="mid-range-riads">Mid-Range Riads ($$$)</h2>
      <h3>Riad El Fenn</h3>
      <p>Located in a historic palace, this riad offers spacious rooms, a large pool, and a spa. The contemporary design respects traditional Moroccan aesthetics.</p>

      <h3>Nomad</h3>
      <p>A boutique riad with minimalist design, featuring local artisanal pieces and a stunning central courtyard. Perfect for design-conscious travelers.</p>

      <h2 id="budget-riads">Budget-Friendly Riads ($$)</h2>
      <h3>Riad Zolah</h3>
      <p>An authentic budget riad with clean, comfortable rooms and a friendly family atmosphere. The rooftop terrace is perfect for sunset views.</p>

      <h3>Cafe Clock Riad</h3>
      <p>Offers great value with traditional Moroccan decor, a small pool, and a convenient location near Jemaa el-Fnaa.</p>

      <h2 id="what-to-look-for">What to Look For</h2>
      <ul>
        <li>Location within the medina for authentic atmosphere</li>
        <li>Rooftop terrace for views and breakfast</li>
        <li>Traditional Moroccan design elements</li>
        <li>English-speaking staff for local insights</li>
        <li>Good reviews for cleanliness and service</li>
      </ul>
    `,
    tableOfContents: [
      { id: "what-makes-great-riad", label: "What Makes a Great Riad?" },
      { id: "luxury-riads", label: "Luxury Riads ($$$$)" },
      { id: "mid-range-riads", label: "Mid-Range Riads ($$$)" },
      { id: "budget-riads", label: "Budget-Friendly Riads ($$)" },
      { id: "what-to-look-for", label: "What to Look For" }
    ]
  },
  {
    slug: "morocco-travel-tips",
    title: "Essential Morocco Travel Tips for First-Timers",
    excerpt: "Everything you need to know before visiting Morocco: culture, safety, transport, and more.",
    image: "https://images.unsplash.com/photo-1545071677-7a1dfc4c5d26?auto=format&fit=crop&w=800&q=80",
    category: "Tips",
    date: "2025-03-05",
    readTime: "10 min",
    author: "Amina El Fassi",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>Understanding Moroccan Culture</h2>
      <p>Morocco is a predominantly Muslim country with a rich cultural heritage. Understanding local customs will enhance your travel experience and show respect for your hosts.</p>

      <h2>Best Time to Visit</h2>
      <p>The shoulder seasons (March-May and September-November) offer pleasant weather and fewer crowds. Summer can be extremely hot, while winter brings rain to northern areas.</p>

      <h2>Money & Currency</h2>
      <p>The Moroccan Dirham (MAD) is the local currency. ATMs are widely available in cities, but carry cash for rural areas. Credit cards are accepted in most hotels and restaurants, but smaller establishments prefer cash.</p>

      <h2>Safety & Health</h2>
      <p>Morocco is generally safe for tourists, but take standard precautions. Stay aware in crowded areas, use registered taxis, and keep valuables secure. Medical facilities are good in major cities.</p>

      <h2>Transportation</h2>
      <p>Fly into Marrakech or Casablanca. Domestic flights connect major cities. Trains are reliable between major destinations. Buses are cheap but can be crowded. Renting a car gives flexibility but requires careful driving.</p>

      <h2>Food & Dining</h2>
      <p>Moroccan cuisine is diverse and delicious. Try tagine, couscous, and pastilla. Street food is generally safe but start with cooked foods. Always wash fruits and vegetables.</p>

      <h2>Communication</h2>
      <p>Arabic and French are official languages, but English is spoken in tourist areas. Learning basic Arabic phrases shows respect and can enhance your experience.</p>
    `,
    tableOfContents: [
      { id: "moroccan-culture", label: "Understanding Moroccan Culture" },
      { id: "best-time-visit", label: "Best Time to Visit" },
      { id: "money-currency", label: "Money & Currency" },
      { id: "safety-health", label: "Safety & Health" },
      { id: "transportation", label: "Transportation" },
      { id: "food-dining", label: "Food & Dining" },
      { id: "communication", label: "Communication" }
    ]
  },
  {
    slug: "chefchaouen-photo-guide",
    title: "Chefchaouen: The Complete Photography Guide",
    excerpt: "Best spots, times, and techniques for capturing the Blue City's magic.",
    image: "https://images.unsplash.com/photo-1553264941-928f4e0c9946?auto=format&fit=crop&w=800&q=80",
    category: "Destinations",
    date: "2025-02-28",
    readTime: "7 min",
    author: "Karim Tazi",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>The Blue City Phenomenon</h2>
      <p>Chefchaouen, known as the Blue City, is a photographer's paradise. The blue-washed buildings create a surreal, dreamlike atmosphere that's perfect for capturing stunning images.</p>

      <h2>Best Times to Photograph</h2>
      <p>Early morning (sunrise) and late afternoon (golden hour) offer the best light. The blue buildings are most vibrant when the sun is low, creating long shadows and rich colors.</p>

      <h2>Iconic Photo Spots</h2>
      <h3>Plaza Uta el-Hammam</h3>
      <p>The main square is perfect for wide-angle shots of the blue buildings and local life.</p>

      <h3>Blue Walls & Doors</h3>
      <p>Look for contrasting doors and windows against the blue walls for striking compositions.</p>

      <h3>Rooftop Views</h3>
      <p>Many riads offer rooftop access for aerial views of the blue cityscape.</p>

      <h2>Photography Tips</h2>
      <ul>
        <li>Use a polarizing filter to enhance the blue tones</li>
        <li>Include people in your shots for scale and interest</li>
        <li>Experiment with different perspectives</li>
        <li>Visit during off-peak hours for fewer tourists</li>
        <li>Respect local privacy when photographing people</li>
      </ul>
    `,
    tableOfContents: [
      { id: "blue-city-phenomenon", label: "The Blue City Phenomenon" },
      { id: "best-times-photograph", label: "Best Times to Photograph" },
      { id: "iconic-photo-spots", label: "Iconic Photo Spots" },
      { id: "photography-tips", label: "Photography Tips" }
    ]
  },
  {
    slug: "moroccan-food-guide",
    title: "A Foodie's Guide to Moroccan Cuisine",
    excerpt: "From tagine to msemen, discover the flavors that make Moroccan food world-famous.",
    image: "https://images.unsplash.com/photo-1569407228235-9a74cc843afa?auto=format&fit=crop&w=800&q=80",
    category: "Culture",
    date: "2025-02-20",
    readTime: "9 min",
    author: "Fatima Zahra",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>The Essence of Moroccan Cuisine</h2>
      <p>Moroccan food is a celebration of flavors, combining Arab, Berber, and Mediterranean influences. Spices like cumin, coriander, and cinnamon create complex, aromatic dishes.</p>

      <h2>Signature Dishes</h2>
      <h3>Tagine</h3>
      <p>Slow-cooked stews named after the earthenware pot they're cooked in. Chicken, lamb, or vegetable tagines are flavored with spices and served with couscous.</p>

      <h3>Couscous</h3>
      <p>Morocco's national dish, made from steamed semolina grains. Served with vegetables, meat, and a flavorful broth.</p>

      <h3>Pastilla</h3>
      <p>A savory pie filled with spiced meat (usually pigeon or chicken), almonds, and onions, topped with cinnamon and powdered sugar.</p>

      <h2>Street Food Favorites</h2>
      <h3>Msemen</h3>
      <p>Flaky, layered flatbread, perfect for scooping up tagine or dipping in honey.</p>

      <h3>Harira</h3>
      <p>A hearty soup made with tomatoes, lentils, chickpeas, and spices. Traditionally eaten during Ramadan.</p>

      <h2>Sweet Delights</h2>
      <h3>Chelou</h3>
      <p>Almond pastries soaked in honey syrup, dusted with cinnamon.</p>

      <h3>Makroud</h3>
      <p>Semolina cookies filled with dates and shaped like diamonds.</p>

      <h2>Dining Etiquette</h2>
      <ul>
        <li>Eat with your right hand or use bread as utensils</li>
        <li>Accept food and drink offerings as a sign of hospitality</li>
        <li>Try everything - it's considered polite</li>
        <li>Meals are social events, so take your time</li>
      </ul>
    `,
    tableOfContents: [
      { id: "essence-moroccan-cuisine", label: "The Essence of Moroccan Cuisine" },
      { id: "signature-dishes", label: "Signature Dishes" },
      { id: "street-food-favorites", label: "Street Food Favorites" },
      { id: "sweet-delights", label: "Sweet Delights" },
      { id: "dining-etiquette", label: "Dining Etiquette" }
    ]
  },
  {
    slug: "sahara-packing-guide",
    title: "What to Pack for the Sahara Desert",
    excerpt: "Essential items and tips for a comfortable desert experience in any season.",
    image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
    category: "Tips",
    date: "2025-02-15",
    readTime: "6 min",
    author: "Youssef Benali",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>Desert Climate Considerations</h2>
      <p>The Sahara can be extremely hot during the day and surprisingly cold at night. Temperature swings of 30°C (54°F) are common, so layer appropriately.</p>

      <h2>Essential Clothing</h2>
      <ul>
        <li>Light, breathable layers for daytime</li>
        <li>Warm jacket or fleece for evenings</li>
        <li>Long pants and long-sleeved shirts for sun protection</li>
        <li>Comfortable walking shoes or sandals</li>
        <li>Scarf or turban for sun protection and sand</li>
        <li>Sleeping clothes for cool desert nights</li>
      </ul>

      <h2>Personal Care Items</h2>
      <ul>
        <li>High SPF sunscreen (SPF 50+)</li>
        <li>Sunglasses with UV protection</li>
        <li>Lip balm with SPF</li>
        <li>Moisturizing lotion</li>
        <li>Biodegradable toiletries</li>
        <li>Hand sanitizer and wet wipes</li>
      </ul>

      <h2>Health & Safety</h2>
      <ul>
        <li>Reusable water bottle</li>
        <li>Basic first-aid kit</li>
        <li>Any prescription medications</li>
        <li>Mosquito repellent (for oases)</li>
        <li>Headlamp or flashlight</li>
      </ul>

      <h2>Practical Items</h2>
      <ul>
        <li>Daypack for excursions</li>
        <li>Plastic bags for wet items</li>
        <li>Travel pillow for long journeys</li>
        <li>Power bank for devices</li>
        <li>Ziplock bags for valuables</li>
      </ul>
    `,
    tableOfContents: [
      { id: "desert-climate", label: "Desert Climate Considerations" },
      { id: "essential-clothing", label: "Essential Clothing" },
      { id: "personal-care", label: "Personal Care Items" },
      { id: "health-safety", label: "Health & Safety" },
      { id: "practical-items", label: "Practical Items" }
    ]
  },
  {
    slug: "sahara-desert-guide",
    title: "The Complete Sahara Desert Travel Guide",
    excerpt: "Everything you need to know for an unforgettable desert adventure in Morocco's golden sands.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    category: "Destinations",
    date: "2025-02-10",
    readTime: "11 min",
    author: "Amina El Fassi",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2 id="why-visit-sahara">Why Visit the Sahara?</h2>
      <p>The Sahara Desert offers an otherworldly experience of vast sand dunes, star-filled skies, and traditional nomadic culture. It's a place that changes you forever.</p>

      <h2 id="best-time-visit">Best Time to Visit</h2>
      <p>October to April offers comfortable temperatures. Summer months (June-August) can reach 50°C (122°F) during the day, making travel challenging.</p>

      <h2 id="how-to-get-there">How to Get There</h2>
      <p>Most visitors fly into Marrakech or Fes, then take a 4WD vehicle or bus to Merzouga (8-10 hours). Domestic flights to Errachidia shorten the journey.</p>

      <h2 id="accommodation-options">Accommodation Options</h2>
      <h3>Luxury Desert Camps</h3>
      <p>Glamping tents with private bathrooms, beds, and gourmet meals. Some include pools and spa services.</p>

      <h3>Traditional Berber Camps</h3>
      <p>Authentic nomad tents with shared facilities. Experience traditional Berber hospitality and cuisine.</p>

      <h3>Budget Options</h3>
      <p>Basic guesthouses in Merzouga for those on a tight budget.</p>

      <h2 id="essential-activities">Essential Activities</h2>
      <h3>Camel Trekking</h3>
      <p>Ride camels across the dunes at sunset or sunrise. A quintessential desert experience.</p>

      <h3>Sandboarding</h3>
      <p>Slide down the massive Erg Chebbi dunes on a snowboard. Adrenaline rush guaranteed!</p>

      <h3>Stargazing</h3>
      <p>The clear desert skies offer incredible views of the Milky Way and shooting stars.</p>

      <h2 id="cultural-experiences">Cultural Experiences</h2>
      <ul>
        <li>Visit Berber villages and learn about nomadic life</li>
        <li>Experience traditional music and dance around campfires</li>
        <li>Learn about desert survival techniques</li>
        <li>Try authentic Berber cuisine</li>
      </ul>

      <h2 id="environmental-responsibility">Environmental Responsibility</h2>
      <p>The desert ecosystem is fragile. Choose eco-friendly operators, minimize waste, and respect local customs.</p>
    `,
    tableOfContents: [
      { id: "why-visit-sahara", label: "Why Visit the Sahara?" },
      { id: "best-time-visit", label: "Best Time to Visit" },
      { id: "how-to-get-there", label: "How to Get There" },
      { id: "accommodation-options", label: "Accommodation Options" },
      { id: "essential-activities", label: "Essential Activities" },
      { id: "cultural-experiences", label: "Cultural Experiences" },
      { id: "environmental-responsibility", label: "Environmental Responsibility" }
    ]
  },
  {
    slug: "7-days-morocco",
    title: "7 Days in Morocco: The Perfect Itinerary",
    excerpt: "Make the most of your week in Morocco with this optimized itinerary covering the country's highlights.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?auto=format&fit=crop&w=800&q=80",
    category: "Itineraries",
    date: "2025-02-05",
    readTime: "10 min",
    author: "Karim Tazi",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2 id="why-7-days-works">Why 7 Days Works Perfectly</h2>
      <p>Seven days gives you enough time to experience Morocco's diversity without feeling rushed. This itinerary focuses on the most iconic destinations while allowing time for cultural immersion.</p>

      <h2 id="day-1-marrakech">Day 1: Arrival in Marrakech</h2>
      <p>Fly into Marrakech and settle into your riad. Spend the afternoon exploring Jemaa el-Fnaa square and the Bahia Palace. Enjoy a traditional Moroccan dinner.</p>

      <h2 id="day-2-marrakech-deep">Day 2: Marrakech Deep Dive</h2>
      <p>Visit the Saadian Tombs, El Badi Palace, and the Majorelle Garden. Take a cooking class or hammam experience. Shop in the souks in the evening.</p>

      <h2 id="day-3-atlas">Day 3: Atlas Mountains</h2>
      <p>Take a day trip to Ourika Valley or Imlil. Hike through Berber villages, visit waterfalls, and experience mountain culture. Return to Marrakech for the night.</p>

      <h2 id="day-4-fes">Day 4: Travel to Fes</h2>
      <p>Take a morning train or flight to Fes (2.5 hours). Explore the medina and visit the tanneries. Stay overnight in a traditional riad.</p>

      <h2 id="day-5-fes-exploration">Day 5: Fes Exploration</h2>
      <p>Dedicate the day to Fes's medina. Visit the University of Al Quaraouiyine, the oldest continuously operating university in the world. Experience traditional crafts.</p>

      <h2 id="day-6-sahara">Day 6: Sahara Desert</h2>
      <p>Fly to Errachidia or take a bus to Merzouga. Experience a desert camp, camel trek, and stargazing. This condensed desert experience fits perfectly into a week.</p>

      <h2 id="day-7-return">Day 7: Return & Departure</h2>
      <p>Morning desert activities, then return to Marrakech or your departure city. Pick up souvenirs and prepare for your flight home.</p>

      <h2 id="transportation-tips">Transportation Tips</h2>
      <ul>
        <li>Use domestic flights between major cities to save time</li>
        <li>Book train tickets in advance for the Marrakech-Fes route</li>
        <li>Arrange desert transfers through your accommodation</li>
        <li>Consider private drivers for flexibility</li>
      </ul>

      <h2 id="budget-considerations">Budget Considerations</h2>
      <p>This itinerary can be done on a moderate budget by choosing mid-range accommodations and using public transport. Luxury options are available for those seeking more comfort.</p>
    `,
    tableOfContents: [
      { id: "why-7-days-works", label: "Why 7 Days Works Perfectly" },
      { id: "day-1-marrakech", label: "Day 1: Arrival in Marrakech" },
      { id: "day-2-marrakech-deep", label: "Day 2: Marrakech Deep Dive" },
      { id: "day-3-atlas", label: "Day 3: Atlas Mountains" },
      { id: "day-4-fes", label: "Day 4: Travel to Fes" },
      { id: "day-5-fes-exploration", label: "Day 5: Fes Exploration" },
      { id: "day-6-sahara", label: "Day 6: Sahara Desert" },
      { id: "day-7-return", label: "Day 7: Return & Departure" },
      { id: "transportation-tips", label: "Transportation Tips" },
      { id: "budget-considerations", label: "Budget Considerations" }
    ]
  },
  {
    slug: "atlas-mountains-hiking",
    title: "Hiking the Atlas Mountains: Trails & Tips",
    excerpt: "Discover Morocco's stunning mountain landscapes with our comprehensive hiking guide.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    category: "Adventure",
    date: "2025-01-30",
    readTime: "9 min",
    author: "Youssef Benali",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>The Atlas Mountain Range</h2>
      <p>The Atlas Mountains stretch across Morocco, offering diverse hiking opportunities from gentle valley walks to challenging high-altitude treks. The scenery is breathtaking, with Berber villages, waterfalls, and panoramic views.</p>

      <h2>Popular Hiking Regions</h2>
      <h3>Ourika Valley</h3>
      <p>Easy to access from Marrakech, offering waterfalls, Berber villages, and mule rides. Perfect for day hikes.</p>

      <h3>Imlil & Toubkal</h3>
      <p>Home to North Africa's highest peak (4,167m). Offers everything from day hikes to multi-day treks.</p>

      <h3>M'Goun Massif</h3>
      <p>Less touristy region with stunning landscapes and authentic Berber culture.</p>

      <h2>Best Hikes by Difficulty</h2>
      <h3>Beginner: Ourika Waterfalls</h3>
      <p>2-3 hour hike through terraced fields to cascading waterfalls. Combine with a traditional Berber lunch.</p>

      <h3>Intermediate: Toubkal Base Camp</h3>
      <p>2-day trek to the base of Mount Toubkal. Stay in mountain refuges and experience Berber hospitality.</p>

      <h3>Advanced: Toubkal Summit</h3>
      <p>2-3 day trek to the summit. Requires good fitness and acclimatization. Hire a local guide mandatory.</p>

      <h2>When to Hike</h2>
      <p>Spring (March-May) and fall (September-November) offer perfect weather. Summer is hot but clear, winter brings snow to higher elevations.</p>

      <h2>Essential Gear</h2>
      <ul>
        <li>Sturdy hiking boots with good ankle support</li>
        <li>Weather-appropriate clothing (layers)</li>
        <li>Daypack with water and snacks</li>
        <li>Sun protection (hat, sunscreen, sunglasses)</li>
        <li>Trekking poles for stability</li>
        <li>First-aid kit and emergency supplies</li>
      </ul>

      <h2>Safety & Etiquette</h2>
      <ul>
        <li>Always hike with a local guide</li>
        <li>Respect Berber village privacy</li>
        <li>Pack out all trash</li>
        <li>Stay on marked trails</li>
        <li>Check weather conditions</li>
        <li>Inform someone of your plans</li>
      </ul>
    `,
    tableOfContents: [
      { id: "atlas-mountain-range", label: "The Atlas Mountain Range" },
      { id: "popular-hiking-regions", label: "Popular Hiking Regions" },
      { id: "best-hikes-difficulty", label: "Best Hikes by Difficulty" },
      { id: "when-to-hike", label: "When to Hike" },
      { id: "essential-gear", label: "Essential Gear" },
      { id: "safety-etiquette", label: "Safety & Etiquette" }
    ]
  },
  {
    slug: "morocco-safety-guide",
    title: "Is Morocco Safe? A Complete Safety Guide",
    excerpt: "Addressing common concerns and providing practical safety tips for travelers to Morocco.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    category: "Tips",
    date: "2025-01-25",
    readTime: "8 min",
    author: "Fatima Zahra",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>Morocco's Safety Overview</h2>
      <p>Morocco is generally safe for tourists, with millions visiting annually. However, like any destination, it requires awareness and common-sense precautions.</p>

      <h2>Current Safety Status</h2>
      <p>Morocco maintains good security, especially in tourist areas. The government prioritizes tourist safety, and crime rates against visitors are low compared to many destinations.</p>

      <h2>Common Concerns Addressed</h2>
      <h3>Pickpocketing & Petty Crime</h3>
      <p>Common in crowded areas like Jemaa el-Fnaa and medinas. Use money belts, avoid displaying valuables, and stay aware in crowds.</p>

      <h3>Scams & Hassle</h3>
      <p>Some touts may try to overcharge or mislead tourists. Politely decline unwanted services and use registered guides.</p>

      <h3>Transportation Safety</h3>
      <p>Use registered taxis (petit taxis) or reputable ride services. Avoid hitching or unofficial transport.</p>

      <h2>Women's Safety</h2>
      <p>Morocco is safe for female travelers who dress modestly and are culturally aware. Harassment is rare but can occur. Dress conservatively, especially in rural areas.</p>

      <h2>Health & Medical Safety</h2>
      <p>Tap water isn't safe to drink - use bottled water. Medical facilities are good in cities. Required vaccinations are minimal for most travelers.</p>

      <h2>Natural Risks</h2>
      <ul>
        <li>Heat exhaustion in desert areas</li>
        <li>Altitude sickness in mountains</li>
        <li>Strong currents at beaches</li>
        <li>Earthquakes (rare but possible)</li>
      </ul>

      <h2>Emergency Resources</h2>
      <ul>
        <li>Police: 19 (tourist police in major cities)</li>
        <li>Ambulance/Fire: 15</li>
        <li>US Embassy Marrakech: +212-524-376-349</li>
        <li>UK Consulate: +212-522-557-200</li>
        <li>Travel insurance with medical evacuation coverage</li>
      </ul>

      <h2>Practical Safety Tips</h2>
      <ul>
        <li>Keep photocopies of your passport</li>
        <li>Use hotel safes for valuables</li>
        <li>Avoid walking alone at night</li>
        <li>Learn basic Arabic phrases</li>
        <li>Respect local customs and dress modestly</li>
        <li>Stay hydrated and use sunscreen</li>
      </ul>
    `,
    tableOfContents: [
      { id: "morocco-safety-overview", label: "Morocco's Safety Overview" },
      { id: "current-safety-status", label: "Current Safety Status" },
      { id: "common-concerns", label: "Common Concerns Addressed" },
      { id: "womens-safety", label: "Women's Safety" },
      { id: "health-safety", label: "Health & Medical Safety" },
      { id: "natural-risks", label: "Natural Risks" },
      { id: "emergency-resources", label: "Emergency Resources" },
      { id: "practical-safety-tips", label: "Practical Safety Tips" }
    ]
  },
  {
    slug: "hidden-gems-morocco",
    title: "Hidden Gems: Undiscovered Morocco",
    excerpt: "Beyond the tourist trail: authentic experiences and off-the-beaten-path destinations.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80",
    category: "Destinations",
    date: "2025-01-20",
    readTime: "10 min",
    author: "Amina El Fassi",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>Why Seek Hidden Gems?</h2>
      <p>While Morocco's popular destinations are incredible, the real magic happens off the beaten path. Hidden gems offer authentic experiences and fewer crowds.</p>

      <h2>Southern Morocco Secrets</h2>
      <h3>Tata Region</h3>
      <p>A remote desert region with dramatic landscapes, ancient kasbahs, and authentic Berber culture. Visit the Tata Gorge and stay in traditional villages.</p>

      <h3>Anti-Atlas Mountains</h3>
      <p>Less visited than the High Atlas, offering stunning hikes, hot springs, and traditional Berber villages. Perfect for nature lovers seeking solitude.</p>

      <h2>Northern Hidden Treasures</h2>
      <h3>Talassemtane National Park</h3>
      <p>One of Morocco's most beautiful national parks, with cedar forests, waterfalls, and Barbary macaques. Excellent for hiking and wildlife viewing.</p>

      <h3>Al Hoceima Region</h3>
      <p>Mediterranean coastline with pristine beaches, Spanish colonial architecture, and fresh seafood. Much more relaxed than the south.</p>

      <h2>Coastal Gems</h2>
      <h3>Sidi Ifni</h3>
      <p>A former Spanish colony with stunning Art Deco architecture and beautiful beaches. The medina is a UNESCO site with unique blue-washed buildings.</p>

      <h3>Mirleft</h3>
      <p>A surfer's paradise with consistent waves, beautiful beaches, and a laid-back atmosphere. Great for water sports and relaxation.</p>

      <h2>Cultural Experiences</h2>
      <h3>Berber Villages in the M'Goun</h3>
      <p>Authentic mountain villages where time stands still. Experience traditional Berber life, try local cuisine, and learn about ancient customs.</p>

      <h3>Guelmim Oasis</h3>
      <p>A lush desert oasis with date palms, traditional mud-brick architecture, and welcoming locals. Perfect for a peaceful desert retreat.</p>

      <h2>Practical Tips for Hidden Gems</h2>
      <ul>
        <li>Rent a 4x4 vehicle for remote areas</li>
        <li>Learn basic Tashelhit (Berber language) phrases</li>
        <li>Carry plenty of water and snacks</li>
        <li>Respect local customs and ask permission before photographing</li>
        <li>Support local businesses and artisans</li>
        <li>Be prepared for basic accommodations</li>
      </ul>

      <h2>Responsible Tourism</h2>
      <p>When visiting hidden gems, your impact is greater. Choose eco-friendly options, minimize waste, and contribute positively to local communities.</p>
    `,
    tableOfContents: [
      { id: "why-seek-hidden-gems", label: "Why Seek Hidden Gems?" },
      { id: "southern-secrets", label: "Southern Morocco Secrets" },
      { id: "northern-treasures", label: "Northern Hidden Treasures" },
      { id: "coastal-gems", label: "Coastal Gems" },
      { id: "cultural-experiences", label: "Cultural Experiences" },
      { id: "practical-tips", label: "Practical Tips for Hidden Gems" },
      { id: "responsible-tourism", label: "Responsible Tourism" }
    ]
  },
  {
    slug: "fes-cultural-guide",
    title: "Fes: Morocco's Cultural Capital",
    excerpt: "Immerse yourself in Morocco's oldest imperial city, a living museum of Islamic art and architecture.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    category: "Culture",
    date: "2025-01-15",
    readTime: "9 min",
    author: "Karim Tazi",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>Fes: A Living Museum</h2>
      <p>Fes is Morocco's cultural heart, home to the world's oldest university and one of the largest car-free urban areas. The medina is a UNESCO World Heritage site.</p>

      <h2>Historical Significance</h2>
      <p>Founded in 789 AD, Fes was Morocco's capital for centuries. It became a center of learning, attracting scholars from across the Islamic world. The city's architecture reflects this golden age.</p>

      <h2>The Medina Experience</h2>
      <h3>Medina Structure</h3>
      <p>The medina is divided into quarters (fondouks), each specializing in different crafts. Wander narrow alleys filled with artisans, merchants, and scholars.</p>

      <h3>Key Landmarks</h3>
      <ul>
        <li><strong>University of Al Quaraouiyine:</strong> World's oldest continuously operating university</li>
        <li><strong>Kairaouine Mosque:</strong> One of Islam's largest mosques (non-Muslims cannot enter)</li>
        <li><strong>Bou Inania Madrasa:</strong> Stunning example of Marinid architecture</li>
        <li><strong>Dar Batha Museum:</strong> Traditional Moroccan arts and crafts</li>
      </ul>

      <h2>Traditional Crafts</h2>
      <h3>Tanneries</h3>
      <p>Visit the famous Chouara Tannery, where leather is dyed using traditional methods. The smell is strong, but the process is fascinating.</p>

      <h3>Ceramics & Pottery</h3>
      <p>Fes is renowned for its blue-glazed pottery. Visit workshops to see artisans at work and purchase authentic pieces.</p>

      <h3>Metalwork & Carpentry</h3>
      <p>Skilled craftsmen create intricate brass lamps, wooden doors, and decorative items using traditional techniques.</p>

      <h2>Cultural Experiences</h2>
      <h3>Hammam Visit</h3>
      <p>Experience a traditional Moroccan bathhouse. Many historic hammams offer separate facilities for men and women.</p>

      <h3>Cooking Classes</h3>
      <p>Learn to make traditional Fassi cuisine, including pastilla and tagine. Visit local markets to source ingredients.</p>

      <h3>Musical Heritage</h3>
      <p>Fes has a rich musical tradition. Attend performances of Andalusian classical music or visit the Museum of Music.</p>

      <h2>Modern Fes</h2>
      <p>Beyond the medina, Fes has modern districts with contemporary art galleries, cafes, and universities. The city successfully blends tradition with modernity.</p>

      <h2>Practical Tips</h2>
      <ul>
        <li>Hire a local guide for the medina - it's easy to get lost</li>
        <li>Dress modestly when visiting religious sites</li>
        <li>Try local specialties like fava bean soup and almond pastries</li>
        <li>Visit early morning or late afternoon to avoid crowds</li>
        <li>Support local artisans by buying directly from workshops</li>
      </ul>
    `,
    tableOfContents: [
      { id: "fes-living-museum", label: "Fes: A Living Museum" },
      { id: "historical-significance", label: "Historical Significance" },
      { id: "medina-experience", label: "The Medina Experience" },
      { id: "traditional-crafts", label: "Traditional Crafts" },
      { id: "cultural-experiences", label: "Cultural Experiences" },
      { id: "modern-fes", label: "Modern Fes" },
      { id: "practical-tips", label: "Practical Tips" }
    ]
  },
  {
    slug: "rabat-coastal-guide",
    title: "Rabat: Morocco's Modern Capital",
    excerpt: "Discover Morocco's sophisticated capital city, blending French colonial architecture with Islamic heritage.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    category: "Destinations",
    date: "2025-01-10",
    readTime: "8 min",
    author: "Fatima Zahra",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    content: `
      <h2>Rabat: Morocco's Underrated Capital</h2>
      <p>While Marrakech and Fes steal the spotlight, Rabat offers a sophisticated blend of modernity and tradition. As Morocco's capital, it's surprisingly relaxed and pedestrian-friendly.</p>

      <h2>Historical Districts</h2>
      <h3>The Medina</h3>
      <p>Rabat's medina is smaller and less touristy than Marrakech's. It's perfect for experiencing authentic Moroccan life without the crowds.</p>

      <h3>The Oudayas</h3>
      <p>A picturesque neighborhood with white-washed houses, blue doors, and stunning ocean views. The Oudayas Kasbah is a historic fortress with beautiful gardens.</p>

      <h2>Architectural Highlights</h2>
      <h3>Hassan Tower</h3>
      <p>A 12th-century minaret that's all that remains of what was intended to be the world's largest mosque. The adjacent ruins are hauntingly beautiful.</p>

      <h3>Mohammed V Mausoleum</h3>
      <p>The final resting place of King Mohammed V and his sons. The intricate marble work and gold leaf make it one of Morocco's most beautiful buildings.</p>

      <h3>Chellah Necropolis</h3>
      <p>Roman and Islamic ruins with storks nesting in the crumbling walls. It's a peaceful spot for reflection and photography.</p>

      <h2>Modern Rabat</h2>
      <h3>Ville Nouvelle</h3>
      <p>The French colonial quarter with Art Deco buildings, cafes, and boulevards. Perfect for people-watching and experiencing modern Moroccan life.</p>

      <h3>Skhirat Beach</h3>
      <p>A beautiful beach just outside the city, popular with locals for swimming and picnics. The coastal road offers stunning views.</p>

      <h2>Cultural Scene</h2>
      <ul>
        <li><strong>Museums:</strong> Visit the Museum of Contemporary Art or the National Museum of Jewellery</li>
        <li><strong>Galleries:</strong> Rabat has a thriving contemporary art scene</li>
        <li><strong>Festivals:</strong> The city hosts international festivals and cultural events</li>
        <li><strong>Universities:</strong> The intellectual atmosphere is palpable</li>
      </ul>

      <h2>Dining in Rabat</h2>
      <p>Rabat offers excellent dining options, from traditional Moroccan restaurants to modern fusion cuisine. The medina has great street food, while Ville Nouvelle offers international options.</p>

      <h2>Why Visit Rabat?</h2>
      <ul>
        <li>Less crowded than other Moroccan cities</li>
        <li>Beautiful blend of old and new</li>
        <li>Excellent food scene</li>
        <li>Easy to navigate on foot</li>
        <li>Authentic Moroccan urban life</li>
      </ul>

      <h2>Practical Information</h2>
      <ul>
        <li>Rabat is very walkable - rent a bike for the coastal areas</li>
        <li>The city is safe and easy for solo travelers</li>
        <li>English is widely spoken in tourist areas</li>
        <li>Public transport is efficient and inexpensive</li>
        <li>Visit during the week for a more local experience</li>
      </ul>
    `,
    tableOfContents: [
      { id: "rabat-underrated-capital", label: "Rabat: Morocco's Underrated Capital" },
      { id: "historical-districts", label: "Historical Districts" },
      { id: "architectural-highlights", label: "Architectural Highlights" },
      { id: "modern-rabat", label: "Modern Rabat" },
      { id: "cultural-scene", label: "Cultural Scene" },
      { id: "dining-rabat", label: "Dining in Rabat" },
      { id: "why-visit-rabat", label: "Why Visit Rabat?" },
      { id: "practical-information", label: "Practical Information" }
    ]
  }
]
