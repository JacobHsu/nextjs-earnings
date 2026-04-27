import Image from 'next/image'
import type { EarningsEvent, StockQuote } from '@/types/earnings'

interface EarningsCardProps {
  event: EarningsEvent
  quote?: StockQuote
}

function ProbabilityDot({ probability }: { probability: number }) {
  const color =
    probability >= 70
      ? 'text-emerald-500'
      : probability >= 40
        ? 'text-amber-500'
        : 'text-red-500'
  return <span className={`leading-none ${color}`}>●</span>
}

export default function EarningsCard({ event, quote }: EarningsCardProps) {
  const polymarketUrl = `https://polymarket.com/event/${event.slug}`

  const hasPrice = quote && quote.price > 0
  const positive = hasPrice && quote.changePercent >= 0
  const priceColor = positive ? 'text-emerald-600' : 'text-red-500'
  const sign = positive ? '+' : ''

  return (
    <a
      href={polymarketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
    >
      {/* Logo */}
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

      {/* Info */}
      <div className="min-w-0 flex-1">
        {/* Row 1: ticker + company name */}
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {event.ticker}
          </span>
          {event.companyName && (
            <span className="text-[11px] text-gray-400 leading-tight truncate max-w-20">
              {event.companyName}
            </span>
          )}
        </div>

        {/* Row 2: EPS + probability */}
        <div className="flex items-center gap-1.5 mt-0.5">
          {event.epsEstimate !== null ? (
            <span className="text-[11px] text-gray-500 leading-tight">
              EPS ${event.epsEstimate.toFixed(2)}
            </span>
          ) : (
            <span className="text-[11px] text-gray-400 leading-tight">EPS —</span>
          )}
          <ProbabilityDot probability={event.probability} />
          <span className="text-[11px] font-semibold text-gray-700">{event.probability}%</span>
        </div>
      </div>

      {/* Right: stock price */}
      {hasPrice && (
        <div className={`text-right shrink-0 ml-2 ${priceColor}`}>
          <div className="text-sm font-semibold leading-tight">${quote.price >= 1000 ? Math.round(quote.price) : quote.price.toFixed(2)}</div>
          <div className="text-[11px] opacity-80">{sign}{quote.changePercent.toFixed(2)}%</div>
        </div>
      )}
    </a>
  )
}
