"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XCircle, Star, Search, Building2, TrendingUp, ArrowLeft, Plus, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { getCasesByType } from "@/lib/queries/cases"
import type { Database } from "@/lib/supabase/types"

type Case = Database["public"]["Tables"]["cases"]["Row"] & {
  firms: Database["public"]["Tables"]["firms"]["Row"]
}

export default function DenialsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFirm, setSelectedFirm] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [cases, setCases] = useState<Case[]>([])
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    const loadCases = async () => {
      try {
        setIsLoading(true)
        const data = await getCasesByType(supabase, "denial")
        setCases(data)
        setError(null)
      } catch (err) {
        console.error("Error loading cases:", err)
        setError("Failed to load cases")
      } finally {
        setIsLoading(false)
      }
    }

    loadCases()

    const channel = supabase
      .channel("denial-cases")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cases",
          filter: "type=eq.denial",
        },
        (payload) => {
          console.log("[v0] Real-time update received:", payload)
          if (payload.eventType === "INSERT") {
            loadCases()
          } else if (payload.eventType === "UPDATE") {
            loadCases()
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    let filtered = [...cases]

    // Filter by time period
    const now = new Date()
    if (activeTab === "today") {
      filtered = filtered.filter((c) => {
        const publishedAtStr = c.published_at || c.created_at || new Date().toISOString()
        const publishedAt = new Date(publishedAtStr)
        const diff = now.getTime() - publishedAt.getTime()
        return diff < 24 * 60 * 60 * 1000
      })
    } else if (activeTab === "7d") {
      filtered = filtered.filter((c) => {
        const publishedAtStr = c.published_at || c.created_at || new Date().toISOString()
        const publishedAt = new Date(publishedAtStr)
        const diff = now.getTime() - publishedAt.getTime()
        return diff < 7 * 24 * 60 * 60 * 1000
      })
    } else if (activeTab === "30d") {
      filtered = filtered.filter((c) => {
        const publishedAtStr = c.published_at || c.created_at || new Date().toISOString()
        const publishedAt = new Date(publishedAtStr)
        const diff = now.getTime() - publishedAt.getTime()
        return diff < 30 * 24 * 60 * 60 * 1000
      })
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.firms.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by firm
    if (selectedFirm !== "all") {
      filtered = filtered.filter((c) => c.firms.name === selectedFirm)
    }

    // Filter by rating
    if (selectedRating !== "all") {
      filtered = filtered.filter((c) => c.rating && c.rating >= Number.parseInt(selectedRating))
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const aDateStr = a.published_at || a.created_at || new Date().toISOString()
        const bDateStr = b.published_at || b.created_at || new Date().toISOString()
        return new Date(bDateStr).getTime() - new Date(aDateStr).getTime()
      })
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0)) // Lowest rating first for denials
    }

    setFilteredCases(filtered)
  }, [cases, activeTab, searchQuery, selectedFirm, selectedRating, sortBy])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const firms = Array.from(new Set(cases.map((c) => c.firms.name)))

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#EF4444] to-[#7C5CFF] rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#E6E7EB" }}>
                  Payout Denials
                </h1>
                <p className="text-gray-400">Real-time feed of denied payouts</p>
              </div>
            </div>

            <Link href="/denials/submit">
              <Button className="bg-gradient-to-r from-[#EF4444] to-[#7C5CFF] hover:opacity-90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Submit Denial
              </Button>
            </Link>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#EF4444]/20 data-[state=active]:text-[#EF4444]"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="today"
                className="data-[state=active]:bg-[#EF4444]/20 data-[state=active]:text-[#EF4444]"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="7d"
                className="data-[state=active]:bg-[#EF4444]/20 data-[state=active]:text-[#EF4444]"
              >
                7 Days
              </TabsTrigger>
              <TabsTrigger
                value="30d"
                className="data-[state=active]:bg-[#EF4444]/20 data-[state=active]:text-[#EF4444]"
              >
                30 Days
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search denials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-[#E6E7EB] placeholder:text-gray-500"
              />
            </div>

            <Select value={selectedFirm} onValueChange={setSelectedFirm}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-[#E6E7EB]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Firms" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f2e] border-white/10">
                <SelectItem value="all">All Firms</SelectItem>
                {firms.map((firm) => (
                  <SelectItem key={firm} value={firm}>
                    {firm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-[#E6E7EB]">
                <Star className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f2e] border-white/10">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-[#E6E7EB]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f2e] border-white/10">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-400">
              {filteredCases.length} denial{filteredCases.length !== 1 ? "s" : ""} found
            </p>
            <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20">
              <div className="w-2 h-2 bg-[#EF4444] rounded-full mr-2 animate-pulse" />
              Live Updates
            </Badge>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass border-white/10 animate-pulse">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded mb-2" />
                        <div className="h-3 bg-white/10 rounded w-2/3" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/10 rounded" />
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredCases.map((caseItem, index) => (
                  <motion.div
                    key={caseItem.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="glass border-white/10 hover:border-[#EF4444]/30 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                              style={{
                                background: "linear-gradient(135deg, #EF4444, #7C5CFF)",
                              }}
                            >
                              {caseItem.firms.name.charAt(0)}
                            </div>
                            <div>
                              <CardTitle className="text-[#E6E7EB] text-lg">{caseItem.firms.name}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 text-xs">
                                  Denied
                                </Badge>
                                <span className="text-gray-400 text-sm">
                                  {formatRelativeTime(caseItem.published_at || caseItem.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (caseItem.rating || 0) ? "text-[#EF4444] fill-current" : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-[#EF4444] font-bold text-lg">
                              ${caseItem.amount ? caseItem.amount.toString() : "N/A"}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-[#E6E7EB] font-semibold mb-2">{caseItem.title || "Payout Denied"}</h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {caseItem.notes || "Payout was denied."}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {caseItem.evidence_urls?.length || 0} evidence
                            </span>
                          </div>
                          <Link href={`/cases/${caseItem.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 opacity-0 group-hover:opacity-100 transition-all bg-transparent"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredCases.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <XCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#E6E7EB] mb-2">No denials found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
              <Link href="/denials/submit">
                <Button className="bg-gradient-to-r from-[#EF4444] to-[#7C5CFF] hover:opacity-90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit First Denial
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}