export interface RawGammaMarket {
  id: string
  question: string
  conditionId: string
  slug: string
  endDate: string
  startDate: string
  image: string
  icon: string
  description: string
  outcomes: string[]
  outcomePrices: string[]
  volume: string
  active: boolean
  closed: boolean
  lastTradePrice: number
  bestBid: number
  bestAsk: number
  acceptingOrders: boolean
  eventStartTime?: string
  volume1wk: number
  volume1mo: number
  openInterest?: number
}

export interface RawGammaTag {
  id: string
  label: string
  slug: string
}

export interface RawGammaEvent {
  id: string
  ticker: string
  slug: string
  title: string
  description: string
  resolutionSource: string
  startDate: string
  creationDate: string
  endDate: string
  image: string
  icon: string
  active: boolean
  closed: boolean
  archived: boolean
  volume: number
  openInterest: number
  volume1wk: number
  volume1mo: number
  volume1yr: number
  commentCount: number
  markets: RawGammaMarket[]
  tags: RawGammaTag[]
  closedTime?: string
}

export interface EarningsEvent {
  id: string
  ticker: string
  companyName: string
  slug: string
  logo: string
  earningsDate: Date
  epsEstimate: number | null
  probability: number
  volume: number
  bestBid: number
  bestAsk: number
  isPreMarket: boolean
  isActive: boolean
  isClosed: boolean
}

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  name: string
}

export type SortOrder = 'end_date' | 'volume'
