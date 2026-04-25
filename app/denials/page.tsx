"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, XCircle, Plus, Search, Filter, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaseCard } from "@/components/cases/CaseCard";
import { useCaseFeed } from "@/hooks/use-case-feed";
import { AppWrapper } from "@/components/AppWrapper";
import { Navbar } from "@/components/home/Navbar";

export default function PayoutDenialsPage() {
  const { filteredCases, isLoading, searchQuery, setSearchQuery } = useCaseFeed("denial");

  return (
    <AppWrapper>
      <div className="min-h-screen bg-[#0B0F17]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#E6E7EB] mb-4">
                  Payout <span className="text-red-400">Denials & Rejections</span>
                </h1>
                <div className="flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm max-w-2xl">
                  <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                  Warning: These cases represent reported payout failures. Use this data to identify risky firms and protect your capital.
                </div>
              </div>
              <Link href="/denials/submit">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Report Denial
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Search by firm name..." 
                className="pl-10 bg-white/5 border-white/10 text-white h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-white/10 text-gray-300 h-12">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-white/5 animate-pulse border border-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((caseItem, index) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
              ))}
            </div>
          )}

          {!isLoading && filteredCases.length === 0 && (
            <div className="text-center py-20 glass rounded-2xl border-white/10">
              <XCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No denials found</h3>
              <p className="text-gray-400">This is actually a good sign! No recent rejections reported.</p>
            </div>
          )}
        </div>
      </div>
    </AppWrapper>
  );
}