"use client"

import { useState } from "react"
import {
  mockGlobalStats,
  mockTimelineData,
  mockTopFirms,
  mockRatingDistribution,
  mockHeatmapData,
  mockTrendingFirms,
} from "@/lib/mockData"
import type {
  Period,
  GlobalStats,
  TimelineData,
  TopFirm,
  RatingDistribution,
  HeatmapData,
  TrendingFirm,
} from "@/lib/mockData"

import { StatsHeader } from "@/components/stats/StatsHeader"
import { StatsControls } from "@/components/stats/StatsControls"
import { GlobalCounters } from "@/components/stats/GlobalCounters"
import { TimelineChartCard } from "@/components/stats/TimelineChartCard"
import { RatingDistributionChartCard } from "@/components/stats/RatingDistributionChartCard"
import { TopFirmsCard } from "@/components/stats/TopFirmsCard"
import { TrendingFirmsCard } from "@/components/stats/TrendingFirmsCard"
import { DenialsHeatmapCard } from "@/components/stats/DenialsHeatmapCard"

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("30d")
  const [firmFilter, setFirmFilter] = useState("")
  const [globalStats] = useState<GlobalStats>(mockGlobalStats)
  const [timelineData] = useState<TimelineData[]>(mockTimelineData)
  const [topFirms] = useState<TopFirm[]>(mockTopFirms)
  const [ratingDistribution] = useState<RatingDistribution[]>(mockRatingDistribution)
  const [heatmapData] = useState<HeatmapData[]>(mockHeatmapData)
  const [trendingFirms] = useState<TrendingFirm[]>(mockTrendingFirms)

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
          onExport={() => exportToCSV(topFirms, "top-firms")}
        />
        <GlobalCounters stats={globalStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TimelineChartCard data={timelineData} />
          <RatingDistributionChartCard data={ratingDistribution} />
          <TopFirmsCard firms={topFirms} onExport={() => exportToCSV(topFirms, "top-firms")} />
          <TrendingFirmsCard firms={trendingFirms} />
        </div>

        <DenialsHeatmapCard data={heatmapData} />
      </div>
    </div>
  )
}