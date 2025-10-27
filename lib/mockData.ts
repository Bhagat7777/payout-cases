import { format, subDays } from "date-fns"

export type Period = "today" | "7d" | "30d" | "all"

export interface GlobalStats {
  totalApprovals: number
  totalDenials: number
  approvalRate: number
  avgRating: number
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

// --- Mock Data for components not yet connected to DB (Heatmap, Trending) ---

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