# 用 Yahoo Finance 查股票即時股價

## API 端點

```
GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d
```

範例：

```bash
curl "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=2d" \
  -H "User-Agent: Mozilla/5.0"
```

回應中取 `chart.result[0].meta`：

| 欄位 | 說明 |
|------|------|
| `regularMarketPrice` | 現價 |
| `chartPreviousClose` | 昨收（用來算漲跌幅） |
| `longName` | 公司英文全名 |

---

## Next.js API Route

瀏覽器不能直接呼叫 Yahoo Finance（CORS），需要透過 Next.js API route 代理。

```ts
// app/api/prices/route.ts
import { NextRequest, NextResponse } from 'next/server'

async function fetchSymbol(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null

  const meta = (await res.json())?.chart?.result?.[0]?.meta
  if (!meta) return null

  const price: number = meta.regularMarketPrice ?? 0
  const prev: number = meta.chartPreviousClose ?? price
  const change = price - prev
  const changePercent = prev !== 0 ? (change / prev) * 100 : 0

  return [symbol, { price, change, changePercent, name: meta.longName ?? meta.shortName ?? '' }]
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('symbols')
  if (!raw) return NextResponse.json({ error: 'symbols required' }, { status: 400 })

  const symbols = raw.split(',').filter((s) => /^[A-Z]{1,5}$/.test(s))
  if (symbols.length === 0) return NextResponse.json({})

  const results = await Promise.all(symbols.map(fetchSymbol))

  const quotes: Record<string, unknown> = {}
  for (const entry of results) {
    if (entry) quotes[entry[0] as string] = entry[1]
  }

  return NextResponse.json(quotes)
}
```

呼叫：

```
GET /api/prices?symbols=AAPL,MSFT,NVDA
```

回應：

```json
{
  "AAPL": { "price": 266.56, "change": -6.87, "changePercent": -2.51, "name": "Apple Inc." },
  "MSFT": { "price": 424.04, "change": -0.56, "changePercent": -0.13, "name": "Microsoft Corporation" }
}
```

---

## Client 端使用

```ts
const symbols = tickers
  .filter((t) => /^[A-Z]{1,5}$/.test(t))  // 過濾無效 ticker
  .join(',')

const res = await fetch(`/api/prices?symbols=${encodeURIComponent(symbols)}`)
const quotes = res.ok ? await res.json() : {}
```

---

## 注意

- `User-Agent` header 必填，否則 Yahoo 會拒絕請求
- Ticker 要先過濾，`N/A` 或含特殊字元的會導致該筆查詢失敗
- `revalidate: 60` 讓 Next.js 快取 60 秒，減少對 Yahoo 的請求次數
