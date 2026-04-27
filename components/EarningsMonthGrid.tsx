import type { EarningsEvent } from '@/types/earnings'
import { getMonthCalendarDays, groupEventsByMonth } from '@/lib/parseEarnings'
import EarningsDayColumn from './EarningsDayColumn'

const ZH_WEEKDAY_HEADERS = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']

interface EarningsMonthGridProps {
  year: number
  month: number // 0-indexed
  events: EarningsEvent[]
  todayIso: string
}

export default function EarningsMonthGrid({
  year,
  month,
  events,
  todayIso,
}: EarningsMonthGridProps) {
  const calendarDays = getMonthCalendarDays(year, month)
  const dayMap = groupEventsByMonth(events, year, month)

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {ZH_WEEKDAY_HEADERS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-400 py-2">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const dayKey = date.toISOString().slice(0, 10)
          const isCurrentMonth = date.getUTCMonth() === month
          return (
            <EarningsDayColumn
              key={dayKey}
              date={date}
              events={dayMap.get(dayKey) ?? []}
              isToday={dayKey === todayIso}
              isCurrentMonth={isCurrentMonth}
              quotes={{}}
            />
          )
        })}
      </div>
    </div>
  )
}
