"use client"

import { useState, useEffect, useMemo } from "react"
import type { Database } from "@/lib/supabase/types"

export type Firm = Database["public"]["Tables"]["firms"]["Row"] & {
  firms_agg?: Database["public"]["Tables"]["firms_agg"]["Row"] | null
}

export type SortOption = "top-ranked" | "top-rated" | "most-approvals" | "least-denials" | "trending"

export function useFirmFiltering(initialFirms: Firm[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("top-ranked")
  const [firms, setFirms] = useState(initialFirms)

  useEffect(() => {
    setFirms(initialFirms)
  }, [initialFirms])

  const filteredAndSortedFirms = useMemo(() => {
    let filtered = firms.filter(
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
          return (aAgg.denials_30d || 0) - (bAgg.denials_30d || 0) // Least denials first
        case "trending":
          // Simplified trending logic using 30d approvals for now
          return (bAgg.approvals_30d || 0) - (aAgg.approvals_30d || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [firms, searchQuery, sortBy])

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredAndSortedFirms,
  }
}