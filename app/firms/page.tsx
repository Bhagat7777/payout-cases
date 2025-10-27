"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Grid, List, TrendingUp, TrendingDown, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FirmGrid } from "@/components/firms/FirmGrid"
import { FirmTable } from "@/components/firms/FirmTable"
import { createBrowserClient } from "@/lib/supabase/client"
import { subscribeToFirmUpdates } from "@/lib/queries/firms"
import { useFirmFiltering, type SortOption, type Firm } from "@/hooks/use-firm-filtering"

type ViewMode = "grid" | "table"

const sortOptions: { key: SortOption; label: string; icon: any }[] = [
  { key: "top-ranked", label: "Top Ranked", icon: TrendingUp },
  { key: "top-rated", label: "Top Rated", icon: Star },
  { key: "most-approvals", label: "Most Approvals (30d)", icon: TrendingUp },
  { key: "least-denials", label: "Least Denials (30d)", icon: TrendingDown },
  { key: "trending", label: "Trending (7d)", icon: TrendingUp },
]

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredAndSortedFirms,
  } = useFirmFiltering(firms)

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
              approvals_7d,
              denials_7d,
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
          {filteredAndSortedFirms.length > 0 ? (
            viewMode === "grid" ? (
              <FirmGrid firms={filteredAndSortedFirms} />
            ) : (
              <FirmTable firms={filteredAndSortedFirms} />
            )
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No firms found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}