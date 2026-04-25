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
import { ArrowLeft, Info } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

export default async function StatsDashboardPage() {
  const supabase = await createServerClient();

  // Fetch data with fallbacks
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
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </MotionDiv>
          
          <StatsHeader />
          
          <div className="space-y-12">
            <GlobalCounters stats={statsWithSparkline} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <TimelineChartCard data={sparklineData} />
                <TopFirmsCard firms={topFirms} onExport={() => {}} />
              </div>
              <div className="space-y-8">
                <RatingDistributionChartCard data={ratingDistribution} />
                <TrendingFirmsCard firms={mockTrendingFirms} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 z-10">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-full p-2 text-blue-400 flex items-center space-x-2 text-xs">
                  <Info className="w-3 h-3" />
                  <span>Data updated every 15 minutes</span>
                </div>
              </div>
              <DenialsHeatmapCard data={mockHeatmapData} />
            </div>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
}

// Helper component for motion div in server component
function MotionDiv({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}