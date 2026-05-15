import { getLeads } from "@/lib/admin-db"

export const dynamic = "force-dynamic"

export async function GET() {
  const leads = await getLeads()
  return Response.json({ leads })
}
