import { formatMoroccoDateTime } from "@/lib/record-timestamps"

export function RecordDates({ record }: { record: unknown }) {
  const { createdAt, updatedAt } = (record || {}) as { createdAt?: string; updatedAt?: string }
  const changed = createdAt && updatedAt && new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000
  return <span className="mt-2 block text-xs font-normal leading-5 text-stone-500" title="Dates and times shown in Africa/Casablanca">
    <span className="block">Added: {createdAt ? <time dateTime={createdAt}>{formatMoroccoDateTime(createdAt)} · Morocco</time> : "Not recorded"}</span>
    {changed && <span className="block">Updated: <time dateTime={updatedAt}>{formatMoroccoDateTime(updatedAt)} · Morocco</time></span>}
  </span>
}
