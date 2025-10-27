"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  Star,
  Search,
  Building2,
  TrendingUp,
  ArrowLeft,
  Plus,
  Eye,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CaseCard } from "@/components/firms/CaseCard"
import { useCaseFeed, type CaseType, type TimePeriod, type SortOption } from "@/hooks/use-case-feed"

interface CaseFeedProps {
  type: CaseType
}

const timePeriods: { value: TimePeriod; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
]

const approvalSortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
]

const denialSortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Lowest Rated" },
]

const ratingOptions = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
  { value: "2", label: "2+ Stars" },
  { value: "1", label: "1+ Stars" },
]

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

export function CaseFeed({ type }: CaseFeedProps) {
  const {
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
  } = useCaseFeed(type)

  const isApproval = type === "approval"
  const title = isApproval ? "Payout Approvals" : "Payout Denials"
  const description = isApproval ? "Real-time feed of successful payouts" : "Real-time feed of denied payouts"
  const icon = isApproval ? CheckCircle : XCircle
  const gradientFrom = isApproval ? "#22C55E" : "#EF4444"
  const gradientTo = isApproval ? "#00D1B2" : "#7C5CFF"
  const badgeColor = isApproval ? "#22C55E" : "#EF4444"
  const submitPath = isApproval ? "/approvals/submit" : "/denials/submit"
  const sortOptions = isApproval ? approvalSortOptions : denialSortOptions

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

  const Icon = icon

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
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#E6E7EB" }}>
                  {title}
                </h1>
                <p className="text-gray-400">{description}</p>
              </div>
            </div>

            <Link href={submitPath}>
              <Button
                className="hover:opacity-90 text-white"
                style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit {isApproval ? "Approval" : "Denial"}
              </Button>
            </Link>
          </div>

          {/* Time Period Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TimePeriod)} className="mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              {timePeriods.map((period) => (
                <TabsTrigger
                  key={period.value}
                  value={period.value}
                  // Using inline style for dynamic Tailwind colors based on type
                  style={{
                    "--tw-ring-color": badgeColor,
                    "--tw-text-opacity": activeTab === period.value ? 1 : 0.7,
                    "--tw-bg-opacity": activeTab === period.value ? 0.2 : 0,
                    color: activeTab === period.value ? badgeColor : 'var(--foreground)',
                    backgroundColor: activeTab === period.value ? `${badgeColor}20` : 'transparent',
                  }}
                  className={`data-[state=active]:bg-[${badgeColor}]/20 data-[state=active]:text-[${badgeColor}]`}
                >
                  {period.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${type}s...`}
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
                {availableFirms.map((firm) => (
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
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-[#E6E7EB]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f2e] border-white/10">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-400">
              {filteredCases.length} {type}
              {filteredCases.length !== 1 ? "s" : ""} found
            </p>
            <Badge style={{ backgroundColor: `${badgeColor}10`, color: badgeColor, borderColor: `${badgeColor}20` }}>
              <div className={`w-2 h-2 rounded-full mr-2 animate-pulse`} style={{ backgroundColor: badgeColor }} />
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
                <Card key={i} className="glass border-white/10 animate-pulse h-full">
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
                    <Card className={`glass border-white/10 hover:border-[${badgeColor}]/30 transition-all duration-300 h-full`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
                            >
                              {caseItem.firms.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <CardTitle className="text-[#E6E7EB] text-lg">{caseItem.firms.name}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Badge style={{ backgroundColor: `${badgeColor}10`, color: badgeColor, borderColor: `${badgeColor}20` }} className="text-xs">
                                  {isApproval ? "Approved" : "Denied"}
                                </Badge>
                                <span className="text-gray-400 text-sm">
                                  {formatRelativeTime(caseItem.published_at || caseItem.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {caseItem.rating && (
                              <div className="flex items-center space-x-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < caseItem.rating!
                                        ? isApproval ? "text-yellow-400 fill-current" : "text-[#EF4444] fill-current"
                                        : "text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            <div className={`font-bold text-lg ${isApproval ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                              {caseItem.payout_date ? new Date(caseItem.payout_date).toLocaleDateString() : "N/A"}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-[#E6E7EB] font-semibold mb-2">{caseItem.title || (isApproval ? "Payout Approved" : "Payout Denied")}</h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {caseItem.notes || (isApproval ? "Successful payout received." : "Payout was denied.")}
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
                              style={{ borderColor: `${badgeColor}30`, color: badgeColor }}
                              className={`hover:bg-[${badgeColor}]/10 opacity-0 group-hover:opacity-100 transition-all bg-transparent`}
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

          {!isLoading && filteredCases.length === 0 && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#E6E7EB] mb-2">No {type}s found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
              <Link href={submitPath}>
                <Button
                  className="hover:opacity-90 text-white"
                  style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit First {isApproval ? "Approval" : "Denial"}
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}