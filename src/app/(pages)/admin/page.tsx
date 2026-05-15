"use client";

import { useEffect, useMemo, useState } from "react";
import { type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Database,
  Edit3,
  FileText,
  Globe,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  type Booking,
  type BookingStatus,
  type Lead,
  type LeadStatus,
  type PaymentStatus,
} from "@/lib/admin-db";
import {
  type Testimonial,
  type TripDetailContent,
  type TripGeneratorOptions,
} from "@/lib/content-db";
import {
  type BlogPost,
  type ContentStatus,
  type Destination,
  type Experience,
  type Trip,
} from "@/lib/data";

type TripFormState = {
  id: string;
  status: ContentStatus;
  title: string;
  description: string;
  image: string;
  images: string;
  category: Trip["category"];
  duration: string;
  price: string;
  rating: string;
  reviews: string;
  locations: string;
  itinerary: string;
  highlights: string;
  includes: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

type ExperienceFormState = {
  id: string;
  status: ContentStatus;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  price: string;
  rating: string;
  location: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

type DestinationFormState = {
  slug: string;
  status: ContentStatus;
  name: string;
  nameFr: string;
  nameAr: string;
  description: string;
  image: string;
  images: string;
  rating: string;
  reviews: string;
  bestTime: string;
  highlights: string;
  experiences: string;
  itineraries: string;
  detailIntro: string;
  detailBestFor: string;
  detailAreas: string;
  detailFood: string;
  detailLocalTips: string;
  detailGettingAround: string;
  detailWhereToStay: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

type BlogPostFormState = {
  slug: string;
  status: ContentStatus;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  contentMarkdown: string;
  tableOfContents: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

type TestimonialFormState = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating: string;
};

const categories: Trip["category"][] = [
  "luxury",
  "budget",
  "adventure",
  "cultural",
  "romantic",
  "family",
];
const experienceCategories = [
  "Adventure",
  "Wellness",
  "Food & Drink",
  "Culture",
];
const bookingStatuses: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];
const paymentStatuses: PaymentStatus[] = [
  "unpaid",
  "deposit",
  "paid",
  "refunded",
];
const leadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

const sectionTransition = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
  transition: { duration: 0.28, ease: "easeOut" },
} as const;

const emptyTripForm: TripFormState = {
  id: "",
  status: "published",
  title: "",
  description: "",
  image: "",
  images: "",
  category: "adventure",
  duration: "3",
  price: "2500",
  rating: "4.8",
  reviews: "0",
  locations: "",
  itinerary: "",
  highlights: "",
  includes: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

const emptyExperienceForm: ExperienceFormState = {
  id: "",
  status: "published",
  title: "",
  description: "",
  image: "",
  category: "Adventure",
  duration: "3 hours",
  price: "300",
  rating: "4.8",
  location: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

const emptyDestinationForm: DestinationFormState = {
  slug: "",
  status: "published",
  name: "",
  nameFr: "",
  nameAr: "",
  description: "",
  image: "",
  images: "",
  rating: "4.8",
  reviews: "0",
  bestTime: "",
  highlights: "",
  experiences: "",
  itineraries: "",
  detailIntro: "",
  detailBestFor: "",
  detailAreas: "",
  detailFood: "",
  detailLocalTips: "",
  detailGettingAround: "",
  detailWhereToStay: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

const emptyBlogPostForm: BlogPostFormState = {
  slug: "",
  status: "published",
  title: "",
  excerpt: "",
  image: "",
  category: "Tips",
  date: new Date().toISOString().slice(0, 10),
  readTime: "5 min",
  author: "",
  authorAvatar: "",
  contentMarkdown: "",
  tableOfContents: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

const emptyTestimonialForm: TestimonialFormState = {
  id: "",
  name: "",
  location: "",
  avatar: "",
  text: "",
  rating: "5",
};

const emptyTripGeneratorOptions: TripGeneratorOptions = {
  travelStyles: [],
  destinations: [],
};

const emptyTripDetailContent: TripDetailContent = {
  faqs: [],
  reviews: [],
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatInlineMarkdown = (value: string) => {
  let html = escapeHtml(value);

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  return html;
};

const markdownToHtml = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const title = line.replace(/^###\s+/, "").trim();
      html.push(
        `<h3 id="${slugify(title)}">${formatInlineMarkdown(title)}</h3>`,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      html.push(
        `<h2 id="${slugify(title)}">${formatInlineMarkdown(title)}</h2>`,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(
        `<blockquote>${formatInlineMarkdown(quoteLines.join(" "))}</blockquote>`,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(
          `<li>${formatInlineMarkdown(lines[index].trim().replace(/^[-*]\s+/, ""))}</li>`,
        );
        index += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(
          `<li>${formatInlineMarkdown(lines[index].trim().replace(/^\d+\.\s+/, ""))}</li>`,
        );
        index += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{2,3}\s+/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("> ")
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${formatInlineMarkdown(paragraphLines.join(" "))}</p>`);
  }

  return html.join("\n\n");
};

const htmlToMarkdown = (html: string) =>
  html
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n")
    .replace(
      /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
      (_, list) =>
        `\n\n${list.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")}\n`,
    )
    .replace(
      /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
      (_, list) =>
        `\n\n${list.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "1. $1\n")}\n`,
    )
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const markdownTableOfContents = (markdown: string) =>
  markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const label = line.replace(/^##\s+/, "").trim();
      return `${slugify(label)} | ${label}`;
    })
    .join("\n");

const tripToFormState = (trip: Trip): TripFormState => ({
  id: trip.id,
  status: trip.status ?? "published",
  title: trip.title,
  description: trip.description,
  image: trip.image,
  images: trip.images.join("\n"),
  category: trip.category,
  duration: String(trip.duration),
  price: String(trip.price),
  rating: String(trip.rating),
  reviews: String(trip.reviews),
  locations: trip.locations.join("\n"),
  itinerary: trip.itinerary
    .map((item) => `${item.title} | ${item.description}`)
    .join("\n"),
  highlights: trip.highlights.join("\n"),
  includes: trip.includes.join("\n"),
  seoTitle: trip.seo?.title ?? "",
  seoDescription: trip.seo?.description ?? "",
  seoImage: trip.seo?.image ?? "",
});

const formStateToTrip = (form: TripFormState): Trip => ({
  id: slugify(form.id || form.title),
  status: form.status,
  title: form.title.trim(),
  description: form.description.trim(),
  image: form.image.trim(),
  images: splitLines(form.images),
  category: form.category,
  duration: Number(form.duration),
  price: Number(form.price),
  rating: Number(form.rating),
  reviews: Number(form.reviews),
  locations: splitLines(form.locations),
  itinerary: splitLines(form.itinerary).map((line, index) => {
    const [title, ...descriptionParts] = line.split("|");

    return {
      day: index + 1,
      title: title.trim(),
      description: descriptionParts.join("|").trim(),
    };
  }),
  highlights: splitLines(form.highlights),
  includes: splitLines(form.includes),
  seo: {
    title: form.seoTitle.trim() || undefined,
    description: form.seoDescription.trim() || undefined,
    image: form.seoImage.trim() || undefined,
  },
});

const experienceToFormState = (
  experience: Experience,
): ExperienceFormState => ({
  id: experience.id,
  status: experience.status ?? "published",
  title: experience.title,
  description: experience.description,
  image: experience.image,
  category: experience.category,
  duration: experience.duration,
  price: String(experience.price),
  rating: String(experience.rating),
  location: experience.location,
  seoTitle: experience.seo?.title ?? "",
  seoDescription: experience.seo?.description ?? "",
  seoImage: experience.seo?.image ?? "",
});

const formStateToExperience = (form: ExperienceFormState): Experience => ({
  id: slugify(form.id || form.title),
  status: form.status,
  title: form.title.trim(),
  description: form.description.trim(),
  image: form.image.trim(),
  category: form.category,
  duration: form.duration.trim(),
  price: Number(form.price),
  rating: Number(form.rating),
  location: form.location.trim(),
  seo: {
    title: form.seoTitle.trim() || undefined,
    description: form.seoDescription.trim() || undefined,
    image: form.seoImage.trim() || undefined,
  },
});

const destinationToFormState = (
  destination: Destination,
): DestinationFormState => ({
  slug: destination.slug,
  status: destination.status ?? "published",
  name: destination.name,
  nameFr: destination.nameFr ?? "",
  nameAr: destination.nameAr ?? "",
  description: destination.description,
  image: destination.image,
  images: destination.images.join("\n"),
  rating: String(destination.rating),
  reviews: String(destination.reviews),
  bestTime: destination.bestTime,
  highlights: destination.highlights.join("\n"),
  experiences: destination.experiences.join("\n"),
  itineraries: destination.itineraries
    .map((item) => `${item.days} | ${item.title} | ${item.price}`)
    .join("\n"),
  detailIntro: destination.details?.intro ?? "",
  detailBestFor: destination.details?.bestFor.join("\n") ?? "",
  detailAreas:
    destination.details?.areas
      .map((item) => `${item.title} | ${item.description}`)
      .join("\n") ?? "",
  detailFood: destination.details?.food.join("\n") ?? "",
  detailLocalTips: destination.details?.localTips.join("\n") ?? "",
  detailGettingAround: destination.details?.gettingAround ?? "",
  detailWhereToStay: destination.details?.whereToStay ?? "",
  seoTitle: destination.seo?.title ?? "",
  seoDescription: destination.seo?.description ?? "",
  seoImage: destination.seo?.image ?? "",
});

const formStateToDestination = (form: DestinationFormState): Destination => ({
  slug: slugify(form.slug || form.name),
  status: form.status,
  name: form.name.trim(),
  nameFr: form.nameFr.trim() || undefined,
  nameAr: form.nameAr.trim() || undefined,
  description: form.description.trim(),
  image: form.image.trim(),
  images: splitLines(form.images),
  rating: Number(form.rating),
  reviews: Number(form.reviews),
  bestTime: form.bestTime.trim(),
  highlights: splitLines(form.highlights),
  experiences: splitLines(form.experiences),
  itineraries: splitLines(form.itineraries).map((line) => {
    const [days, title, price] = line.split("|");

    return {
      days: Number(days?.trim() || 1),
      title: title?.trim() || "Custom itinerary",
      price: Number(price?.trim() || 0),
    };
  }),
  details: {
    intro: form.detailIntro.trim(),
    bestFor: splitLines(form.detailBestFor),
    areas: splitLines(form.detailAreas).map((line) => {
      const [title, ...descriptionParts] = line.split("|");

      return {
        title: title.trim(),
        description: descriptionParts.join("|").trim(),
      };
    }),
    food: splitLines(form.detailFood),
    localTips: splitLines(form.detailLocalTips),
    gettingAround: form.detailGettingAround.trim(),
    whereToStay: form.detailWhereToStay.trim(),
  },
  seo: {
    title: form.seoTitle.trim() || undefined,
    description: form.seoDescription.trim() || undefined,
    image: form.seoImage.trim() || undefined,
  },
});

const blogPostToFormState = (post: BlogPost): BlogPostFormState => ({
  slug: post.slug,
  status: post.status ?? "published",
  title: post.title,
  excerpt: post.excerpt,
  image: post.image,
  category: post.category,
  date: post.date,
  readTime: post.readTime,
  author: post.author,
  authorAvatar: post.authorAvatar,
  contentMarkdown: htmlToMarkdown(post.content),
  tableOfContents: post.tableOfContents
    .map((item) => `${item.id} | ${item.label}`)
    .join("\n"),
  seoTitle: post.seo?.title ?? "",
  seoDescription: post.seo?.description ?? "",
  seoImage: post.seo?.image ?? "",
});

const formStateToBlogPost = (form: BlogPostFormState): BlogPost => {
  const tableOfContents = splitLines(
    form.tableOfContents || markdownTableOfContents(form.contentMarkdown),
  ).map((line) => {
    const [id, ...labelParts] = line.split("|");

    return {
      id: slugify(id.trim()),
      label: labelParts.join("|").trim(),
    };
  });

  return {
    slug: slugify(form.slug || form.title),
    status: form.status,
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    image: form.image.trim(),
    category: form.category.trim(),
    date: form.date.trim(),
    readTime: form.readTime.trim(),
    author: form.author.trim(),
    authorAvatar: form.authorAvatar.trim(),
    content: markdownToHtml(form.contentMarkdown),
    tableOfContents,
    seo: {
      title: form.seoTitle.trim() || undefined,
      description: form.seoDescription.trim() || undefined,
      image: form.seoImage.trim() || undefined,
    },
  };
};

const testimonialToFormState = (
  testimonial: Testimonial,
): TestimonialFormState => ({
  id: testimonial.id,
  name: testimonial.name,
  location: testimonial.location,
  avatar: testimonial.avatar,
  text: testimonial.text,
  rating: String(testimonial.rating),
});

const formStateToTestimonial = (form: TestimonialFormState): Testimonial => ({
  id: slugify(form.id || form.name),
  name: form.name.trim(),
  location: form.location.trim(),
  avatar: form.avatar.trim(),
  text: form.text.trim(),
  rating: Number(form.rating),
});

type ContentIssue = {
  id: string;
  type: string;
  title: string;
  missing: string[];
  actionLabel: string;
  onAction: () => void;
};

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tripGeneratorOptions, setTripGeneratorOptions] =
    useState<TripGeneratorOptions>(emptyTripGeneratorOptions);
  const [tripDetailContent, setTripDetailContent] = useState<TripDetailContent>(
    emptyTripDetailContent,
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState<
    string | null
  >(null);
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<
    string | null
  >(null);
  const [form, setForm] = useState<TripFormState>(emptyTripForm);
  const [destinationForm, setDestinationForm] =
    useState<DestinationFormState>(emptyDestinationForm);
  const [experienceForm, setExperienceForm] =
    useState<ExperienceFormState>(emptyExperienceForm);
  const [blogPostForm, setBlogPostForm] =
    useState<BlogPostFormState>(emptyBlogPostForm);
  const [testimonialForm, setTestimonialForm] =
    useState<TestimonialFormState>(emptyTestimonialForm);
  const [tripGeneratorOptionsJson, setTripGeneratorOptionsJson] = useState("");
  const [tripDetailContentJson, setTripDetailContentJson] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isEditing = Boolean(selectedTripId);
  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.id === selectedTripId) ?? null,
    [selectedTripId, trips],
  );
  const isEditingDestination = Boolean(selectedDestinationSlug);
  const selectedDestination = useMemo(
    () =>
      destinations.find(
        (destination) => destination.slug === selectedDestinationSlug,
      ) ?? null,
    [selectedDestinationSlug, destinations],
  );
  const isEditingExperience = Boolean(selectedExperienceId);
  const selectedExperience = useMemo(
    () =>
      experiences.find(
        (experience) => experience.id === selectedExperienceId,
      ) ?? null,
    [selectedExperienceId, experiences],
  );
  const isEditingBlogPost = Boolean(selectedBlogSlug);
  const selectedBlogPost = useMemo(
    () => blogPosts.find((post) => post.slug === selectedBlogSlug) ?? null,
    [selectedBlogSlug, blogPosts],
  );
  const isEditingTestimonial = Boolean(selectedTestimonialId);
  const selectedTestimonial = useMemo(
    () =>
      testimonials.find(
        (testimonial) => testimonial.id === selectedTestimonialId,
      ) ?? null,
    [selectedTestimonialId, testimonials],
  );
  const blogPostPreviewHtml = useMemo(
    () => markdownToHtml(blogPostForm.contentMarkdown),
    [blogPostForm.contentMarkdown],
  );
  const selectedBlogPostHref = selectedBlogSlug
    ? `/blog/${selectedBlogSlug}`
    : null;
  const averageTripPrice = trips.length
    ? Math.round(
        trips.reduce((total, trip) => total + trip.price, 0) / trips.length,
      )
    : 0;
  const averageRating = trips.length
    ? (
        trips.reduce((total, trip) => total + trip.rating, 0) / trips.length
      ).toFixed(1)
    : "0.0";
  const totalReviews = trips.reduce((total, trip) => total + trip.reviews, 0);
  const totalRevenue = bookings.reduce(
    (total, booking) => total + booking.totalMAD,
    0,
  );
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const openLeads = leads.filter(
    (lead) => !["won", "lost"].includes(lead.status),
  ).length;
  const wonLeads = leads.filter((lead) => lead.status === "won").length;
  const conversionRate = leads.length
    ? Math.round((wonLeads / leads.length) * 100)
    : 0;
  const categoryStats = categories.map((category) => ({
    category,
    count: trips.filter((trip) => trip.category === category).length,
  }));
  const highestValueTrips = [...trips]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  const shortestTrip = trips.length
    ? [...trips].sort((a, b) => a.duration - b.duration)[0]
    : null;
  const longestTrip = trips.length
    ? [...trips].sort((a, b) => b.duration - a.duration)[0]
    : null;
  const contentIssues = useMemo<ContentIssue[]>(() => {
    const issues: ContentIssue[] = [];

    trips.forEach((trip) => {
      const missing = [
        !trip.title.trim() && "title",
        !trip.description.trim() && "description",
        !trip.image.trim() && "hero image",
        trip.images.length === 0 && "gallery images",
        trip.locations.length === 0 && "locations",
        trip.itinerary.length === 0 && "itinerary",
        trip.highlights.length === 0 && "highlights",
        trip.includes.length === 0 && "included items",
      ].filter(Boolean) as string[];

      if (missing.length > 0) {
        issues.push({
          id: `trip-${trip.id}`,
          type: "Trip",
          title: trip.title || trip.id || "Untitled trip",
          missing,
          actionLabel: "Fix trip",
          onAction: () => startEditingTrip(trip),
        });
      }
    });

    experiences.forEach((experience) => {
      const missing = [
        !experience.title.trim() && "title",
        !experience.description.trim() && "description",
        !experience.image.trim() && "image",
        !experience.category.trim() && "category",
        !experience.duration.trim() && "duration",
        !experience.location.trim() && "location",
        !Number.isFinite(experience.price) && "price",
        !Number.isFinite(experience.rating) && "rating",
      ].filter(Boolean) as string[];

      if (missing.length > 0) {
        issues.push({
          id: `experience-${experience.id}`,
          type: "Experience",
          title: experience.title || experience.id || "Untitled experience",
          missing,
          actionLabel: "Fix experience",
          onAction: () => startEditingExperience(experience),
        });
      }
    });

    destinations.forEach((destination) => {
      const missing = [
        !destination.name.trim() && "name",
        !destination.description.trim() && "description",
        !destination.image.trim() && "hero image",
        destination.images.length === 0 && "gallery images",
        destination.highlights.length === 0 && "highlights",
        destination.experiences.length === 0 && "experience details",
        destination.itineraries.length === 0 && "itineraries",
        !destination.details?.intro?.trim() && "destination intro",
        !destination.details?.gettingAround?.trim() && "getting around details",
        !destination.details?.whereToStay?.trim() && "where to stay details",
      ].filter(Boolean) as string[];

      if (missing.length > 0) {
        issues.push({
          id: `destination-${destination.slug}`,
          type: "Destination",
          title: destination.name || destination.slug || "Untitled destination",
          missing,
          actionLabel: "Fix destination",
          onAction: () => startEditingDestination(destination),
        });
      }
    });

    blogPosts.forEach((post) => {
      const missing = [
        !post.title.trim() && "title",
        !post.excerpt.trim() && "excerpt",
        !post.image.trim() && "image",
        !post.content.trim() && "content",
        post.tableOfContents.length === 0 && "table of contents",
      ].filter(Boolean) as string[];

      if (missing.length > 0) {
        issues.push({
          id: `blog-${post.slug}`,
          type: "Blog",
          title: post.title || post.slug || "Untitled blog post",
          missing,
          actionLabel: "View content",
          onAction: () => setActiveSection("content"),
        });
      }
    });

    return issues;
  }, [blogPosts, destinations, experiences, trips]);
  const contentItemCount =
    trips.length +
    experiences.length +
    destinations.length +
    blogPosts.length +
    testimonials.length;
  const healthyContentCount = Math.max(
    contentItemCount - contentIssues.length,
    0,
  );
  const contentHealth = contentItemCount
    ? Math.round((healthyContentCount / contentItemCount) * 100)
    : 0;

  async function loadTrips() {
    const response = await fetch("/api/trips?admin=1");
    const data = (await response.json()) as { trips: Trip[] };
    setTrips(data.trips);
  }

  async function loadExperiences() {
    const response = await fetch("/api/experiences?admin=1");
    const data = (await response.json()) as { experiences: Experience[] };
    setExperiences(data.experiences);
  }

  async function loadDestinations() {
    const response = await fetch("/api/destinations?admin=1");
    const data = (await response.json()) as { destinations: Destination[] };
    setDestinations(data.destinations);
  }

  async function loadBlogPosts() {
    const response = await fetch("/api/blog?admin=1");
    const data = (await response.json()) as { posts: BlogPost[] };
    setBlogPosts(data.posts);
  }

  async function loadTestimonials() {
    const response = await fetch("/api/testimonials");
    const data = (await response.json()) as { testimonials: Testimonial[] };
    setTestimonials(data.testimonials);
  }

  async function loadOperations() {
    const [bookingsResponse, leadsResponse] = await Promise.all([
      fetch("/api/bookings"),
      fetch("/api/leads"),
    ]);
    const bookingsData = (await bookingsResponse.json()) as {
      bookings: Booking[];
    };
    const leadsData = (await leadsResponse.json()) as { leads: Lead[] };

    setBookings(bookingsData.bookings);
    setLeads(leadsData.leads);
  }

  async function loadDashboardData(ignoreRef?: { current: boolean }) {
    Promise.all([
      fetch("/api/trips?admin=1").then(
        (response) => response.json() as Promise<{ trips: Trip[] }>,
      ),
      fetch("/api/destinations?admin=1").then(
        (response) =>
          response.json() as Promise<{ destinations: Destination[] }>,
      ),
      fetch("/api/experiences?admin=1").then(
        (response) => response.json() as Promise<{ experiences: Experience[] }>,
      ),
      fetch("/api/blog?admin=1").then(
        (response) => response.json() as Promise<{ posts: BlogPost[] }>,
      ),
      fetch("/api/testimonials").then(
        (response) =>
          response.json() as Promise<{ testimonials: Testimonial[] }>,
      ),
      fetch("/api/trip-generator-options").then(
        (response) =>
          response.json() as Promise<{ options: TripGeneratorOptions }>,
      ),
      fetch("/api/trip-detail-content").then(
        (response) =>
          response.json() as Promise<{ content: TripDetailContent }>,
      ),
      fetch("/api/bookings").then(
        (response) => response.json() as Promise<{ bookings: Booking[] }>,
      ),
      fetch("/api/leads").then(
        (response) => response.json() as Promise<{ leads: Lead[] }>,
      ),
    ]).then(
      ([
        tripsData,
        destinationsData,
        experiencesData,
        blogData,
        testimonialsData,
        tripGeneratorData,
        tripDetailData,
        bookingsData,
        leadsData,
      ]) => {
        if (!ignoreRef?.current) {
          setTrips(tripsData.trips);
          setDestinations(destinationsData.destinations);
          setExperiences(experiencesData.experiences);
          setBlogPosts(blogData.posts);
          setTestimonials(testimonialsData.testimonials);
          setTripGeneratorOptions(tripGeneratorData.options);
          setTripGeneratorOptionsJson(
            JSON.stringify(tripGeneratorData.options, null, 2),
          );
          setTripDetailContent(tripDetailData.content);
          setTripDetailContentJson(
            JSON.stringify(tripDetailData.content, null, 2),
          );
          setBookings(bookingsData.bookings);
          setLeads(leadsData.leads);
        }
      },
    );
  }

  useEffect(() => {
    const ignoreRef = { current: false };

    fetch("/api/admin/session")
      .then(
        (response) => response.json() as Promise<{ authenticated: boolean }>,
      )
      .then((data) => {
        if (ignoreRef.current) return;
        setIsAuthenticated(data.authenticated);

        if (data.authenticated) {
          void loadDashboardData(ignoreRef);
        }
      });

    return () => {
      ignoreRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  function updateField<K extends keyof TripFormState>(
    field: K,
    value: TripFormState[K],
  ) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function updateExperienceField<K extends keyof ExperienceFormState>(
    field: K,
    value: ExperienceFormState[K],
  ) {
    setExperienceForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function updateDestinationField<K extends keyof DestinationFormState>(
    field: K,
    value: DestinationFormState[K],
  ) {
    setDestinationForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function updateBlogPostField<K extends keyof BlogPostFormState>(
    field: K,
    value: BlogPostFormState[K],
  ) {
    setBlogPostForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function insertBlogMarkdown(markdown: string) {
    setBlogPostForm((currentForm) => ({
      ...currentForm,
      contentMarkdown: `${currentForm.contentMarkdown}${currentForm.contentMarkdown.endsWith("\n") || !currentForm.contentMarkdown ? "" : "\n\n"}${markdown}`,
    }));
  }

  function generateBlogTableOfContents() {
    const tableOfContents = markdownTableOfContents(
      blogPostForm.contentMarkdown,
    );

    if (!tableOfContents) {
      setMessage(
        "Add at least one ## heading before generating a table of contents.",
      );
      return;
    }

    updateBlogPostField("tableOfContents", tableOfContents);
    setMessage("Table of contents generated from Markdown headings.");
  }

  async function loginAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (!response.ok) {
        setMessage("Invalid admin password.");
        return;
      }

      setAdminPassword("");
      setIsAuthenticated(true);
      setShowWelcome(true);
      await loadDashboardData();
      setMessage("Welcome back.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function logoutAdmin() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setTrips([]);
    setDestinations([]);
    setExperiences([]);
    setBlogPosts([]);
    setTestimonials([]);
    setBookings([]);
    setLeads([]);
    setShowWelcome(false);
    setMessage("Signed out.");
  }

  function updateTestimonialField<K extends keyof TestimonialFormState>(
    field: K,
    value: TestimonialFormState[K],
  ) {
    setTestimonialForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function startNewTrip() {
    setSelectedTripId(null);
    setForm(emptyTripForm);
    setMessage("");
    setActiveSection("trips");
  }

  function startNewExperience() {
    setSelectedExperienceId(null);
    setExperienceForm(emptyExperienceForm);
    setMessage("");
    setActiveSection("experiences");
  }

  function startNewDestination() {
    setSelectedDestinationSlug(null);
    setDestinationForm(emptyDestinationForm);
    setMessage("");
    setActiveSection("destinations");
  }

  function startNewBlogPost() {
    setSelectedBlogSlug(null);
    setBlogPostForm(emptyBlogPostForm);
    setMessage("");
    setActiveSection("blog");
  }

  function startNewTestimonial() {
    setSelectedTestimonialId(null);
    setTestimonialForm(emptyTestimonialForm);
    setMessage("");
    setActiveSection("testimonials");
  }

  function startEditingTrip(trip: Trip) {
    setSelectedTripId(trip.id);
    setForm(tripToFormState(trip));
    setMessage("");
    setActiveSection("trips");
  }

  function startEditingExperience(experience: Experience) {
    setSelectedExperienceId(experience.id);
    setExperienceForm(experienceToFormState(experience));
    setMessage("");
    setActiveSection("experiences");
  }

  function startEditingDestination(destination: Destination) {
    setSelectedDestinationSlug(destination.slug);
    setDestinationForm(destinationToFormState(destination));
    setMessage("");
    setActiveSection("destinations");
  }

  function startEditingBlogPost(post: BlogPost) {
    setSelectedBlogSlug(post.slug);
    setBlogPostForm(blogPostToFormState(post));
    setMessage("");
    setActiveSection("blog");
  }

  function startEditingTestimonial(testimonial: Testimonial) {
    setSelectedTestimonialId(testimonial.id);
    setTestimonialForm(testimonialToFormState(testimonial));
    setMessage("");
    setActiveSection("testimonials");
  }

  async function saveTrip() {
    setIsSaving(true);
    setMessage("");

    try {
      const trip = formStateToTrip(form);
      const response = await fetch(
        isEditing ? `/api/trips/${selectedTripId}` : "/api/trips",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trip),
        },
      );
      const data = (await response.json()) as { trip?: Trip; error?: string };

      if (!response.ok || !data.trip) {
        setMessage(data.error ?? "Could not save trip.");
        return;
      }

      await loadTrips();
      setSelectedTripId(data.trip.id);
      setForm(tripToFormState(data.trip));
      setMessage(isEditing ? "Trip updated." : "Trip created.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedTrip() {
    if (!selectedTrip) return;
    const confirmed = window.confirm(`Delete "${selectedTrip.title}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/trips/${selectedTrip.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage("Could not delete trip.");
      return;
    }

    await loadTrips();
    startNewTrip();
    setMessage("Trip deleted.");
  }

  async function saveDestination() {
    setIsSaving(true);
    setMessage("");

    try {
      const destination = formStateToDestination(destinationForm);
      const response = await fetch(
        isEditingDestination
          ? `/api/destinations/${selectedDestinationSlug}`
          : "/api/destinations",
        {
          method: isEditingDestination ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(destination),
        },
      );
      const data = (await response.json()) as {
        destination?: Destination;
        error?: string;
      };

      if (!response.ok || !data.destination) {
        setMessage(data.error ?? "Could not save destination.");
        return;
      }

      await loadDestinations();
      setSelectedDestinationSlug(data.destination.slug);
      setDestinationForm(destinationToFormState(data.destination));
      setMessage(
        isEditingDestination ? "Destination updated." : "Destination created.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedDestination() {
    if (!selectedDestination) return;
    const confirmed = window.confirm(`Delete "${selectedDestination.name}"?`);
    if (!confirmed) return;

    const response = await fetch(
      `/api/destinations/${selectedDestination.slug}`,
      { method: "DELETE" },
    );

    if (!response.ok) {
      setMessage("Could not delete destination.");
      return;
    }

    await loadDestinations();
    startNewDestination();
    setMessage("Destination deleted.");
  }

  async function saveExperience() {
    setIsSaving(true);
    setMessage("");

    try {
      const experience = formStateToExperience(experienceForm);
      const response = await fetch(
        isEditingExperience
          ? `/api/experiences/${selectedExperienceId}`
          : "/api/experiences",
        {
          method: isEditingExperience ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(experience),
        },
      );
      const data = (await response.json()) as {
        experience?: Experience;
        error?: string;
      };

      if (!response.ok || !data.experience) {
        setMessage(data.error ?? "Could not save experience.");
        return;
      }

      await loadExperiences();
      setSelectedExperienceId(data.experience.id);
      setExperienceForm(experienceToFormState(data.experience));
      setMessage(
        isEditingExperience ? "Experience updated." : "Experience created.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedExperience() {
    if (!selectedExperience) return;
    const confirmed = window.confirm(`Delete "${selectedExperience.title}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/experiences/${selectedExperience.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage("Could not delete experience.");
      return;
    }

    await loadExperiences();
    startNewExperience();
    setMessage("Experience deleted.");
  }

  async function saveBlogPost() {
    setIsSaving(true);
    setMessage("");

    try {
      const post = formStateToBlogPost(blogPostForm);
      const response = await fetch(
        isEditingBlogPost ? `/api/blog/${selectedBlogSlug}` : "/api/blog",
        {
          method: isEditingBlogPost ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        },
      );
      const data = (await response.json()) as {
        post?: BlogPost;
        error?: string;
      };

      if (!response.ok || !data.post) {
        setMessage(data.error ?? "Could not save blog post.");
        return;
      }

      await loadBlogPosts();
      setSelectedBlogSlug(data.post.slug);
      setBlogPostForm(blogPostToFormState(data.post));
      setMessage(
        isEditingBlogPost ? "Blog post updated." : "Blog post created.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedBlogPost() {
    if (!selectedBlogPost) return;
    const confirmed = window.confirm(`Delete "${selectedBlogPost.title}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/blog/${selectedBlogPost.slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage("Could not delete blog post.");
      return;
    }

    await loadBlogPosts();
    startNewBlogPost();
    setMessage("Blog post deleted.");
  }

  async function saveTestimonial() {
    setIsSaving(true);
    setMessage("");

    try {
      const testimonial = formStateToTestimonial(testimonialForm);
      const response = await fetch(
        isEditingTestimonial
          ? `/api/testimonials/${selectedTestimonialId}`
          : "/api/testimonials",
        {
          method: isEditingTestimonial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testimonial),
        },
      );
      const data = (await response.json()) as {
        testimonial?: Testimonial;
        error?: string;
      };

      if (!response.ok || !data.testimonial) {
        setMessage(data.error ?? "Could not save testimonial.");
        return;
      }

      await loadTestimonials();
      setSelectedTestimonialId(data.testimonial.id);
      setTestimonialForm(testimonialToFormState(data.testimonial));
      setMessage(
        isEditingTestimonial ? "Testimonial updated." : "Testimonial created.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedTestimonial() {
    if (!selectedTestimonial) return;
    const confirmed = window.confirm(`Delete "${selectedTestimonial.name}"?`);
    if (!confirmed) return;

    const response = await fetch(
      `/api/testimonials/${selectedTestimonial.id}`,
      { method: "DELETE" },
    );

    if (!response.ok) {
      setMessage("Could not delete testimonial.");
      return;
    }

    await loadTestimonials();
    startNewTestimonial();
    setMessage("Testimonial deleted.");
  }

  async function saveTripGeneratorOptions() {
    setIsSaving(true);
    setMessage("");

    try {
      const options = JSON.parse(
        tripGeneratorOptionsJson,
      ) as TripGeneratorOptions;
      const response = await fetch("/api/trip-generator-options", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });
      const data = (await response.json()) as { options: TripGeneratorOptions };

      setTripGeneratorOptions(data.options);
      setTripGeneratorOptionsJson(JSON.stringify(data.options, null, 2));
      setMessage("Trip generator options updated.");
    } catch {
      setMessage("Trip generator options JSON is invalid.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveTripDetailContent() {
    setIsSaving(true);
    setMessage("");

    try {
      const content = JSON.parse(tripDetailContentJson) as TripDetailContent;
      const response = await fetch("/api/trip-detail-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json()) as { content: TripDetailContent };

      setTripDetailContent(data.content);
      setTripDetailContentJson(JSON.stringify(data.content, null, 2));
      setMessage("Trip detail content updated.");
    } catch {
      setMessage("Trip detail content JSON is invalid.");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateBookingStatus(id: string, updates: Partial<Booking>) {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      await loadOperations();
      setMessage("Booking updated.");
    }
  }

  async function deleteBookingRecord(id: string) {
    const confirmed = window.confirm(`Delete booking ${id}?`);
    if (!confirmed) return;

    const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });

    if (response.ok) {
      await loadOperations();
      setMessage("Booking deleted.");
    }
  }

  async function updateLeadStatus(id: string, status: LeadStatus) {
    const response = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      await loadOperations();
      setMessage("Lead updated.");
    }
  }

  async function deleteLeadRecord(id: string) {
    const confirmed = window.confirm(`Delete lead ${id}?`);
    if (!confirmed) return;

    const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });

    if (response.ok) {
      await loadOperations();
      setMessage("Lead deleted.");
    }
  }

  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold">Checking access</h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
        <form
          onSubmit={loginAdmin}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-bold text-stone-950">
            Sign in to manage content
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Use the password from{" "}
            <span className="font-semibold text-stone-700">ADMIN_PASSWORD</span>
            . Local fallback is{" "}
            <span className="font-semibold text-stone-700">admin123</span>.
          </p>
          <div className="mt-6">
            <Field label="Password">
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                className="admin-input"
                autoComplete="current-password"
                autoFocus
              />
            </Field>
          </div>
          {message && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  if (showWelcome) {
    return (
      <main className="flex min-h-screen items-center justify-center overflow-hidden bg-stone-950 px-4">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.08, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative text-center text-white"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.4 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-amber-200 ring-1 ring-white/15"
          >
            <Sparkles size={28} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="text-4xl font-bold md:text-6xl"
          >
            Welcome, Mustapha
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200"
          >
            Dashboard ready
          </motion.p>
          <motion.button
            type="button"
            onClick={() => setShowWelcome(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-100"
          >
            Continue
          </motion.button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div
        className={`grid min-h-screen transition-[grid-template-columns] duration-300 ease-out ${isSidebarCollapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[280px_1fr]"}`}
      >
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`relative border-b border-stone-200 bg-stone-950 px-4 py-6 text-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r ${
            isSidebarCollapsed ? "lg:px-4" : "lg:px-5"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className={`absolute top-5 hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20 lg:inline-flex ${
              isSidebarCollapsed ? "left-1/2 -translate-x-1/2" : "right-4"
            }`}
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
          <div className={`flex items-start flex-col w-full ${isSidebarCollapsed ? "justify-center" : ""}`}>
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white ${
                isSidebarCollapsed
                  ? "lg:mt-14 lg:h-10 lg:w-10 lg:justify-center lg:rounded-2xl lg:bg-white/5"
                  : "lg:pr-12"
              }`}
              title="Back to site"
            >
              <ArrowLeft size={18} />
              <span className={isSidebarCollapsed ? "lg:hidden" : ""}>
                Back to site
              </span>
            </Link>
            <button
              type="button"
              onClick={logoutAdmin}
              className={`mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white ${
                isSidebarCollapsed
                  ? "lg:h-10 lg:w-10 lg:justify-center lg:px-0"
                  : ""
              }`}
              title="Sign out"
            >
              <X size={16} />
              <span className={isSidebarCollapsed ? "lg:hidden" : ""}>
                Sign out
              </span>
            </button>
          </div>

          {/* <div className={`mt-8 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Control Panel</p>
            <p className="mt-3 text-sm text-stone-300">Manage content, monitor inventory, and update the local database.</p>
          </div> */}

          <nav
            className={`grid gap-2 ${isSidebarCollapsed ? "mt-8 lg:mt-10" : "mt-8"}`}
          >
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "trips", label: "Trips", icon: Sparkles },
              { id: "destinations", label: "Destinations", icon: Globe },
              { id: "experiences", label: "Experiences", icon: MapPin },
              { id: "blog", label: "Blog", icon: FileText },
              {
                id: "testimonials",
                label: "Testimonials",
                icon: MessageCircle,
              },
              { id: "site-content", label: "Site Content", icon: Settings },
              { id: "bookings", label: "Bookings", icon: Users },
              { id: "leads", label: "Leads", icon: MessageCircle },
              { id: "content", label: "Content", icon: FileText },
              { id: "database", label: "Database", icon: Database },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  whileHover={isSidebarCollapsed ? { scale: 1.06 } : { x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isSidebarCollapsed
                      ? "lg:h-12 lg:justify-center lg:px-0"
                      : ""
                  } ${
                    activeSection === item.id
                      ? "bg-white text-stone-950"
                      : "text-stone-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </nav>

          <div
            className={`mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 ${isSidebarCollapsed ? "lg:px-3" : ""}`}
          >
            <p
              className={`text-sm font-semibold ${isSidebarCollapsed ? "lg:text-center lg:text-xs" : ""}`}
            >
              Database
            </p>
            <p
              className={`mt-2 text-xs text-stone-300 ${isSidebarCollapsed ? "lg:hidden" : ""}`}
            >
              Local JSON storage
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full bg-amber-400"
              />
            </div>
          </div>
        </motion.aside>

        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              className="relative overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-8 text-white shadow-2xl shadow-stone-900/15 sm:px-8 lg:px-10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(217,119,6,0.45),transparent_28%),radial-gradient(circle_at_84%_16%,rgba(14,165,233,0.26),transparent_26%),radial-gradient(circle_at_74%_86%,rgba(5,150,105,0.24),transparent_28%)]" />
              <svg
                className="absolute right-0 top-0 h-full w-2/3 text-white/10"
                viewBox="0 0 760 320"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M-20 240 C 110 70, 250 300, 390 135 S 610 35, 790 210"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="12 16"
                />
              </svg>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-white/15 lg:block"
              />
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-6 right-44 hidden h-14 w-14 rounded-2xl border border-amber-300/30 bg-amber-300/10 lg:block"
              />

              <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200 ring-1 ring-white/15">
                    Admin Dashboard
                  </p>
                  <h2 className="mt-5 text-4xl font-bold tracking-tight text-white lg:text-5xl">
                    {activeSection === "overview" && "Dashboard overview"}
                    {activeSection === "trips" && "Trip management"}
                    {activeSection === "destinations" &&
                      "Destination management"}
                    {activeSection === "experiences" && "Experience management"}
                    {activeSection === "bookings" && "Booking operations"}
                    {activeSection === "leads" && "Lead pipeline"}
                    {activeSection === "content" && "Content control"}
                    {activeSection === "database" && "Database status"}
                    {activeSection === "settings" && "Settings"}
                  </h2>
                  <p className="mt-4 max-w-2xl text-stone-200">
                    Control listings, review content coverage, and keep the
                    travel catalog healthy.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center sm:w-[24rem]">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15"
                  >
                    <p className="text-2xl font-bold">{trips.length}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-300">
                      Trips
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15"
                  >
                    <p className="text-2xl font-bold">{experiences.length}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-300">
                      Experiences
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15"
                  >
                    <p className="text-2xl font-bold">{pendingBookings}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-300">
                      Pending
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={activeSection} {...sectionTransition}>
                {activeSection === "overview" && (
                  <section className="mt-8 space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <StatCard
                        label="Trips"
                        value={trips.length.toString()}
                        detail="Editable database records"
                      />
                      <StatCard
                        label="Avg. rating"
                        value={averageRating}
                        detail={`${totalReviews.toLocaleString()} total reviews`}
                      />
                      <StatCard
                        label="Avg. price"
                        value={`MAD ${averageTripPrice.toLocaleString()}`}
                        detail="Across active trips"
                      />
                      <StatCard
                        label="Content items"
                        value={(
                          destinations.length +
                          experiences.length +
                          blogPosts.length +
                          testimonials.length
                        ).toString()}
                        detail="Destinations, experiences, blog, testimonials"
                      />
                      <StatCard
                        label="Revenue"
                        value={`MAD ${totalRevenue.toLocaleString()}`}
                        detail={`${bookings.length} booking records`}
                      />
                      <StatCard
                        label="Pending bookings"
                        value={pendingBookings.toString()}
                        detail="Need confirmation"
                      />
                      <StatCard
                        label="Open leads"
                        value={openLeads.toString()}
                        detail={`${conversionRate}% lead win rate`}
                      />
                      <StatCard
                        label="Travelers"
                        value={bookings
                          .reduce(
                            (total, booking) => total + booking.travelers,
                            0,
                          )
                          .toString()}
                        detail="Across bookings"
                      />
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                          <BarChart3 size={22} className="text-primary" />
                          <h3 className="text-xl font-bold text-stone-900">
                            Trip category mix
                          </h3>
                        </div>
                        <div className="mt-6 space-y-4">
                          {categoryStats.map((item) => {
                            const percent = trips.length
                              ? Math.round((item.count / trips.length) * 100)
                              : 0;

                            return (
                              <div key={item.category}>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-semibold capitalize text-stone-700">
                                    {item.category}
                                  </span>
                                  <span className="text-stone-500">
                                    {item.count} trips
                                  </span>
                                </div>
                                <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{
                                      duration: 0.55,
                                      ease: "easeOut",
                                    }}
                                    className="h-full rounded-full bg-primary"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-stone-900">
                          Highest value trips
                        </h3>
                        <div className="mt-5 space-y-3">
                          {highestValueTrips.map((trip) => (
                            <button
                              key={trip.id}
                              type="button"
                              onClick={() => startEditingTrip(trip)}
                              className="flex w-full items-center justify-between rounded-2xl border border-stone-200 p-4 text-left transition hover:border-primary/50 hover:bg-stone-50"
                            >
                              <div>
                                <p className="font-semibold text-stone-900">
                                  {trip.title}
                                </p>
                                <p className="mt-1 text-xs text-stone-500">
                                  {trip.duration} days - {trip.category}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-primary">
                                MAD {trip.price.toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="grid gap-8 xl:grid-cols-3">
                      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                          <TrendingUp size={22} className="text-primary" />
                          <h3 className="text-xl font-bold text-stone-900">
                            Content health
                          </h3>
                        </div>
                        <div className="mt-6">
                          <div className="flex items-end gap-3">
                            <span className="text-5xl font-bold text-stone-900">
                              {contentHealth}%
                            </span>
                            <span className="pb-2 text-sm font-semibold text-stone-500">
                              complete
                            </span>
                          </div>
                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${contentHealth}%` }}
                              transition={{ duration: 0.7, ease: "easeOut" }}
                              className="h-full rounded-full bg-green-500"
                            />
                          </div>
                          <p className="mt-4 text-sm text-stone-600">
                            {healthyContentCount} of {contentItemCount} content
                            records passed the required-field check.
                          </p>
                          <div className="mt-5 space-y-3">
                            {contentIssues.length === 0 ? (
                              <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">
                                No missing content detected.
                              </div>
                            ) : (
                              contentIssues.slice(0, 4).map((issue) => (
                                <motion.div
                                  key={issue.id}
                                  whileHover={{ x: 4 }}
                                  className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                                        {issue.type}
                                      </p>
                                      <p className="mt-1 truncate font-semibold text-stone-900">
                                        {issue.title}
                                      </p>
                                      <p className="mt-1 text-sm text-stone-600">
                                        Missing: {issue.missing.join(", ")}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={issue.onAction}
                                      className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
                                    >
                                      {issue.actionLabel}
                                    </button>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>
                          {contentIssues.length > 4 && (
                            <button
                              type="button"
                              onClick={() => setActiveSection("content")}
                              className="mt-4 text-sm font-semibold text-primary hover:underline"
                            >
                              View {contentIssues.length - 4} more content
                              issues
                            </button>
                          )}
                        </div>
                      </section>

                      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-stone-900">
                          Trip range
                        </h3>
                        <div className="mt-5 grid gap-3">
                          <MetricRow
                            label="Shortest"
                            value={
                              shortestTrip
                                ? `${shortestTrip.duration} days`
                                : "None"
                            }
                            detail={shortestTrip?.title ?? "No trips yet"}
                          />
                          <MetricRow
                            label="Longest"
                            value={
                              longestTrip
                                ? `${longestTrip.duration} days`
                                : "None"
                            }
                            detail={longestTrip?.title ?? "No trips yet"}
                          />
                          <MetricRow
                            label="Reviews"
                            value={totalReviews.toLocaleString()}
                            detail="Across all trips"
                          />
                        </div>
                      </section>

                      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-stone-900">
                          Admin activity
                        </h3>
                        <div className="mt-5 space-y-3">
                          <ActivityRow
                            title="Trip database connected"
                            detail="data/trips.json is powering the catalog."
                          />
                          <ActivityRow
                            title="Dashboard sections ready"
                            detail="Overview, Trips, Content, Database, Settings."
                          />
                          <ActivityRow
                            title="Public chrome hidden"
                            detail="Admin runs without the site top menu."
                          />
                        </div>
                      </section>
                    </div>
                  </section>
                )}

                {activeSection === "content" && (
                  <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    <ContentCard
                      title="Destinations"
                      count={destinations.length}
                      status="Database catalog"
                      detail="Destination records are powered by data/destinations.json and API routes."
                    />
                    <ContentCard
                      title="Experiences"
                      count={experiences.length}
                      status="Editable database"
                      detail="Experience records are powered by data/experiences.json and API routes."
                    />
                    <ContentCard
                      title="Blog posts"
                      count={blogPosts.length}
                      status="Editable database"
                      detail="Blog entries are powered by data/blog-posts.json and API routes."
                    />
                    <ContentCard
                      title="Testimonials"
                      count={testimonials.length}
                      status="Editable database"
                      detail="Home testimonials are powered by data/testimonials.json."
                    />
                    <ContentCard
                      title="Trip generator"
                      count={
                        tripGeneratorOptions.travelStyles.length +
                        tripGeneratorOptions.destinations.length
                      }
                      status="Dynamic options"
                      detail="Travel styles and suggested destinations are editable JSON records."
                    />
                    <ContentCard
                      title="Trip detail content"
                      count={
                        tripDetailContent.faqs.length +
                        tripDetailContent.reviews.length
                      }
                      status="Dynamic options"
                      detail="Trip page FAQs and review cards are editable JSON records."
                    />
                  </section>
                )}

                {activeSection === "blog" && (
                  <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                    <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between px-2 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-stone-900">
                            Blog posts
                          </h2>
                          <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                            {blogPosts.length} total
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={startNewBlogPost}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                          aria-label="Add blog post"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {blogPosts.map((post) => (
                          <button
                            key={post.slug}
                            type="button"
                            onClick={() => startEditingBlogPost(post)}
                            className={`w-full rounded-2xl border p-3 text-left transition ${
                              selectedBlogSlug === post.slug
                                ? "border-primary bg-amber-50"
                                : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="min-w-0 truncate font-semibold text-stone-900">
                                {post.title}
                              </p>
                              <StatusBadge
                                status={post.status ?? "published"}
                              />
                            </div>
                            <p className="mt-1 text-xs text-stone-500">
                              {post.category} - {post.date}
                            </p>
                          </button>
                        ))}
                      </div>
                    </aside>

                    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-stone-900">
                            {isEditingBlogPost
                              ? "Edit blog post"
                              : "Add blog post"}
                          </h2>
                          <p className="mt-1 text-sm text-stone-500">
                            {isEditingBlogPost
                              ? selectedBlogPost?.slug
                              : "Create a new blog record"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {selectedBlogPostHref && (
                            <Link
                              href={selectedBlogPostHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-primary hover:text-primary"
                            >
                              <Globe size={16} />
                              See post
                            </Link>
                          )}
                          {isEditingBlogPost && (
                            <button
                              type="button"
                              onClick={deleteSelectedBlogPost}
                              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={saveBlogPost}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isEditingBlogPost ? (
                              <Edit3 size={16} />
                            ) : (
                              <Save size={16} />
                            )}
                            {isSaving ? "Saving..." : "Save blog post"}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Slug">
                          <input
                            value={blogPostForm.slug}
                            onChange={(event) =>
                              updateBlogPostField("slug", event.target.value)
                            }
                            disabled={isEditingBlogPost}
                            className="admin-input disabled:bg-stone-100 disabled:text-stone-400"
                          />
                        </Field>
                        <Field label="Title">
                          <input
                            value={blogPostForm.title}
                            onChange={(event) =>
                              updateBlogPostField("title", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Category">
                          <input
                            value={blogPostForm.category}
                            onChange={(event) =>
                              updateBlogPostField(
                                "category",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Date">
                          <input
                            type="date"
                            value={blogPostForm.date}
                            onChange={(event) =>
                              updateBlogPostField("date", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Read time">
                          <input
                            value={blogPostForm.readTime}
                            onChange={(event) =>
                              updateBlogPostField(
                                "readTime",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Author">
                          <input
                            value={blogPostForm.author}
                            onChange={(event) =>
                              updateBlogPostField("author", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Hero image URL">
                          <input
                            value={blogPostForm.image}
                            onChange={(event) =>
                              updateBlogPostField("image", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Author avatar URL">
                          <input
                            value={blogPostForm.authorAvatar}
                            onChange={(event) =>
                              updateBlogPostField(
                                "authorAvatar",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                      </div>
                      <PublishingSeoPanel
                        status={blogPostForm.status}
                        seoTitle={blogPostForm.seoTitle}
                        seoDescription={blogPostForm.seoDescription}
                        seoImage={blogPostForm.seoImage}
                        onStatusChange={(value) =>
                          updateBlogPostField("status", value)
                        }
                        onSeoTitleChange={(value) =>
                          updateBlogPostField("seoTitle", value)
                        }
                        onSeoDescriptionChange={(value) =>
                          updateBlogPostField("seoDescription", value)
                        }
                        onSeoImageChange={(value) =>
                          updateBlogPostField("seoImage", value)
                        }
                      />
                      <div className="mt-5 grid gap-5">
                        <Field label="Excerpt">
                          <textarea
                            value={blogPostForm.excerpt}
                            onChange={(event) =>
                              updateBlogPostField("excerpt", event.target.value)
                            }
                            className="admin-input min-h-24"
                          />
                        </Field>
                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                          <div className="space-y-5">
                            <Field label="Article content">
                              <div className="mb-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    insertBlogMarkdown(
                                      "## New Section\n\nWrite your section here.",
                                    )
                                  }
                                  className="rounded-2xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-primary hover:text-primary"
                                >
                                  H2
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    insertBlogMarkdown(
                                      "### New Subsection\n\nWrite your subsection here.",
                                    )
                                  }
                                  className="rounded-2xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-primary hover:text-primary"
                                >
                                  H3
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    insertBlogMarkdown(
                                      "- First point\n- Second point\n- Third point",
                                    )
                                  }
                                  className="rounded-2xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-primary hover:text-primary"
                                >
                                  List
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    insertBlogMarkdown(
                                      "> Add a highlighted travel tip here.",
                                    )
                                  }
                                  className="rounded-2xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-primary hover:text-primary"
                                >
                                  Quote
                                </button>
                                <button
                                  type="button"
                                  onClick={generateBlogTableOfContents}
                                  className="rounded-2xl bg-stone-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary"
                                >
                                  Generate TOC
                                </button>
                              </div>
                              <textarea
                                value={blogPostForm.contentMarkdown}
                                onChange={(event) =>
                                  updateBlogPostField(
                                    "contentMarkdown",
                                    event.target.value,
                                  )
                                }
                                className="admin-input min-h-[460px] font-mono text-sm leading-7"
                                placeholder={
                                  "## Best Time to Visit\n\nWrite paragraphs in Markdown.\n\n- Add bullet points\n- Add practical tips"
                                }
                              />
                              <p className="mt-2 text-xs text-stone-500">
                                Write Markdown here. Use ## for main sections;
                                those headings become article anchors.
                              </p>
                            </Field>
                            <Field label="Table of contents, one per line as ID | Label">
                              <textarea
                                value={blogPostForm.tableOfContents}
                                onChange={(event) =>
                                  updateBlogPostField(
                                    "tableOfContents",
                                    event.target.value,
                                  )
                                }
                                className="admin-input min-h-28 font-mono text-xs"
                              />
                            </Field>
                          </div>

                          <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                  Live Preview
                                </p>
                                <h3 className="mt-1 text-lg font-bold text-stone-900">
                                  Article body
                                </h3>
                              </div>
                              <Sparkles size={20} className="text-primary" />
                            </div>
                            <div className="max-h-[560px] overflow-y-auto rounded-3xl border border-stone-200 bg-white p-5">
                              {blogPostPreviewHtml ? (
                                <div
                                  className="blog-content text-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: blogPostPreviewHtml,
                                  }}
                                />
                              ) : (
                                <p className="text-sm text-stone-500">
                                  Start writing to see a preview.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeSection === "testimonials" && (
                  <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                    <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between px-2 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-stone-900">
                            Testimonials
                          </h2>
                          <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                            {testimonials.length} total
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={startNewTestimonial}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                          aria-label="Add testimonial"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {testimonials.map((testimonial) => (
                          <button
                            key={testimonial.id}
                            type="button"
                            onClick={() => startEditingTestimonial(testimonial)}
                            className={`w-full rounded-2xl border p-3 text-left transition ${selectedTestimonialId === testimonial.id ? "border-primary bg-amber-50" : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"}`}
                          >
                            <p className="truncate font-semibold text-stone-900">
                              {testimonial.name}
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              {testimonial.location} - {testimonial.rating}{" "}
                              stars
                            </p>
                          </button>
                        ))}
                      </div>
                    </aside>

                    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-stone-900">
                            {isEditingTestimonial
                              ? "Edit testimonial"
                              : "Add testimonial"}
                          </h2>
                          <p className="mt-1 text-sm text-stone-500">
                            {isEditingTestimonial
                              ? selectedTestimonial?.id
                              : "Create a new testimonial record"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {isEditingTestimonial && (
                            <button
                              type="button"
                              onClick={deleteSelectedTestimonial}
                              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={saveTestimonial}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isEditingTestimonial ? (
                              <Edit3 size={16} />
                            ) : (
                              <Save size={16} />
                            )}
                            {isSaving ? "Saving..." : "Save testimonial"}
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="ID">
                          <input
                            value={testimonialForm.id}
                            onChange={(event) =>
                              updateTestimonialField("id", event.target.value)
                            }
                            disabled={isEditingTestimonial}
                            className="admin-input disabled:bg-stone-100 disabled:text-stone-400"
                          />
                        </Field>
                        <Field label="Name">
                          <input
                            value={testimonialForm.name}
                            onChange={(event) =>
                              updateTestimonialField("name", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Location">
                          <input
                            value={testimonialForm.location}
                            onChange={(event) =>
                              updateTestimonialField(
                                "location",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Rating">
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonialForm.rating}
                            onChange={(event) =>
                              updateTestimonialField(
                                "rating",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Avatar URL">
                          <input
                            value={testimonialForm.avatar}
                            onChange={(event) =>
                              updateTestimonialField(
                                "avatar",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                      </div>
                      <div className="mt-5">
                        <Field label="Quote">
                          <textarea
                            value={testimonialForm.text}
                            onChange={(event) =>
                              updateTestimonialField("text", event.target.value)
                            }
                            className="admin-input min-h-32"
                          />
                        </Field>
                      </div>
                    </section>
                  </div>
                )}

                {activeSection === "site-content" && (
                  <section className="mt-8 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-stone-900">
                            Trip generator options
                          </h3>
                          <p className="mt-1 text-sm text-stone-500">
                            Edit travel styles and destination chips as JSON.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={saveTripGeneratorOptions}
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          <Save size={16} />
                          Save
                        </button>
                      </div>
                      <textarea
                        value={tripGeneratorOptionsJson}
                        onChange={(event) =>
                          setTripGeneratorOptionsJson(event.target.value)
                        }
                        className="admin-input min-h-[520px] font-mono text-xs"
                      />
                    </div>

                    <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-stone-900">
                            Trip detail content
                          </h3>
                          <p className="mt-1 text-sm text-stone-500">
                            Edit trip page FAQs and review cards as JSON.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={saveTripDetailContent}
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          <Save size={16} />
                          Save
                        </button>
                      </div>
                      <textarea
                        value={tripDetailContentJson}
                        onChange={(event) =>
                          setTripDetailContentJson(event.target.value)
                        }
                        className="admin-input min-h-[520px] font-mono text-xs"
                      />
                    </div>
                  </section>
                )}

                {activeSection === "bookings" && (
                  <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-stone-900">
                          Bookings
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">
                          Update booking and payment status.
                        </p>
                      </div>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                        {bookings.length} records
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {bookings.map((booking) => {
                        const trip = trips.find(
                          (item) => item.id === booking.tripId,
                        );

                        return (
                          <div
                            key={booking.id}
                            className="grid gap-4 rounded-2xl border border-stone-200 p-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_auto] xl:items-center"
                          >
                            <div>
                              <p className="font-bold text-stone-900">
                                {booking.customerName}
                              </p>
                              <p className="mt-1 text-sm text-stone-500">
                                {booking.customerEmail}
                              </p>
                              <p className="mt-2 text-sm text-stone-700">
                                {trip?.title ?? booking.tripId}
                              </p>
                            </div>
                            <div className="text-sm">
                              <p className="font-semibold text-stone-900">
                                {booking.startDate}
                              </p>
                              <p className="mt-1 text-stone-500">
                                {booking.travelers} travelers - MAD{" "}
                                {booking.totalMAD.toLocaleString()}
                              </p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                              <select
                                value={booking.status}
                                onChange={(event) =>
                                  updateBookingStatus(booking.id, {
                                    status: event.target.value as BookingStatus,
                                  })
                                }
                                className="admin-input"
                              >
                                {bookingStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={booking.paymentStatus}
                                onChange={(event) =>
                                  updateBookingStatus(booking.id, {
                                    paymentStatus: event.target
                                      .value as PaymentStatus,
                                  })
                                }
                                className="admin-input"
                              >
                                {paymentStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteBookingRecord(booking.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {activeSection === "leads" && (
                  <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-stone-900">
                          Leads
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">
                          Track inquiry status and sales pipeline.
                        </p>
                      </div>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                        {leads.length} leads
                      </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="rounded-2xl border border-stone-200 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-bold text-stone-900">
                                {lead.name}
                              </p>
                              <p className="mt-1 text-sm text-stone-500">
                                {lead.email}
                              </p>
                            </div>
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-800">
                              {lead.source}
                            </span>
                          </div>
                          <p className="mt-4 text-sm text-stone-700">
                            {lead.interest}
                          </p>
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <select
                              value={lead.status}
                              onChange={(event) =>
                                updateLeadStatus(
                                  lead.id,
                                  event.target.value as LeadStatus,
                                )
                              }
                              className="admin-input"
                            >
                              {leadStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => deleteLeadRecord(lead.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeSection === "database" && (
                  <section className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-stone-900">
                        Storage
                      </h3>
                      <p className="mt-3 text-stone-600">
                        Trips, destinations, and experiences are read from and
                        written to local JSON database files.
                      </p>
                      <div className="mt-6 grid gap-3 text-sm">
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          GET /api/trips active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          POST /api/trips active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          PATCH /api/trips/:id active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          DELETE /api/trips/:id active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          GET /api/destinations active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          POST /api/destinations active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          PATCH /api/destinations/:slug active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          DELETE /api/destinations/:slug active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          GET /api/experiences active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          POST /api/experiences active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          PATCH /api/experiences/:id active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          DELETE /api/experiences/:id active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          GET /api/bookings active
                        </p>
                        <p className="rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-800">
                          GET /api/leads active
                        </p>
                      </div>
                    </div>
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-stone-900">
                        Production note
                      </h3>
                      <p className="mt-3 text-stone-600">
                        This dashboard is wired for local JSON storage. The
                        helper layer can be swapped for Prisma, PostgreSQL, or
                        Supabase while keeping the admin UI and API routes
                        mostly unchanged.
                      </p>
                    </div>
                  </section>
                )}

                {activeSection === "settings" && (
                  <section className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-stone-900">
                        Site controls
                      </h3>
                      <div className="mt-5 grid gap-4">
                        <ToggleRow
                          title="Booking enabled"
                          description="Show booking CTAs on trip pages."
                          enabled
                        />
                        <ToggleRow
                          title="Show savings labels"
                          description="Display early booking savings on cards."
                          enabled
                        />
                        <ToggleRow
                          title="Maintenance banner"
                          description="Reserve space for site-wide alerts."
                        />
                      </div>
                    </div>
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-stone-900">
                        Admin access
                      </h3>
                      <p className="mt-3 text-stone-600">
                        Admin routes now use a signed session cookie. Set{" "}
                        <span className="font-semibold text-stone-900">
                          ADMIN_PASSWORD
                        </span>{" "}
                        and{" "}
                        <span className="font-semibold text-stone-900">
                          ADMIN_SESSION_SECRET
                        </span>{" "}
                        before deploying.
                      </p>
                    </div>
                  </section>
                )}

                {activeSection === "destinations" && (
                  <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                    <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between px-2 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-stone-900">
                            Destinations
                          </h2>
                          <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                            {destinations.length} total
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={startNewDestination}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                          aria-label="Add new destination"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {destinations.map((destination) => (
                          <button
                            key={destination.slug}
                            type="button"
                            onClick={() => startEditingDestination(destination)}
                            className={`w-full rounded-2xl border p-3 text-left transition ${
                              selectedDestinationSlug === destination.slug
                                ? "border-primary bg-amber-50"
                                : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex gap-3">
                              <img
                                src={destination.image}
                                alt={destination.name}
                                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="min-w-0 truncate font-semibold text-stone-900">
                                    {destination.name}
                                  </p>
                                  <StatusBadge
                                    status={destination.status ?? "published"}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-stone-500">
                                  {destination.bestTime || "No best time set"}
                                </p>
                                <p className="mt-2 text-sm font-bold text-primary">
                                  {destination.rating} rating
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </aside>

                    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-stone-900">
                            {isEditingDestination
                              ? "Edit destination"
                              : "Add destination"}
                          </h2>
                          <p className="mt-1 text-sm text-stone-500">
                            {isEditingDestination
                              ? selectedDestination?.slug
                              : "Create a new destination record"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {isEditingDestination && (
                            <button
                              type="button"
                              onClick={deleteSelectedDestination}
                              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={saveDestination}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isEditingDestination ? (
                              <Edit3 size={16} />
                            ) : (
                              <Save size={16} />
                            )}
                            {isSaving ? "Saving..." : "Save destination"}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Destination slug">
                          <input
                            value={destinationForm.slug}
                            onChange={(event) =>
                              updateDestinationField("slug", event.target.value)
                            }
                            disabled={isEditingDestination}
                            className="admin-input disabled:bg-stone-100 disabled:text-stone-400"
                            placeholder="marrakech"
                          />
                        </Field>
                        <Field label="Name">
                          <input
                            value={destinationForm.name}
                            onChange={(event) =>
                              updateDestinationField("name", event.target.value)
                            }
                            className="admin-input"
                            placeholder="Marrakech"
                          />
                        </Field>
                        <Field label="French name">
                          <input
                            value={destinationForm.nameFr}
                            onChange={(event) =>
                              updateDestinationField(
                                "nameFr",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Arabic name">
                          <input
                            value={destinationForm.nameAr}
                            onChange={(event) =>
                              updateDestinationField(
                                "nameAr",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Hero image URL">
                          <input
                            value={destinationForm.image}
                            onChange={(event) =>
                              updateDestinationField(
                                "image",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                            placeholder="https://..."
                          />
                        </Field>
                        <Field label="Best time to visit">
                          <input
                            value={destinationForm.bestTime}
                            onChange={(event) =>
                              updateDestinationField(
                                "bestTime",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                            placeholder="March to May, September to November"
                          />
                        </Field>
                        <Field label="Rating">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={destinationForm.rating}
                            onChange={(event) =>
                              updateDestinationField(
                                "rating",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Reviews">
                          <input
                            type="number"
                            min="0"
                            value={destinationForm.reviews}
                            onChange={(event) =>
                              updateDestinationField(
                                "reviews",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                      </div>
                      <PublishingSeoPanel
                        status={destinationForm.status}
                        seoTitle={destinationForm.seoTitle}
                        seoDescription={destinationForm.seoDescription}
                        seoImage={destinationForm.seoImage}
                        onStatusChange={(value) =>
                          updateDestinationField("status", value)
                        }
                        onSeoTitleChange={(value) =>
                          updateDestinationField("seoTitle", value)
                        }
                        onSeoDescriptionChange={(value) =>
                          updateDestinationField("seoDescription", value)
                        }
                        onSeoImageChange={(value) =>
                          updateDestinationField("seoImage", value)
                        }
                      />

                      <div className="mt-5 grid gap-5">
                        <Field label="Description">
                          <textarea
                            value={destinationForm.description}
                            onChange={(event) =>
                              updateDestinationField(
                                "description",
                                event.target.value,
                              )
                            }
                            className="admin-input min-h-28"
                          />
                        </Field>
                        <Field label="Gallery images, one URL per line">
                          <textarea
                            value={destinationForm.images}
                            onChange={(event) =>
                              updateDestinationField(
                                "images",
                                event.target.value,
                              )
                            }
                            className="admin-input min-h-28"
                          />
                        </Field>
                        <Field label="Highlights, one per line">
                          <textarea
                            value={destinationForm.highlights}
                            onChange={(event) =>
                              updateDestinationField(
                                "highlights",
                                event.target.value,
                              )
                            }
                            className="admin-input min-h-24"
                          />
                        </Field>
                        <Field label="Experiences, one per line">
                          <textarea
                            value={destinationForm.experiences}
                            onChange={(event) =>
                              updateDestinationField(
                                "experiences",
                                event.target.value,
                              )
                            }
                            className="admin-input min-h-24"
                          />
                        </Field>
                        <Field label="Itineraries, one per line as Days | Title | Price MAD">
                          <textarea
                            value={destinationForm.itineraries}
                            onChange={(event) =>
                              updateDestinationField(
                                "itineraries",
                                event.target.value,
                              )
                            }
                            className="admin-input min-h-28"
                          />
                        </Field>
                      </div>

                      <div className="mt-8 border-t border-stone-200 pt-6">
                        <h3 className="text-xl font-bold text-stone-900">
                          Destination detail content
                        </h3>
                        <div className="mt-5 grid gap-5">
                          <Field label="Intro">
                            <textarea
                              value={destinationForm.detailIntro}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailIntro",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-28"
                            />
                          </Field>
                          <Field label="Best for, one per line">
                            <textarea
                              value={destinationForm.detailBestFor}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailBestFor",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-24"
                            />
                          </Field>
                          <Field label="Key areas, one per line as Title | Description">
                            <textarea
                              value={destinationForm.detailAreas}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailAreas",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-28"
                            />
                          </Field>
                          <Field label="Food to taste, one per line">
                            <textarea
                              value={destinationForm.detailFood}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailFood",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-24"
                            />
                          </Field>
                          <Field label="Local tips, one per line">
                            <textarea
                              value={destinationForm.detailLocalTips}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailLocalTips",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-24"
                            />
                          </Field>
                          <Field label="Getting around">
                            <textarea
                              value={destinationForm.detailGettingAround}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailGettingAround",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-24"
                            />
                          </Field>
                          <Field label="Where to stay">
                            <textarea
                              value={destinationForm.detailWhereToStay}
                              onChange={(event) =>
                                updateDestinationField(
                                  "detailWhereToStay",
                                  event.target.value,
                                )
                              }
                              className="admin-input min-h-24"
                            />
                          </Field>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeSection === "experiences" && (
                  <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                    <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between px-2 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-stone-900">
                            Experiences
                          </h2>
                          <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                            {experiences.length} total
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={startNewExperience}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                          aria-label="Add new experience"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {experiences.map((experience) => (
                          <button
                            key={experience.id}
                            type="button"
                            onClick={() => startEditingExperience(experience)}
                            className={`w-full rounded-2xl border p-3 text-left transition ${
                              selectedExperienceId === experience.id
                                ? "border-primary bg-amber-50"
                                : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex gap-3">
                              <img
                                src={experience.image}
                                alt={experience.title}
                                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="min-w-0 truncate font-semibold text-stone-900">
                                    {experience.title}
                                  </p>
                                  <StatusBadge
                                    status={experience.status ?? "published"}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-stone-500">
                                  {experience.location} - {experience.category}
                                </p>
                                <p className="mt-2 text-sm font-bold text-primary">
                                  MAD {experience.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </aside>

                    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-stone-900">
                            {isEditingExperience
                              ? "Edit experience"
                              : "Add experience"}
                          </h2>
                          <p className="mt-1 text-sm text-stone-500">
                            {isEditingExperience
                              ? selectedExperience?.id
                              : "Create a new experience record"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {isEditingExperience && (
                            <button
                              type="button"
                              onClick={deleteSelectedExperience}
                              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={saveExperience}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isEditingExperience ? (
                              <Edit3 size={16} />
                            ) : (
                              <Save size={16} />
                            )}
                            {isSaving ? "Saving..." : "Save experience"}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Experience ID">
                          <input
                            value={experienceForm.id}
                            onChange={(event) =>
                              updateExperienceField("id", event.target.value)
                            }
                            disabled={isEditingExperience}
                            className="admin-input disabled:bg-stone-100 disabled:text-stone-400"
                            placeholder="cooking-class"
                          />
                        </Field>
                        <Field label="Title">
                          <input
                            value={experienceForm.title}
                            onChange={(event) =>
                              updateExperienceField("title", event.target.value)
                            }
                            className="admin-input"
                            placeholder="Moroccan Cooking Class"
                          />
                        </Field>
                        <Field label="Category">
                          <select
                            value={experienceForm.category}
                            onChange={(event) =>
                              updateExperienceField(
                                "category",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          >
                            {experienceCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Location">
                          <input
                            value={experienceForm.location}
                            onChange={(event) =>
                              updateExperienceField(
                                "location",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                            placeholder="Marrakech"
                          />
                        </Field>
                        <Field label="Duration">
                          <input
                            value={experienceForm.duration}
                            onChange={(event) =>
                              updateExperienceField(
                                "duration",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                            placeholder="3 hours"
                          />
                        </Field>
                        <Field label="Price MAD">
                          <input
                            type="number"
                            min="0"
                            value={experienceForm.price}
                            onChange={(event) =>
                              updateExperienceField("price", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Rating">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={experienceForm.rating}
                            onChange={(event) =>
                              updateExperienceField(
                                "rating",
                                event.target.value,
                              )
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Hero image URL">
                          <input
                            value={experienceForm.image}
                            onChange={(event) =>
                              updateExperienceField("image", event.target.value)
                            }
                            className="admin-input"
                            placeholder="https://..."
                          />
                        </Field>
                      </div>
                      <PublishingSeoPanel
                        status={experienceForm.status}
                        seoTitle={experienceForm.seoTitle}
                        seoDescription={experienceForm.seoDescription}
                        seoImage={experienceForm.seoImage}
                        onStatusChange={(value) =>
                          updateExperienceField("status", value)
                        }
                        onSeoTitleChange={(value) =>
                          updateExperienceField("seoTitle", value)
                        }
                        onSeoDescriptionChange={(value) =>
                          updateExperienceField("seoDescription", value)
                        }
                        onSeoImageChange={(value) =>
                          updateExperienceField("seoImage", value)
                        }
                      />

                      <div className="mt-5">
                        <Field label="Description">
                          <textarea
                            value={experienceForm.description}
                            onChange={(event) =>
                              updateExperienceField(
                                "description",
                                event.target.value,
                              )
                            }
                            className="admin-input min-h-32"
                          />
                        </Field>
                      </div>
                    </section>
                  </div>
                )}

                {activeSection === "trips" && (
                  <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
                    <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between px-2 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-stone-900">
                            Trips
                          </h2>
                          <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                            {trips.length} total
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={startNewTrip}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white transition hover:bg-primary"
                          aria-label="Add new trip"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {trips.map((trip) => (
                          <button
                            key={trip.id}
                            type="button"
                            onClick={() => startEditingTrip(trip)}
                            className={`w-full rounded-2xl border p-3 text-left transition ${
                              selectedTripId === trip.id
                                ? "border-primary bg-amber-50"
                                : "border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex gap-3">
                              <img
                                src={trip.image}
                                alt={trip.title}
                                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="min-w-0 truncate font-semibold text-stone-900">
                                    {trip.title}
                                  </p>
                                  <StatusBadge
                                    status={trip.status ?? "published"}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-stone-500">
                                  {trip.duration} days - {trip.category}
                                </p>
                                <p className="mt-2 text-sm font-bold text-primary">
                                  MAD {trip.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </aside>

                    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-lg lg:p-8">
                      <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-stone-900">
                            {isEditing ? "Edit trip" : "Add trip"}
                          </h2>
                          <p className="mt-1 text-sm text-stone-500">
                            {isEditing
                              ? selectedTrip?.id
                              : "Create a new trip record"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {isEditing && (
                            <button
                              type="button"
                              onClick={deleteSelectedTrip}
                              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={saveTrip}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isEditing ? (
                              <Edit3 size={16} />
                            ) : (
                              <Save size={16} />
                            )}
                            {isSaving ? "Saving..." : "Save trip"}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Trip ID">
                          <input
                            value={form.id}
                            onChange={(event) =>
                              updateField("id", event.target.value)
                            }
                            disabled={isEditing}
                            className="admin-input disabled:bg-stone-100 disabled:text-stone-400"
                            placeholder="desert-3day"
                          />
                        </Field>
                        <Field label="Title">
                          <input
                            value={form.title}
                            onChange={(event) =>
                              updateField("title", event.target.value)
                            }
                            className="admin-input"
                            placeholder="3-Day Sahara Desert Adventure"
                          />
                        </Field>
                        <Field label="Category">
                          <select
                            value={form.category}
                            onChange={(event) =>
                              updateField(
                                "category",
                                event.target.value as Trip["category"],
                              )
                            }
                            className="admin-input"
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Hero image URL">
                          <input
                            value={form.image}
                            onChange={(event) =>
                              updateField("image", event.target.value)
                            }
                            className="admin-input"
                            placeholder="https://..."
                          />
                        </Field>
                        <Field label="Duration days">
                          <input
                            type="number"
                            min="1"
                            value={form.duration}
                            onChange={(event) =>
                              updateField("duration", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Price MAD">
                          <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(event) =>
                              updateField("price", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Rating">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={form.rating}
                            onChange={(event) =>
                              updateField("rating", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                        <Field label="Reviews">
                          <input
                            type="number"
                            min="0"
                            value={form.reviews}
                            onChange={(event) =>
                              updateField("reviews", event.target.value)
                            }
                            className="admin-input"
                          />
                        </Field>
                      </div>
                      <PublishingSeoPanel
                        status={form.status}
                        seoTitle={form.seoTitle}
                        seoDescription={form.seoDescription}
                        seoImage={form.seoImage}
                        onStatusChange={(value) => updateField("status", value)}
                        onSeoTitleChange={(value) =>
                          updateField("seoTitle", value)
                        }
                        onSeoDescriptionChange={(value) =>
                          updateField("seoDescription", value)
                        }
                        onSeoImageChange={(value) =>
                          updateField("seoImage", value)
                        }
                      />

                      <div className="mt-5 grid gap-5">
                        <Field label="Description">
                          <textarea
                            value={form.description}
                            onChange={(event) =>
                              updateField("description", event.target.value)
                            }
                            className="admin-input min-h-28"
                          />
                        </Field>
                        <Field label="Gallery images, one URL per line">
                          <textarea
                            value={form.images}
                            onChange={(event) =>
                              updateField("images", event.target.value)
                            }
                            className="admin-input min-h-28"
                          />
                        </Field>
                        <Field label="Locations, one per line">
                          <textarea
                            value={form.locations}
                            onChange={(event) =>
                              updateField("locations", event.target.value)
                            }
                            className="admin-input min-h-24"
                          />
                        </Field>
                        <Field label="Itinerary, one day per line as Title | Description">
                          <textarea
                            value={form.itinerary}
                            onChange={(event) =>
                              updateField("itinerary", event.target.value)
                            }
                            className="admin-input min-h-36"
                          />
                        </Field>
                        <Field label="Highlights, one per line">
                          <textarea
                            value={form.highlights}
                            onChange={(event) =>
                              updateField("highlights", event.target.value)
                            }
                            className="admin-input min-h-24"
                          />
                        </Field>
                        <Field label="Includes, one per line">
                          <textarea
                            value={form.includes}
                            onChange={(event) =>
                              updateField("includes", event.target.value)
                            }
                            className="admin-input min-h-24"
                          />
                        </Field>
                      </div>
                    </section>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg"
    >
      <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-stone-900">{value}</p>
      <p className="mt-2 text-sm text-stone-500">{detail}</p>
    </motion.div>
  );
}

function ContentCard({
  title,
  count,
  status,
  detail,
}: {
  title: string;
  count: number;
  status: string;
  detail: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>
          <p className="mt-2 text-sm text-stone-500">{status}</p>
        </div>
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="rounded-2xl bg-amber-50 px-4 py-2 text-xl font-bold text-primary"
        >
          {count}
        </motion.span>
      </div>
      <p className="mt-5 text-sm text-stone-600">{detail}</p>
    </motion.div>
  );
}

function MetricRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl border border-stone-200 p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-stone-500">{label}</span>
        <span className="font-bold text-stone-900">{value}</span>
      </div>
      <p className="mt-2 truncate text-sm text-stone-600">{detail}</p>
    </motion.div>
  );
}

function ActivityRow({ title, detail }: { title: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl bg-stone-50 p-4"
    >
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="mt-1 text-sm text-stone-500">{detail}</p>
    </motion.div>
  );
}

function ToggleRow({
  title,
  description,
  enabled = false,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 p-4">
      <div>
        <p className="font-semibold text-stone-900">{title}</p>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
      <span
        className={`h-7 w-12 rounded-full p-1 ${enabled ? "bg-primary" : "bg-stone-200"}`}
      >
        <motion.span
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="block h-5 w-5 rounded-full bg-white"
        />
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const isDraft = status === "draft";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        isDraft ? "bg-stone-200 text-stone-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isDraft ? "Draft" : "Published"}
    </span>
  );
}

function PublishingSeoPanel({
  status,
  seoTitle,
  seoDescription,
  seoImage,
  onStatusChange,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoImageChange,
}: {
  status: ContentStatus;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  onStatusChange: (value: ContentStatus) => void;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoImageChange: (value: string) => void;
}) {
  return (
    <div className="mt-5 rounded-[2rem] border border-stone-200 bg-stone-50 p-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Publishing status">
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as ContentStatus)
            }
            className="admin-input bg-white"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
        <Field label="SEO title">
          <input
            value={seoTitle}
            onChange={(event) => onSeoTitleChange(event.target.value)}
            className="admin-input bg-white"
            placeholder="Leave blank to use the page title"
          />
        </Field>
      </div>
      <div className="mt-5 grid gap-5">
        <Field label="SEO description">
          <textarea
            value={seoDescription}
            onChange={(event) => onSeoDescriptionChange(event.target.value)}
            className="admin-input min-h-24 bg-white"
            placeholder="Leave blank to use the page description or excerpt"
          />
        </Field>
        <Field label="Open Graph image URL">
          <input
            value={seoImage}
            onChange={(event) => onSeoImageChange(event.target.value)}
            className="admin-input bg-white"
            placeholder="Leave blank to use the hero image"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">
        {label}
      </span>
      {children}
    </label>
  );
}
