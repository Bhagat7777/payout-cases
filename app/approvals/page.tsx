"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaseCard } from "@/components/cases/CaseCard";
import { useCaseFeed } from "@/hooks/use-case-feed";
import { AppWrapper } from "@/components/AppWrapper";
import { Navbar } from "@/components/home/Navbar";

export default function PayoutApprovalsPage() {
  const { filteredCases, isLoading, searchQuery, setSearchQuery } = useCaseFeed("approval");

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
                  Verified <span className="text-green-400">Payout Approvals</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Real-time feed of genuine payouts from prop firms. Every case is verified with screenshot proof.
                </p>
              </div>
              <Link href="/approvals/submit">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Approval
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
              <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No approvals found</h3>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </AppWrapper>
  );
}