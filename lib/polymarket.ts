import type { RawGammaEvent } from '@/types/earnings'

const GAMMA_BASE = 'https://gamma-api.polymarket.com'

export async function fetchEarningsEvents(
  order: 'end_date' | 'volume' = 'end_date',
  ascending = true,
  limit = 200,
): Promise<RawGammaEvent[]> {
  const params = new URLSearchParams({
    tag_slug: 'earnings',
    closed: 'false',
    limit: String(limit),
    order,
    ascending: String(ascending),
  })

  const res = await fetch(`${GAMMA_BASE}/events?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Gamma API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<RawGammaEvent[]>
}
