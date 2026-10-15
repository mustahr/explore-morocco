"use client"

import { useTranslations } from "@/context/useTranslations"
import { contactWhatsAppHref } from "@/lib/contact"
export function BookingWhatsAppCopy({ reference, title, name, email, phone, date, travelers, notes }: { reference: string; title: string; name: string; email: string; phone?: string; date: string; travelers: number; notes?: string }) {
  const { tr } = useTranslations()
  const message = [`${tr("Booking request")} ${reference}`, tr(title), `${tr("Name")} : ${name}`, `${tr("Email")} : ${email}`, `${tr("Phone")} : ${phone || tr("Not provided")}`, `${tr("Date")} : ${date}`, `${tr("Travelers")} : ${travelers}`, notes || ""].filter(Boolean).join("\n")
  return <div className="mt-3"><a href={contactWhatsAppHref(message)} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl bg-[#0F3D2E] px-4 py-3 text-sm font-semibold text-white">{tr("Send a copy on WhatsApp")}</a><p className="mt-2 text-xs">{tr("Your request is saved. To send a WhatsApp copy, open the link and press Send.")}</p></div>
}
