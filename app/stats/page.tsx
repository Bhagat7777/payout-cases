import {
  getGlobalStats,
  getSparklineData,
  getTopFirms,
  getRatingDistribution,
} from "@/lib/queries/stats"
import { mockHeatmapData, mockTrendingFirms } from "@/lib/mockData"
import type {
  Period,
  HeatmapData,
  TrendingFirm,
} from "@/lib/mockData"
import { useState } from "react"

import { StatsHeader } from "@/components/stats/StatsHeader"
import { StatsControls } from "@/components/stats/StatsControls"
import { GlobalCounters } from "@/components/stats/GlobalCounters"
import { TimelineChartCard } from "@/components/stats/TimelineChartCard"
import { RatingDistributionChartCard } from "@/components/stats/RatingDistributionChartCard"
import { TopFirmsCard } from "@/components/stats/TopFirmsCard"
import { TrendingFirmsCard } from "@/components/stats/TrendingFirmsCard"
import { DenialsHeatmapCard } from "@/components/stats/DenialsHeatmapCard"

// Client component wrapper for state management (filters)
function StatsClientWrapper({
  initialGlobalStats,
  initialTimelineData,
  initialTopFirms,
  initialRatingDistribution,
  heatmapData,
  trendingFirms,
}: {
  initialGlobalStats: Awaited<ReturnType<typeof getGlobalStats>> & { sparklineData: Awaited<ReturnType<typeof getSparklineData>> }
  initialTimelineData: Awaited<ReturnType<typeof getSparklineData>>
  initialTopFirms: Awaited<ReturnType<typeof getTopFirms>>
  initialRatingDistribution: Awaited<ReturnType<typeof getRatingDistribution>>
  heatmapData: HeatmapData[]
  trendingFirms: TrendingFirm[]
}) {
  // State for client-side filtering (currently only mock filtering is implemented)
  const [period, setPeriod] = useState<Period>("30d")
  const [firmFilter, setFirmFilter] = useState("")

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <StatsHeader />
        <StatsControls
          period={period}
          onPeriodChange={setPeriod}
          firmFilter={firmFilter}
          onFirmFilterChange={setFirmFilter}
          onExport={() => exportToCSV(initialTopFirms, "top-firms")}
        />
        <GlobalCounters stats={initialGlobalStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TimelineChartCard data={initialTimelineData} />
          <RatingDistributionChartCard data={initialRatingDistribution} />
          <TopFirmsCard firms={initialTopFirms} onExport={() => exportToCSV(initialTopFirms, "top-firms")} />
          <TrendingFirmsCard firms={trendingFirms} />
        </div>

        <DenialsHeatmapCard data={heatmapData} />
      </div>
    </div>
  )
}

export default async function StatsPage() {
  const globalStats = await getGlobalStats()
  const sparklineData = await getSparklineData()
  const topFirms = await getTopFirms(5)
  const ratingDistribution = await getRatingDistribution()

  const statsWithSparkline = {
    ...globalStats,
    sparklineData,
  }

  return (
    <StatsClientWrapper
      initialGlobalStats={statsWithSparkline}
      initialTimelineData={sparklineData}
      initialTopFirms={topFirms}
      initialRatingDistribution={ratingDistribution}
      heatmapData={mockHeatmapData}
      trendingFirms={mockTrendingFirms}
    />
  )
}