import type { Metadata } from "next"
import { UnsubscribeForm } from "@/components/layout/UnsubscribeForm"

export const metadata: Metadata = { title: "Email preferences", robots: { index: false, follow: false } }
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const params = await searchParams
  return <UnsubscribeForm token={typeof params.token === "string" ? params.token : ""} />
}
