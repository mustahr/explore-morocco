"use client"
import { contactWhatsAppHref } from "@/lib/contact"
export function BookingWhatsAppCopy({ reference, title, name, email, phone, date, travelers, notes }: { reference: string; title: string; name: string; email: string; phone?: string; date: string; travelers: number; notes?: string }) {
  const message = [`Booking request ${reference}`, title, `Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not provided"}`, `Date: ${date}`, `Travelers: ${travelers}`, notes || ""].filter(Boolean).join("\n")
  return <div className="mt-3"><a href={contactWhatsAppHref(message)} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl bg-[#0F3D2E] px-4 py-3 text-sm font-semibold text-white">Send a copy on WhatsApp</a><p className="mt-2 text-xs">Your request is saved. To send a WhatsApp copy, open the link and press Send.</p></div>
}
