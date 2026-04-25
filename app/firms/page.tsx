"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, TrendingUp, Award, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Firm {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  website?: string;
  approvals_total: number;
  denials_total: number;
  approval_rate: number;
}

export default function ExploreFirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [filteredFirms, setFilteredFirms] = useState<Firm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("approvals");

  useEffect(() => {
    fetchFirms();
  }, []);

  const fetchFirms = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual Supabase query
      // For now, using mock data
      const mockFirms: Firm[] = [
        {
          id: "1",
          slug: "prop-firm-a",
          name: "Apex Trading Capital",
          logo_url: "https://via.placeholder.com/48",
          website: "https://apextrading.com",
          approvals_total: 324,
          denials_total: 12,
          approval_rate: 96.4,
        },
        {
          id: "2",
          slug: "prop-firm-b",
          name: "Elite Traders Pro",
          logo_url: "https://via.placeholder.com/48",
          website: "https://elitetraders.com",
          approvals_total: 287,
          denials_total: 18,
          approval_rate: 94.1,
        },
        {
          id: "3",
          slug: "prop-firm-c",
          name: "Quantum Trading",
          logo_url: "https://via.placeholder.com/48",
          website: "https://quantumtrading.com",
          approvals_total: 156,
          denials_total: 8,
          approval_rate: 95.1,
        },
      ];
      setFirms(mockFirms);
      setFilteredFirms(mockFirms);
    } catch (error) {
      console.error("Error fetching firms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = firms;

    // Search filter
    if (searchQuery) {
      result = result.filter((firm) =>
        firm.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "approvals") {
      result = result.sort((a, b) => b.approvals_total - a.approvals_total);
    } else if (sortBy === "ratio") {
      result = result.sort((a, b) => b.approval_rate - a.approval_rate);
    } else if (sortBy === "newest") {
      result = result.sort(() => Math.random() - 0.5); // Placeholder
    }

    setFilteredFirms(result);
  }, [searchQuery, sortBy, firms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Explore Payout-Giving Firms
            </h1>
            <p className="text-slate-400">
              Browse verified prop trading firms with real payout approvals
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search firms..."
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="md:w-48 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="approvals">Most Approved</SelectItem>
                <SelectItem value="ratio">Highest Approval Ratio</SelectItem>
                <SelectItem value="newest">Recently Paying</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        )}

        {/* Firms Grid */}
        {!isLoading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredFirms.map((firm, index) => (
                <motion.div
                  key={firm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/firms/${firm.slug}`}>
                    <Card
                      className="
                        h-full cursor-pointer relative overflow-hidden border
                        bg-gradient-to-br from-slate-800/50 to-slate-700/50
                        border-slate-700 hover:border-blue-500/50
                        hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
                        transition-all duration-300 group
                      "
                    >
                      {/* Animated gradient background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "radial-gradient(circle at top right, rgba(59,130,246,0.1), transparent)",
                        }}
                      />

                      <div className="p-6 space-y-4 relative z-10">
                        {/* Logo & Name */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            {firm.logo_url && (
                              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden">
                                <img
                                  src={firm.logo_url}
                                  alt={firm.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-white text-lg">
                                {firm.name}
                              </h3>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 whitespace-nowrap ml-2">
                            Approved
                          </Badge>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-slate-400 mb-1">
                              <TrendingUp className="inline w-3 h-3 mr-1" />
                              Approvals
                            </p>
                            <p className="text-xl font-bold text-green-400">
                              {firm.approvals_total}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-slate-400 mb-1">
                              <Award className="inline w-3 h-3 mr-1" />
                              Approval %
                            </p>
                            <p className="text-xl font-bold text-blue-400">
                              {firm.approval_rate.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        {/* Additional info */}
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs text-slate-500">
                            {firm.denials_total} denials | {firm.approvals_total + firm.denials_total} total cases
                          </p>
                        </div>

                        {/* Website link */}
                        {firm.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(firm.website, "_blank");
                            }}
                          >
                            Visit Website
                          </Button>
                        )}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && filteredFirms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-400">No firms found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}