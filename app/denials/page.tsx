"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { CaseFeedList } from "@/components/cases/CaseFeedList";

export default function PayoutDenialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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

          {/* Hero section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Payout Denials & Rejections</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Transparent record of denied payouts. Help other traders identify non-paying or risky firms by staying informed.
            </p>
          </div>
        </motion.div>
        
        <CaseFeedList type="denial" />
      </div>
    </div>
  );
}