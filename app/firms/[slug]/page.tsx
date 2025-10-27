"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, FileText, Calendar, BarChart3, Clock, Award, Users, Globe, TrendingUp, TrendingDown } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { FirmHeader } from "@/components/firms/FirmHeader"
import { KpiStrip } from "@/components/firms/KpiStrip"
import { CaseCard } from "@/components/firms/CaseCard"
import { TimelineChart } from "@/components/firms/TimelineChart"
import { RatingDistributionChart } from "@/components/firms/RatingDistributionChart"
import type { Database } from "@/lib/supabase/types"

type Firm = Database["public"]["Tables"]["firms"]["Row"] & {
  firms_agg?: Database["public"]["Tables"]["firms_agg"]["Row"] | null
}

interface Case {
  id: string
  firm_id: string
  type: "approval" | "denial"
  payout_date: string
  rating: number
  title: string | null
  notes: string | null
  evidence_urls: string[] | null
  submitted_by: string | null
  workflow_status: "submitted" | "under_review" | "published" | "rejected"
  created_at: string | null
  published_at: string | null
  firms: {
    name: string
    slug: string
    logo_url: string | null
  } | null
}

interface TimelineData {
  date: string
  approvals: number
  denials: number
}

interface RatingDistribution {
  rating: number
  count: number
}

export default function FirmDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [firm, setFirm] = useState<Firm | null>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [timelineData, setTimelineData] = useState<TimelineData[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFirmData() {
      try {
        setIsLoading(true)
        const supabase = createBrowserClient()

        // Fetch firm details
        const { data: firmData, error: firmError } = await supabase
          .from("firms")
          .select(`
            *,
            firms_agg (
              approvals_7d,
              approvals_30d,
              approvals_total,
              denials_7d,
              denials_30d,
              denials_total,
              avg_rating,
              approval_rate_30d,
              ranking_score
            )
          `)
          .eq("slug", slug)
          .single()

        if (firmError) {
          throw new Error(firmError.message)
        }

        setFirm(firmData)

        // Fetch firm cases
        const { data: casesData, error: casesError } = await supabase
          .from("cases")
          .select(`
            *,
            firms (name, slug, logo_url)
          `)
          .eq("firm_id", firmData.id)
          .eq("workflow_status", "published")
          .order("published_at", { ascending: false })
          .limit(10)

        if (casesError) {
          throw new Error(casesError.message)
        }

        setCases(casesData || [])

        // Generate mock timeline data
        const mockTimelineData: TimelineData[] = [
          { date: "2024-01-09", approvals: 8, denials: 1 },
          { date: "2024-01-10", approvals: 12, denials: 0 },
          { date: "2024-01-11", approvals: 15, denials: 2 },
          { date: "2024-01-12", approvals: 18, denials: 1 },
          { date: "2024-01-13", approvals: 14, denials: 3 },
          { date: "2024-01-14", approvals: 22, denials: 2 },
          { date: "2024-01-15", approvals: 12, denials: 1 },
        ]
        setTimelineData(mockTimelineData)

        // Generate mock rating distribution
        const mockRatingDistribution: RatingDistribution[] = [
          { rating: 1, count: 3 },
          { rating: 2, count: 8 },
          { rating: 3, count: 15 },
          { rating: 4, count: 45 },
          { rating: 5, count: 85 },
        ]
        setRatingDistribution(mockRatingDistribution)
      } catch (err) {
        console.error("Error loading firm data:", err)
        setError("Failed to load firm data")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadFirmData()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading firm details...</p>
        </div>
      </div>
    )
  }

  if (error || !firm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Firm not found"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const agg = firm.firms_agg
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <FirmHeader firm={firm} />
        {agg && <KpiStrip agg={agg} />}

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Approvals</span>
              </TabsTrigger>
              <TabsTrigger value="denials" className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4" />
                <span>Denials</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                    <CardHeader>
                      <CardTitle>About {firm.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{firm.description || "No description available."}</p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Award className="w-5 h-5" />
                          <span>Performance Summary</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Approvals</span>
                          <span className="font-semibold text-green-600">{agg?.approvals_total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Denials</span>
                          <span className="font-semibold text-red-500">{agg?.denials_total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Success Rate</span>
                          <span className="font-semibold text-blue-600">
                            {agg?.approval_rate_30d ? `${agg.approval_rate_30d.toFixed(1)}%` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Community Rating</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {agg && renderStars(agg.avg_rating || 0)}
                            </div>
                            <span className="font-semibold">
                              {agg ? agg.avg_rating?.toFixed(1) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="w-5 h-5" />
                          <span>Recent Activity</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {cases.slice(0, 3).map((caseItem, index) => (
                            <div key={caseItem.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Badge
                                variant={caseItem.type === "approval" ? "default" : "destructive"}
                                className={
                                  caseItem.type === "approval"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {caseItem.type}
                              </Badge>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{caseItem.title || "Case submitted"}</div>
                                <div className="text-xs text-gray-500">
                                  {caseItem.published_at
                                    ? new Date(caseItem.published_at).toLocaleDateString()
                                    : "N/A"}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">{renderStars(caseItem.rating)}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="approvals" className="space-y-6">
                <motion.div
                  key="approvals"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payout Approvals</h2>
                    <Badge className="bg-green-100 text-green-700">
                      {cases.filter((c) => c.type === "approval").length} cases
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cases
                      .filter((c) => c.type === "approval")
                      .map((caseItem, index) => (
                        <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
                      ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="denials" className="space-y-6">
                <motion.div
                  key="denials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payout Denials</h2>
                    <Badge className="bg-red-100 text-red-700">
                      {cases.filter((c) => c.type === "denial").length} cases
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cases
                      .filter((c) => c.type === "denial")
                      .map((caseItem, index) => (
                        <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
                      ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TimelineChart timelineData={timelineData} />
                </motion.div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RatingDistributionChart ratingDistribution={ratingDistribution} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="w-5 h-5" />
                          <span>Community Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Reviews</span>
                          <span className="font-semibold">{agg?.approvals_total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Rating</span>
                          <span className="font-semibold">
                            {agg ? `${agg.avg_rating?.toFixed(1)}/5` : "N/A"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = ratingDistribution.find((r) => r.rating === rating)?.count || 0
                            const percentage =
                              agg && agg.approvals_total
                                ? (count / agg.approvals_total) * 100
                                : 0
                            return (
                              <div key={rating} className="flex items-center space-x-3">
                                <span className="text-sm w-8">{rating}★</span>
                                <Progress value={percentage} className="flex-1" />
                                <span className="text-sm text-gray-500 w-12">{count}</span>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5" />
                          <span>Performance Metrics</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Success Rate (30d)</span>
                          <span className="font-semibold text-green-600">
                            {agg?.approval_rate_30d ? `${agg.approval_rate_30d.toFixed(1)}%` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Ranking Score</span>
                          <span className="font-semibold text-blue-600">
                            {agg?.ranking_score ? `${agg.ranking_score.toFixed(1)}/10` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Global Rank</span>
                          <span className="font-semibold">#{1}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Last Activity</span>
                          <span className="font-semibold">N/A</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}