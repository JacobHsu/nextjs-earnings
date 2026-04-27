import type { EarningsEvent, RawGammaEvent } from '@/types/earnings'

export function parseTicker(imageUrl: string, title: string): string {
  const urlMatch = imageUrl.match(/earnings-ticker\/([A-Z0-9.]+)\.png/i)
  if (urlMatch) return urlMatch[1].toUpperCase()

  const titleMatch = title.match(/\(([A-Z]{1,5})\)/)
  if (titleMatch) return titleMatch[1]

  return 'N/A'
}

export function parseCompanyName(title: string): string {
  // "Will General Mills (GIS) beat its quarterly EPS estimate?" → "General Mills"
  const match = title.match(/Will\s+(.+?)\s+(?:\([A-Z]+\)\s+)?beat/i)
  if (match) {
    return match[1].replace(/\s*\([A-Z]+\)\s*$/, '').trim()
  }
  return title
}

export function parseEpsEstimate(description: string): number | null {
  // Match consensus EPS like "$1.57" or "$0.82"
  const match = description.match(/consensus estimate[^$]*\$([0-9]+\.?[0-9]*)/i)
  if (match) return parseFloat(match[1])

  // Fallback: first dollar amount in description
  const fallback = description.match(/\$([0-9]+\.[0-9]+)/)
  if (fallback) return parseFloat(fallback[1])

  return null
}

export function parseIsPreMarket(eventStartTime: string | undefined): boolean {
  if (!eventStartTime) return false
  const date = new Date(eventStartTime)
  // UTC hour < 14 (before 14:00 UTC = before ~10am ET) = pre-market
  return date.getUTCHours() < 14
}

export function transformEvent(raw: RawGammaEvent): EarningsEvent | null {
  if (!raw.markets || raw.markets.length === 0) return null

  const market = raw.markets[0]
  const ticker = parseTicker(raw.image || market.image || '', raw.title)
  const companyName = parseCompanyName(raw.title)
  const epsEstimate = parseEpsEstimate(raw.description || market.description || '')
  const probability = Math.round((market.lastTradePrice ?? 0.5) * 100)
  const earningsDate = new Date(raw.endDate)
  const isPreMarket = parseIsPreMarket(market.eventStartTime)

  return {
    id: raw.id,
    ticker,
    companyName,
    slug: raw.slug,
    logo: raw.image || market.image || '',
    earningsDate,
    epsEstimate,
    probability,
    volume: raw.volume,
    bestBid: market.bestBid ?? 0,
    bestAsk: market.bestAsk ?? 1,
    isPreMarket,
    isActive: market.acceptingOrders,
    isClosed: raw.closed,
  }
}

export function groupEventsByWeek(
  events: EarningsEvent[],
): Map<string, Map<string, EarningsEvent[]>> {
  // Returns Map<weekKey, Map<dayKey (YYYY-MM-DD), events[]>>
  const weeks = new Map<string, Map<string, EarningsEvent[]>>()

  for (const event of events) {
    const date = event.earningsDate
    const dayKey = date.toISOString().slice(0, 10)

    // ISO week: Monday of that week
    const monday = getMondayOf(date)
    const weekKey = monday.toISOString().slice(0, 10)

    if (!weeks.has(weekKey)) weeks.set(weekKey, new Map())
    const week = weeks.get(weekKey)!
    if (!week.has(dayKey)) week.set(dayKey, [])
    week.get(dayKey)!.push(event)
  }

  return weeks
}

export function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function getWeekDays(mondayIso: string): Date[] {
  const monday = new Date(mondayIso + 'T00:00:00Z')
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setUTCDate(d.getUTCDate() + i)
    return d
  })
}

export function formatVolume(volume: number | undefined | null): string {
  if (!volume) return '$0'
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(1)}K`
  return `$${volume.toFixed(0)}`
}

export function getMonthCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(Date.UTC(year, month, 1))
  // Convert so Mon=0, Sun=6
  const startDow = (firstDay.getUTCDay() + 6) % 7

  const lastDay = new Date(Date.UTC(year, month + 1, 0))
  const daysInMonth = lastDay.getUTCDate()

  const total = Math.ceil((startDow + daysInMonth) / 7) * 7

  return Array.from({ length: total }, (_, i) => {
    const d = new Date(firstDay)
    d.setUTCDate(1 - startDow + i)
    return d
  })
}

export function groupEventsByMonth(
  events: EarningsEvent[],
  year: number,
  month: number,
): Map<string, EarningsEvent[]> {
  const dayMap = new Map<string, EarningsEvent[]>()

  for (const event of events) {
    const d = event.earningsDate
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month) continue
    const dayKey = d.toISOString().slice(0, 10)
    if (!dayMap.has(dayKey)) dayMap.set(dayKey, [])
    dayMap.get(dayKey)!.push(event)
  }

  return dayMap
}
