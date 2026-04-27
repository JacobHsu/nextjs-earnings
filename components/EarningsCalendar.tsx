'use client'

import { useState, useEffect, useCallback } from 'react'
import type { EarningsEvent, StockQuote } from '@/types/earnings'
import { groupEventsByWeek } from '@/lib/parseEarnings'
import EarningsFilter from './EarningsFilter'
import EarningsWeekRow from './EarningsWeekRow'

interface EarningsCalendarProps {
  initialEvents: EarningsEvent[]
}

const ZH_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function localDateIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function localMondayIso(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return localDateIso(d)
}

function shiftWeek(isoDate: string, weeks: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + weeks * 7)
  return localDateIso(date)
}

export default function EarningsCalendar({ initialEvents }: EarningsCalendarProps) {
  const now = new Date()
  const [events, setEvents] = useState<EarningsEvent[]>(initialEvents)
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({})
  const [volumeActive, setVolumeActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mondayIso, setMondayIso] = useState(() => localMondayIso(now))

  const todayIso = localDateIso(now)

  const loadEvents = useCallback(async (order: 'end_date' | 'volume') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/earnings?order=${order}`)
      if (res.ok) {
        const data: EarningsEvent[] = await res.json()
        setEvents(
          data.map((e) => ({ ...e, earningsDate: new Date(e.earningsDate) })),
        )
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleVolumeToggle = () => {
    const next = !volumeActive
    setVolumeActive(next)
    loadEvents(next ? 'volume' : 'end_date')
  }

  useEffect(() => {
    setEvents(
      initialEvents.map((e) => ({ ...e, earningsDate: new Date(e.earningsDate) })),
    )
  }, [initialEvents])

  useEffect(() => {
    if (events.length === 0) return
    const valid = [...new Set(
      events.map((e) => e.ticker).filter((t) => /^[A-Z]{1,5}$/.test(t))
    )]
    if (valid.length === 0) return

    const batches: string[] = []
    for (let i = 0; i < valid.length; i += 30) {
      batches.push(valid.slice(i, i + 30).join(','))
    }

    Promise.all(
      batches.map((b) =>
        fetch(`/api/prices?symbols=${encodeURIComponent(b)}`)
          .then((r) => r.ok ? r.json() : {})
          .catch(() => ({}))
      )
    ).then((results) => {
      setQuotes(Object.assign({}, ...results))
    })
  }, [events])

  const handlePrevWeek = () => setMondayIso((iso) => shiftWeek(iso, -1))
  const handleNextWeek = () => setMondayIso((iso) => shiftWeek(iso, 1))

  // Month label derived from Monday local date
  const [y, mo] = mondayIso.split('-').map(Number)
  const monthLabel = `${ZH_MONTHS[mo - 1]} ${y}`

  const weeks = groupEventsByWeek(events)
  const dayMap = weeks.get(mondayIso) ?? new Map<string, EarningsEvent[]>()

  return (
    <div>
      <div className="text-center text-sm text-gray-400 mb-2">{monthLabel}</div>

      {/* Filter bar */}
      <div className="mb-6">
        <EarningsFilter volumeActive={volumeActive} onToggle={handleVolumeToggle} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 text-sm py-4 animate-pulse">載入中...</div>
      )}

      {!loading && (
        <>
          <EarningsWeekRow
            mondayIso={mondayIso}
            dayMap={dayMap}
            todayIso={todayIso}
            quotes={quotes}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        </>
      )}
    </div>
  )
}
