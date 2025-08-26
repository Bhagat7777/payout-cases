"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, TrendingDown, Star, Download, Search, Activity, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"

type Period = "today" | "7d" | "30d" | "all"

interface GlobalStats {
  totalApprovals: number
  totalDenials: number
  approvalRate: number
  avgRating: number
  sparklineData: { date: string; approvals: number; denials: number }[]
}

interface TimelineData {
  date: string
  approvals: number
  denials: number
}

interface TopFirm {
  rank: number
  name: string
  slug: string
  logo_url: string | null
  avg_rating: number
  approvals_30d: number
  denials_30d: number
  approval_rate: number
}

interface RatingDistribution {
  rating: number
  count: number
  percentage: number
}

interface HeatmapData {
  day: string
  hour: number
  count: number
}

interface TrendingFirm {
  name: string
  slug: string
  logo_url: string | null
  growth_7d: number
  approvals_current: number
  approvals_previous: number
}

// Mock data for demonstration
const mockGlobalStats: GlobalStats = {
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

const mockTimelineData: TimelineData[] = [
  { date: "2024-01-08", approvals: 72, denials: 4 },
  { date: "2024-01-09", approvals: 68, denials: 2 },
  { date: "2024-01-10", approvals: 74, denials: 6 },
  { date: "2024-01-11", approvals: 81, denials: 3 },
  { date: "2024-01-12", approvals: 76, denials: 5 },
  { date: "2024-01-13", approvals: 83, denials: 4 },
  { date: "2024-01-14", approvals: 89, denials: 2 },
]

const mockTopFirms: TopFirm[] = [
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

const mockRatingDistribution: RatingDistribution[] = [
  { rating: 1, count: 23, percentage: 3.2 },
  { rating: 2, count: 45, percentage: 6.3 },
  { rating: 3, count: 89, percentage: 12.4 },
  { rating: 4, count: 234, percentage: 32.6 },
  { rating: 5, count: 327, percentage: 45.5 },
]

const mockHeatmapData: HeatmapData[] = [
  // Generate mock heatmap data for days of week vs hours
  ...Array.from({ length: 7 }, (_, dayIndex) =>
    Array.from({ length: 24 }, (_, hourIndex) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex],
      hour: hourIndex,
      count: Math.floor(Math.random() * 10) + 1,
    })),
  ).flat(),
]

const mockTrendingFirms: TrendingFirm[] = [
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

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("30d")
  const [firmFilter, setFirmFilter] = useState("")
  const [globalStats, setGlobalStats] = useState<GlobalStats>(mockGlobalStats)
  const [timelineData, setTimelineData] = useState<TimelineData[]>(mockTimelineData)
  const [topFirms, setTopFirms] = useState<TopFirm[]>(mockTopFirms)
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>(mockRatingDistribution)
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>(mockHeatmapData)
  const [trendingFirms, setTrendingFirms] = useState<TrendingFirm[]>(mockTrendingFirms)

  // Animated counter hook
  const useAnimatedCounter = (end: number, duration = 1000) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return count
  }

  const animatedApprovals = useAnimatedCounter(globalStats.totalApprovals, 1200)
  const animatedDenials = useAnimatedCounter(globalStats.totalDenials, 800)
  const animatedApprovalRate = useAnimatedCounter(globalStats.approvalRate, 1000)

  const exportToCSV = (data: any[], filename: string) => {
    const csv = [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const getHeatmapColor = (count: number) => {
    const intensity = Math.min(count / 10, 1)
    return `rgba(239, 68, 68, ${intensity})`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive insights into prop firm performance and community trends
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Filter by firm..."
                  value={firmFilter}
                  onChange={(e) => setFirmFilter(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200 w-64"
                />
              </div>
              <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => exportToCSV(topFirms, "top-firms")}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </motion.div>

        {/* Global Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Approvals</p>
                  <p className="text-3xl font-bold text-green-600">{animatedApprovals.toLocaleString()}</p>
                </div>
                <div className="w-16 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={globalStats.sparklineData.slice(-7)}>
                      <Line
                        type="monotone"
                        dataKey="approvals"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Denials</p>
                  <p className="text-3xl font-bold text-red-500">{animatedDenials.toLocaleString()}</p>
                </div>
                <div className="w-16 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={globalStats.sparklineData.slice(-7)}>
                      <Line
                        type="monotone"
                        dataKey="denials"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{animatedApprovalRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-yellow-500">{globalStats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Approvals vs Denials Over Time */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Approvals vs Denials Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="approvals"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="denials"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rating Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Rating Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1d4ed8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Firms Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Top Firms (30d)</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(topFirms, "top-firms")}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topFirms.slice(0, 5).map((firm, index) => (
                    <motion.div
                      key={firm.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-gray-500 w-8">#{firm.rank}</div>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                            {firm.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{firm.name}</div>
                          <div className="flex items-center space-x-1">{renderStars(firm.avg_rating)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{firm.approvals_30d}</div>
                          <div className="text-gray-500">Approvals</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-500">{firm.denials_30d}</div>
                          <div className="text-gray-500">Denials</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">{firm.approval_rate.toFixed(1)}%</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trending Firms */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Trending Firms (7d Growth)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingFirms.map((firm, index) => (
                    <motion.div
                      key={firm.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                            {firm.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{firm.name}</div>
                          <div className="text-sm text-gray-500">
                            {firm.approvals_current} → {firm.approvals_previous}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {firm.growth_7d > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${firm.growth_7d > 0 ? "text-green-600" : "text-red-500"}`}>
                          {firm.growth_7d > 0 ? "+" : ""}
                          {firm.growth_7d.toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Denials Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Denials Heatmap (Day × Hour)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-24 gap-1">
                {/* Hour labels */}
                <div className="col-span-24 grid grid-cols-24 gap-1 mb-2">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-xs text-gray-500 text-center">
                      {i}
                    </div>
                  ))}
                </div>
                {/* Heatmap grid */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="col-span-24 grid grid-cols-24 gap-1">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const dataPoint = heatmapData.find((d) => d.day === day && d.hour === hour)
                      const count = dataPoint?.count || 0
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className="aspect-square rounded-sm border border-gray-200"
                          style={{ backgroundColor: getHeatmapColor(count) }}
                          title={`${day} ${hour}:00 - ${count} denials`}
                        />
                      )
                    })}
                  </div>
                ))}
                {/* Day labels */}
                <div className="col-span-24 grid grid-cols-7 gap-1 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-sm text-gray-600 text-center col-span-3">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <span className="text-sm text-gray-500">Less</span>
                <div className="flex space-x-1">
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
                    <div
                      key={intensity}
                      className="w-3 h-3 rounded-sm border border-gray-200"
                      style={{ backgroundColor: `rgba(239, 68, 68, ${intensity})` }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">More</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
