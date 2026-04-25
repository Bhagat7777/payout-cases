"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Loader2,
  Star,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCaseFeed, Case, CaseType, TimePeriod } from "@/hooks/use-case-feed";

interface CaseFeedListProps {
  type: CaseType;
}

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Published</Badge>;
    case "submitted":
      return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Submitted</Badge>;
    case "rejected":
      return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const renderStars = (rating: number, isApproval: boolean) => {
  const colorClass = isApproval ? "text-yellow-400 fill-current" : "text-red-400 fill-current";
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < Math.floor(rating) ? colorClass : "text-gray-600"}`}
    />
  ));
};

export function CaseFeedList({ type }: CaseFeedListProps) {
  const isApproval = type === "approval";
  const title = isApproval ? "Payout Approvals" : "Payout Denials";
  const description = isApproval ? "Real-time feed of successful payouts" : "Real-time feed of denied payouts";
  const Icon = isApproval ? CheckCircle : XCircle;
  const gradientFrom = isApproval ? "#22C55E" : "#EF4444";
  const gradientTo = isApproval ? "#00D1B2" : "#7C5CFF";
  const submitPath = isApproval ? "/approvals/submit" : "/denials/submit";

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
  } = useCaseFeed(type);

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-400">{description}</p>
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

      {/* Controls */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search title or notes..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedFirm} onValueChange={setSelectedFirm}>
                <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                  <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Filter by Firm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Firms</SelectItem>
                  {availableFirms.map((firmName) => (
                    <SelectItem key={firmName} value={firmName}>
                      {firmName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                  <Star className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={r.toString()}>
                      {r} Stars {isApproval ? "or more" : "or less"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TimePeriod)}>
              <TabsList className="bg-slate-700/50 border-slate-600">
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Case Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            {isLoading ? "Loading..." : `Found ${filteredCases.length} Cases`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Fetching cases...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-left text-slate-400 font-medium">Firm</th>
                    <th className="py-3 px-4 text-left text-slate-400 font-medium">Title / Notes</th>
                    <th className="py-3 px-4 text-left text-slate-400 font-medium">Rating</th>
                    <th className="py-3 px-4 text-left text-slate-400 font-medium">Date</th>
                    <th className="py-3 px-4 text-left text-slate-400 font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-slate-400 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filteredCases.map((caseItem) => (
                      <motion.tr
                        key={caseItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-slate-700 hover:bg-slate-700/30"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-bold text-slate-300">
                                {caseItem.firms?.name.substring(0, 2) || "PF"}
                              </span>
                            </div>
                            <span className="text-white">{caseItem.firms?.name || "Unknown Firm"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-300 max-w-xs truncate">
                          {caseItem.title || caseItem.notes || "No title/notes"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(caseItem.rating || 0, isApproval)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {caseItem.published_at ? format(new Date(caseItem.published_at), "MMM dd, yyyy") : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={caseItem.workflow_status} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link href={`/cases/${caseItem.id}`}>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700/50">
                              View
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          
          {filteredCases.length === 0 && !isLoading && (
            <div className="text-center py-12">
              {isApproval ? (
                <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              ) : (
                <TrendingDown className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              )}
              <p className="text-slate-400">No {type} cases found matching your criteria.</p>
              <Link href={submitPath}>
                <Button variant="outline" className="mt-4 border-white/20 text-gray-300 hover:bg-white/5">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit First {isApproval ? "Approval" : "Denial"}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}