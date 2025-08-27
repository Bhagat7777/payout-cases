"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Grid, List, TrendingUp, TrendingDown, Star, ExternalLink, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FirmCard } from "@/components/firms/FirmCard"
import { LeaderboardRow } from "@/components/firms/LeaderboardRow"
import { createBrowserClient } from "@/lib/supabase/client"
import { subscribeToFirmUpdates } from "@/lib/queries/firms"
import type { Database } from "@/lib/supabase/types"

type Firm = Database["public"]["Tables"]["firms"]["Row"] & {
  firms_agg?: Database["public"]["Tables"]["firms_agg"]["Row"] | null
}

type SortOption = "top-ranked" | "top-rated" | "most-approvals" | "least-denials" | "trending"
type ViewMode = "grid" | "table"

const sortOptions = [
  { key: "top-ranked" as const, label: "Top Ranked", icon: TrendingUp },
  { key: "top-rated" as const, label: "Top Rated", icon: Star },
  { key: "most-approvals" as const, label: "Most Approvals (30d)", icon: TrendingUp },
  { key: "least-denials" as const, label: "Least Denials (30d)", icon: TrendingDown },
  { key: "trending" as const, label: "Trending (7d)", icon: TrendingUp },
]

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [filteredFirms, setFilteredFirms] = useState<Firm[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("top-ranked")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFirms() {
      try {
        setIsLoading(true)
        const supabase = createBrowserClient()

        const { data: firms, error } = await supabase
          .from("firms")
          .select(`
            *,
            firms_agg (
              approvals_30d,
              denials_30d,
              approvals_total,
              denials_total,
              avg_rating,
              approval_rate_30d,
              ranking_score
            )
          `)
          .order("name")

        if (error) {
          console.error("Error fetching firms:", error)
          setError("Failed to load firms")
          return
        }

        setFirms(firms || [])
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load firms")
      } finally {
        setIsLoading(false)
      }
    }

    loadFirms()

    const subscription = subscribeToFirmUpdates((payload) => {
      console.log("[v0] Firm update received:", payload)
      // Refresh firms data when updates occur
      loadFirms()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Filter and sort firms
  useEffect(() => {
    const filtered = firms.filter(
      (firm) =>
        firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (firm.headquarters && firm.headquarters.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Sort based on selected option
    filtered.sort((a, b) => {
      const aAgg = a.firms_agg
      const bAgg = b.firms_agg

      if (!aAgg && !bAgg) return 0
      if (!aAgg) return 1
      if (!bAgg) return -1

      switch (sortBy) {
        case "top-ranked":
          return (bAgg.ranking_score || 0) - (aAgg.ranking_score || 0)
        case "top-rated":
          return (bAgg.avg_rating || 0) - (aAgg.avg_rating || 0)
        case "most-approvals":
          return (bAgg.approvals_30d || 0) - (aAgg.approvals_30d || 0)
        case "least-denials":
          return (aAgg.denials_30d || 0) - (bAgg.denials_30d || 0)
        case "trending":
          return (bAgg.approvals_30d || 0) - (aAgg.approvals_30d || 0) // Simplified trending logic
        default:
          return 0
      }
    })

    setFilteredFirms(filtered)
  }, [firms, searchQuery, sortBy])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading firms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prop Firm Directory</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and compare prop trading firms based on real payout data and community reviews
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
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search firms or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 border-gray-200"
              />
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => {
                const Icon = option.icon
                return (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(option.key)}
                    className={sortBy === option.key ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </Button>
                )
              })}
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-white shadow-sm" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFirms.map((firm, index) => (
                <FirmCard key={firm.id} firm={firm} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Firm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approvals (30d)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Denials (30d)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approval Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFirms.map((firm, index) => (
                      <LeaderboardRow key={firm.id} firm={firm} rank={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredFirms.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No firms found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}