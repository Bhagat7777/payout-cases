import { SupabaseClient } from "@supabase/supabase-js"
import { format, subDays } from "date-fns"
import type { GlobalStats, TimelineData, TopFirm, RatingDistribution } from "@/lib/mockData"

export async function getGlobalStats(supabase: SupabaseClient): Promise<GlobalStats> {
  const { data: totalStats, error: totalError } = await supabase
    .from("cases")
    .select("type, rating")
    .eq("workflow_status", "published")

  if (totalError) {
    console.error("Error fetching global stats:", totalError)
    return { totalApprovals: 0, totalDenials: 0, approvalRate: 0, avgRating: 0 }
  }

  const approvals = totalStats.filter((c: any) => c.type === "approval")
  const denials = totalStats.filter((c: any) => c.type === "denial")
  const totalCases = totalStats.length
  const avgRating = totalCases > 0 ? totalStats.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / totalCases : 0

  return {
    totalApprovals: approvals.length,
    totalDenials: denials.length,
    approvalRate: totalCases > 0 ? (approvals.length / totalCases) * 100 : 0,
    avgRating: Math.round(avgRating * 100) / 100,
  }
}

export async function getSparklineData(supabase: SupabaseClient): Promise<TimelineData[]> {
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  const { data: cases, error } = await supabase
    .from("cases")
    .select("type, published_at")
    .eq("workflow_status", "published")
    .gte("published_at", sevenDaysAgo)
    .order("published_at", { ascending: true })

  if (error) return []

  const dailyData: { [key: string]: { approvals: number; denials: number } } = {}
  for (let i = 0; i < 7; i++) {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    dailyData[date] = { approvals: 0, denials: 0 }
  }

  cases.forEach(c => {
    if (c.published_at) {
      const dateKey = format(new Date(c.published_at), 'yyyy-MM-dd')
      if (dailyData[dateKey]) {
        if (c.type === 'approval') dailyData[dateKey].approvals += 1
        else if (c.type === 'denial') dailyData[dateKey].denials += 1
      }
    }
  })

  return Object.entries(dailyData).map(([date, counts]) => ({
    date: format(new Date(date), 'MMM dd'),
    approvals: counts.approvals,
    denials: counts.denials,
  }))
}

export async function getTopFirms(supabase: SupabaseClient, limit: number = 5): Promise<TopFirm[]> {
  const { data, error } = await supabase
    .from("firms")
    .select(`
      id,
      name,
      slug,
      logo_url,
      firms_agg (
        avg_rating,
        approvals_30d,
        denials_30d,
        approval_rate_30d,
        ranking_score
      )
    `)
    .not('firms_agg', 'is', null)
    .order("ranking_score", { foreignTable: "firms_agg", ascending: false })
    .limit(limit)

  if (error) return []

  return data.map((firm, index) => {
    const agg = Array.isArray(firm.firms_agg) ? firm.firms_agg[0] : firm.firms_agg
    return {
      rank: index + 1,
      name: firm.name,
      slug: firm.slug,
      logo_url: firm.logo_url,
      avg_rating: agg?.avg_rating || 0,
      approvals_30d: agg?.approvals_30d || 0,
      denials_30d: agg?.denials_30d || 0,
      approval_rate: agg?.approval_rate_30d || 0,
    }
  })
}

export async function getRatingDistribution(supabase: SupabaseClient): Promise<RatingDistribution[]> {
  const { data: cases, error } = await supabase
    .from("cases")
    .select("rating")
    .eq("workflow_status", "published")

  if (error) return []

  const totalCases = cases.length
  const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  cases.forEach(c => { if (c.rating) distribution[c.rating] += 1 })

  return Object.entries(distribution).map(([rating, count]) => ({
    rating: Number(rating),
    count,
    percentage: totalCases > 0 ? (count / totalCases) * 100 : 0,
  })).sort((a, b) => b.rating - a.rating)
}