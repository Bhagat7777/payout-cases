"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsHeader } from "@/components/stats/StatsHeader";
import { StatsControls } from "@/components/stats/StatsControls";
import { GlobalCounters } from "@/components/stats/GlobalCounters";
import { TimelineChartCard } from "@/components/stats/TimelineChartCard";
import { RatingDistributionChartCard }
 from "@/components/stats/RatingDistributionChartCard";
import { TopFirmsCard } from "@/components/stats/TopFirmsCard";
import { TrendingFirmsCard } from "@/components/stats/TrendingFirmsCard";
import { DenialsHeatmapCard } from "@/components/stats/DenialsHeatmapCard";
import { mockHeatmapData, mockTrendingFirms, Period, GlobalStats, TimelineData, TopFirm, RatingDistribution } from "@/lib/mockData";
import { getGlobalStats, getSparklineData, getTopFirms, getRatingDistribution } from "@/lib/queries/stats";

interface StatsData {
  globalStats: GlobalStats;
  sparklineData: TimelineData[];
  topFirms: TopFirm[];
  ratingDistribution: RatingDistribution[];
}

export default function StatsDashboardPage() {
  const [timeRange, setTimeRange] = useState<Period>("30d");
  const [firmFilter, setFirmFilter] = useState("");
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const [globalStats, sparklineData, topFirms, ratingDistribution] = await Promise.all([
          getGlobalStats(),
          getSparklineData(),
          getTopFirms(5),
          getRatingDistribution(),
        ]);

        setData({
          globalStats,
          sparklineData,
          topFirms,
          ratingDistribution,
        });
        setError(null);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError("Failed to load statistics data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const statsWithSparkline = useMemo(() => {
    if (!data) return null;
    return {
      ...data.globalStats,
      sparklineData: data.sparklineData,
    };
  }, [data]);

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !statsWithSparkline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <p className="text-red-400 mb-4">{error || "Data not available."}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <StatsHeader />
        <StatsControls
          period={timeRange}
          onPeriodChange={setTimeRange}
          firmFilter={firmFilter}
          onFirmFilterChange={setFirmFilter}
          onExport={handleExport}
        />
        
        <GlobalCounters stats={statsWithSparkline} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TimelineChartCard data={data.sparklineData} />
          <RatingDistributionChartCard data={data.ratingDistribution} />
          <TopFirmsCard firms={data.topFirms} onExport={handleExport} />
          <TrendingFirmsCard firms={mockTrendingFirms} />
        </div>

        <DenialsHeatmapCard data={mockHeatmapData} />
      </div>
    </div>
  );
}