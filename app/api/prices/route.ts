import { NextRequest, NextResponse } from 'next/server'

async function fetchSymbol(symbol: string): Promise<[string, { price: number; change: number; changePercent: number; name: string }] | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    if (!meta) return null
    const price: number = meta.regularMarketPrice ?? 0
    const prev: number = meta.chartPreviousClose ?? price
    const change = price - prev
    const changePercent = prev !== 0 ? (change / prev) * 100 : 0
    return [symbol, { price, change, changePercent, name: meta.longName ?? meta.shortName ?? '' }]
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('symbols')
  if (!raw) return NextResponse.json({ error: 'symbols required' }, { status: 400 })

  const symbols = raw.split(',').filter((s) => /^[A-Z]{1,5}$/.test(s))
  if (symbols.length === 0) return NextResponse.json({})

  const results = await Promise.all(symbols.map(fetchSymbol))

  const quotes: Record<string, { price: number; change: number; changePercent: number; name: string }> = {}
  for (const entry of results) {
    if (entry) quotes[entry[0]] = entry[1]
  }

  return NextResponse.json(quotes)
}
