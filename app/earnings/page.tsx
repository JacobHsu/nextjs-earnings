import { fetchEarningsEvents } from '@/lib/polymarket'
import { transformEvent } from '@/lib/parseEarnings'
import EarningsCalendar from '@/components/EarningsCalendar'
import type { EarningsEvent } from '@/types/earnings'

export const revalidate = 60

export default async function EarningsPage() {
  let initialEvents: EarningsEvent[] = []

  try {
    const rawEvents = await fetchEarningsEvents('end_date', true, 100)
    initialEvents = rawEvents
      .map(transformEvent)
      .filter((e) => e !== null)
  } catch {
    // Page will show empty state; client can retry via filter
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">財報週</h1>
        <EarningsCalendar initialEvents={initialEvents} />
      </div>
      <footer className="text-center text-sm text-gray-400 py-4">
        數據來源：Polymarket
      </footer>
    </main>
  )
}
