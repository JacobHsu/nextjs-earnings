import { NextRequest, NextResponse } from 'next/server'
import { fetchEarningsEvents } from '@/lib/polymarket'
import { transformEvent } from '@/lib/parseEarnings'

export const revalidate = 60

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const orderParam = searchParams.get('order') ?? 'end_date'
  const order = orderParam === 'volume' ? 'volume' : 'end_date'

  try {
    const rawEvents = await fetchEarningsEvents(order, true, 100)
    const events = rawEvents
      .map(transformEvent)
      .filter((e) => e !== null)

    return NextResponse.json(events)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
