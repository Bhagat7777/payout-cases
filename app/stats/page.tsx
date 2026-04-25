import { getGlobalStats, getSparklineData, getTopFirms, getRatingDistribution } from "@/lib/queries/stats";
import { StatsHeader } from "@/components/stats/StatsHeader";
import { GlobalCounters } from "@/components/stats/GlobalCounters";
import { TimelineChartCard } from "@/components/stats/TimelineChartCard";
import { RatingDistributionChartCard } from "@/components/stats/RatingDistributionChartCard";
import { TopFirmsCard } from "@/components/stats/TopFirmsCard";
import { TrendingFirmsCard } from "@/components/stats/TrendingFirmsCard";
import { DenialsHeatmapCard } from "@/components/stats/DenialsHeatmapCard";
import { mockHeatmapData, mockTrendingFirms } from "@/lib/mockData";
import { Navbar } from "@/components/home/Navbar";
import { AppWrapper } from "@/components/AppWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

export default async function StatsDashboardPage() {
  const supabase = await createServerClient();

  const [globalStats, sparklineData, topFirms, ratingDistribution] = await Promise.all([
    getGlobalStats(supabase),
    getSparklineData(supabase),
    getTopFirms(supabase, 5),
    getRatingDistribution(supabase),
  ]);

  const statsWithSparkline = {
    ...globalStats,
    sparklineData,
  };

  return (
    <AppWrapper>
      <div className="min-h-screen bg-[#0B0F17]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <StatsHeader />
          
          <div className="mt-12">
            <GlobalCounters stats={statsWithSparkline} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <TimelineChartCard data={sparklineData} />
              <RatingDistributionChartCard data={ratingDistribution} />
              <TopFirmsCard firms={topFirms} onExport={() => {}} />
              <TrendingFirmsCard firms={mockTrendingFirms} />
            </div>

            <DenialsHeatmapCard data={mockHeatmapData} />
          </div>
        </div>
      </div>
    </AppWrapper>
  );
}