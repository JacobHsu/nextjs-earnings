import Image from 'next/image'
import type { EarningsEvent } from '@/types/earnings'

interface EarningsCardProps {
  event: EarningsEvent
}

function ProbabilityDot({ probability }: { probability: number }) {
  const color =
    probability >= 70
      ? 'text-emerald-500'
      : probability >= 40
        ? 'text-amber-500'
        : 'text-red-500'
  return <span className={`text-base leading-none ${color}`}>●</span>
}

export default function EarningsCard({ event }: EarningsCardProps) {
  const polymarketUrl = `https://polymarket.com/event/${event.slug}`

  return (
    <a
      href={polymarketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
    >
      {/* Left: logo + ticker + EPS */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {event.logo ? (
            <Image
              src={event.logo}
              alt={event.ticker}
              width={36}
              height={36}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
              {event.ticker.slice(0, 2)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {event.ticker}
          </div>
          {event.epsEstimate !== null ? (
            <div className="text-xs text-gray-500 leading-tight">
              ${event.epsEstimate.toFixed(2)} 每股收益
            </div>
          ) : (
            <div className="text-xs text-gray-400 leading-tight">— 每股收益</div>
          )}
        </div>
      </div>

      {/* Right: probability dot + % + label */}
      <div className="text-right shrink-0 ml-2">
        <div className="flex items-center gap-1 justify-end">
          <ProbabilityDot probability={event.probability} />
          <span className="text-sm font-semibold text-gray-900">{event.probability}%</span>
        </div>
        <div className="text-[11px] text-gray-400">超預期</div>
      </div>
    </a>
  )
}
