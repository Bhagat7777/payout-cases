export type Period = "today" | "7d" | "30d" | "all"

export interface GlobalStats {
  totalApprovals: number
  totalDenials: number
  approvalRate: number
  avgRating: number
  sparklineData: { date: string; approvals: number; denials: number }[]
}

export interface TimelineData {
  date: string
  approvals: number
  denials: number
}

export interface TopFirm {
  rank: number
  name: string
  slug: string
  logo_url: string | null
  avg_rating: number
  approvals_30d: number
  denials_30d: number
  approval_rate: number
}

export interface RatingDistribution {
  rating: number
  count: number
  percentage: number
}

export interface HeatmapData {
  day: string
  hour: number
  count: number
}

export interface TrendingFirm {
  name: string
  slug: string
  logo_url: string | null
  growth_7d: number
  approvals_current: number
  approvals_previous: number
}

export const mockGlobalStats: GlobalStats = {
  totalApprovals: 1247,
  totalDenials: 89,
  approvalRate: 93.3,
  avgRating: 4.6,
  sparklineData: [
    { date: "2024-01-01", approvals: 45, denials: 3 },
    { date: "2024-01-02", approvals: 52, denials: 2 },
    { date: "2024-01-03", approvals: 48, denials: 4 },
    { date: "2024-01-04", approvals: 61, denials: 1 },
    { date: "2024-01-05", approvals: 55, denials: 5 },
    { date: "2024-01-06", approvals: 67, denials: 2 },
    { date: "2024-01-07", approvals: 59, denials: 3 },
    { date: "2024-01-08", approvals: 72, denials: 4 },
    { date: "2024-01-09", approvals: 68, denials: 2 },
    { date: "2024-01-10", approvals: 74, denials: 6 },
    { date: "2024-01-11", approvals: 81, denials: 3 },
    { date: "2024-01-12", approvals: 76, denials: 5 },
    { date: "2024-01-13", approvals: 83, denials: 4 },
    { date: "2024-01-14", approvals: 89, denials: 2 },
  ],
}

export const mockTimelineData: TimelineData[] = [
  { date: "2024-01-08", approvals: 72, denials: 4 },
  { date: "2024-01-09", approvals: 68, denials: 2 },
  { date: "2024-01-10", approvals: 74, denials: 6 },
  { date: "2024-01-11", approvals: 81, denials: 3 },
  { date: "2024-01-12", approvals: 76, denials: 5 },
  { date: "2024-01-13", approvals: 83, denials: 4 },
  { date: "2024-01-14", approvals: 89, denials: 2 },
]

export const mockTopFirms: TopFirm[] = [
  {
    rank: 1,
    name: "FTMO",
    slug: "ftmo",
    logo_url: "/placeholder.svg?height=32&width=32",
    avg_rating: 4.8,
    approvals_30d: 245,
    denials_30d: 12,
    approval_rate: 95.3,
  },
  {
    rank: 2,
    name: "MyForexFunds",
    slug: "myforexfunds",
    logo_url: "/placeholder.svg?height=32&width=32",
    avg_rating: 4.5,
    approvals_30d: 189,
    denials_30d: 23,
    approval_rate: 89.2,
  },
  {
    rank: 3,
    name: "The5ers",
    slug: "the5ers",
    logo_url: "/placeholder.svg?height=32&width=32",
    avg_rating: 4.6,
    approvals_30d: 167,
    denials_30d: 18,
    approval_rate: 90.3,
  },
  {
    rank: 4,
    name: "TopstepTrader",
    slug: "topsteptrader",
    logo_url: "/placeholder.svg?height=32&width=32",
    avg_rating: 4.2,
    approvals_30d: 134,
    denials_30d: 31,
    approval_rate: 81.2,
  },
  {
    rank: 5,
    name: "Apex Trader Funding",
    slug: "apex-trader-funding",
    logo_url: "/placeholder.svg?height=32&width=32",
    avg_rating: 4.4,
    approvals_30d: 98,
    denials_30d: 15,
    approval_rate: 86.7,
  },
]

export const mockRatingDistribution: RatingDistribution[] = [
  { rating: 1, count: 23, percentage: 3.2 },
  { rating: 2, count: 45, percentage: 6.3 },
  { rating: 3, count: 89, percentage: 12.4 },
  { rating: 4, count: 234, percentage: 32.6 },
  { rating: 5, count: 327, percentage: 45.5 },
]

export const mockHeatmapData: HeatmapData[] = [
  ...Array.from({ length: 7 }, (_, dayIndex) =>
    Array.from({ length: 24 }, (_, hourIndex) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex],
      hour: hourIndex,
      count: Math.floor(Math.random() * 10) + 1,
    })),
  ).flat(),
]

export const mockTrendingFirms: TrendingFirm[] = [
  {
    name: "Funded Next",
    slug: "funded-next",
    logo_url: "/placeholder.svg?height=32&width=32",
    growth_7d: 34.5,
    approvals_current: 87,
    approvals_previous: 65,
  },
  {
    name: "FTMO",
    slug: "ftmo",
    logo_url: "/placeholder.svg?height=32&width=32",
    growth_7d: 18.2,
    approvals_current: 89,
    approvals_previous: 75,
  },
  {
    name: "MyForexFunds",
    slug: "myforexfunds",
    logo_url: "/placeholder.svg?height=32&width=32",
    growth_7d: 12.8,
    approvals_current: 67,
    approvals_previous: 59,
  },
  {
    name: "The5ers",
    slug: "the5ers",
    logo_url: "/placeholder.svg?height=32&width=32",
    growth_7d: -5.2,
    approvals_current: 54,
    approvals_previous: 57,
  },
]