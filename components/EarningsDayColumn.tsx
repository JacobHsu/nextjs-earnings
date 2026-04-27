import type { EarningsEvent } from '@/types/earnings'
import EarningsCard from './EarningsCard'

interface EarningsDayColumnProps {
  date: Date
  events: EarningsEvent[]
  isToday: boolean
  isCurrentMonth: boolean
}

export default function EarningsDayColumn({ events }: EarningsDayColumnProps) {
  const preMarket = events.filter((e) => e.isPreMarket)
  const postMarket = events.filter((e) => !e.isPreMarket)

  return (
    <div className="flex flex-col min-h-48 py-2 px-1">
      {/* Pre-market section */}
      {preMarket.length > 0 && (
        <div className="mb-3">
          <div className="text-[11px] font-medium text-gray-400 px-2 mb-1">盤前</div>
          {preMarket.map((event) => (
            <EarningsCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Post-market section */}
      {postMarket.length > 0 && (
        <div>
          <div className="text-[11px] font-medium text-gray-400 px-2 mb-1">盤後</div>
          {postMarket.map((event) => (
            <EarningsCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center text-gray-300 text-xs py-6">—</div>
      )}
    </div>
  )
}
