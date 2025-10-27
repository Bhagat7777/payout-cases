"use client"

import { useState, useEffect, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { getCasesByType } from "@/lib/queries/cases"
import type { Database } from "@/lib/supabase/types"

export type CaseType = "approval" | "denial"

export type Case = Database["public"]["Tables"]["cases"]["Row"] & {
  firms: Database["public"]["Tables"]["firms"]["Row"]
}

export type SortOption = "newest" | "rating"
export type TimePeriod = "all" | "today" | "7d" | "30d"

export function useCaseFeed(type: CaseType) {
  const supabase = useMemo(() => createBrowserClient(), [])

  const [cases, setCases] = useState<Case[]>([])
  const [activeTab, setActiveTab] = useState<TimePeriod>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFirm, setSelectedFirm] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCases = async () => {
    try {
      setIsLoading(true)
      const data = await getCasesByType(supabase, type)
      setCases(data as Case[])
      setError(null)
    } catch (err) {
      console.error(`Error loading ${type} cases:`, err)
      setError(`Failed to load ${type} cases`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCases()

    const channel = supabase
      .channel(`${type}-cases`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cases",
          filter: `type=eq.${type}`,
        },
        (payload) => {
          console.log(`[v0] Real-time ${type} update received:`, payload)
          // Reload data on any change to ensure consistency
          loadCases()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [type, supabase])

  const filteredCases = useMemo(() => {
    let filtered = [...cases]
    const now = new Date()

    // 1. Filter by time period
    if (activeTab !== "all") {
      filtered = filtered.filter((c) => {
        const publishedAtStr = c.published_at || c.created_at || new Date().toISOString()
        const publishedAt = new Date(publishedAtStr)
        const diff = now.getTime() - publishedAt.getTime()
        
        if (activeTab === "today") return diff < 24 * 60 * 60 * 1000
        if (activeTab === "7d") return diff < 7 * 24 * 60 * 60 * 1000
        if (activeTab === "30d") return diff < 30 * 24 * 60 * 60 * 1000
        return true
      })
    }

    // 2. Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.firms.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // 3. Filter by firm
    if (selectedFirm !== "all") {
      filtered = filtered.filter((c) => c.firms.name === selectedFirm)
    }

    // 4. Filter by rating
    if (selectedRating !== "all") {
      const minRating = Number.parseInt(selectedRating)
      filtered = filtered.filter((c) => c.rating && c.rating >= minRating)
    }

    // 5. Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const aDateStr = a.published_at || a.created_at || new Date().toISOString()
        const bDateStr = b.published_at || b.created_at || new Date().toISOString()
        return new Date(bDateStr).getTime() - new Date(aDateStr).getTime()
      })
    } else if (sortBy === "rating") {
      // Approvals: Highest rated first (descending)
      // Denials: Lowest rated first (ascending)
      if (type === "approval") {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else {
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      }
    }

    return filtered
  }, [cases, activeTab, searchQuery, selectedFirm, selectedRating, sortBy, type])

  const availableFirms = useMemo(() => Array.from(new Set(cases.map((c) => c.firms.name))), [cases])

  return {
    filteredCases,
    availableFirms,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedFirm,
    setSelectedFirm,
    selectedRating,
    setSelectedRating,
    sortBy,
    setSortBy,
  }
}