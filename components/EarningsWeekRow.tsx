import type { EarningsEvent, StockQuote } from '@/types/earnings'
import { getWeekDays } from '@/lib/parseEarnings'
import EarningsDayColumn from './EarningsDayColumn'

const ZH_WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']

interface EarningsWeekRowProps {
  mondayIso: string
  dayMap: Map<string, EarningsEvent[]>
  todayIso: string
  quotes: Record<string, StockQuote>
  onPrevWeek: () => void
  onNextWeek: () => void
}

export default function EarningsWeekRow({
  mondayIso,
  dayMap,
  todayIso,
  quotes,
  onPrevWeek,
  onNextWeek,
}: EarningsWeekRowProps) {
  const days = getWeekDays(mondayIso)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      {/* Header row: prev arrow + 5 day headers + next arrow */}
      <div className="flex items-stretch bg-white border-b border-gray-200">
        <button
          onClick={onPrevWeek}
          aria-label="上週"
          className="w-10 flex items-center justify-center text-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
        >
          ‹
        </button>

        <div className="flex-1 grid grid-cols-5 divide-x divide-gray-100">
          {days.map((date) => {
            const dayKey = date.toISOString().slice(0, 10)
            const isToday = dayKey === todayIso
            const dayName = ZH_WEEKDAYS[date.getUTCDay()]
            const dayNum = date.getUTCDate()
            return (
              <div key={dayKey} className="text-center py-3">
                <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                  {dayName}
                </div>
                <div
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-semibold ${
                    isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                  }`}
                >
                  {dayNum}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onNextWeek}
          aria-label="下週"
          className="w-10 flex items-center justify-center text-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
        >
          ›
        </button>
      </div>

      {/* Cards row: full width, 5 columns */}
      <div className="grid grid-cols-5 divide-x divide-gray-200">
        {days.map((date) => {
          const dayKey = date.toISOString().slice(0, 10)
          return (
            <EarningsDayColumn
              key={dayKey}
              date={date}
              events={dayMap.get(dayKey) ?? []}
              isToday={dayKey === todayIso}
              isCurrentMonth={true}
              quotes={quotes}
            />
          )
        })}
      </div>
    </div>
  )
}
