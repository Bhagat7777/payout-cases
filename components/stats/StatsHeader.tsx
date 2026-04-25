"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

export function StatsHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="text-center mb-12"
    >
      <div className="inline-flex items-center justify-center p-3 bg-[#7C5CFF]/10 rounded-2xl mb-6 border border-[#7C5CFF]/20">
        <BarChart3 className="w-8 h-8 text-[#7C5CFF]" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-[#E6E7EB] mb-4 tracking-tight">
        Network <span className="text-[#00D1B2]">Analytics</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Real-time transparency into the prop trading industry. Tracking payouts, denials, and firm performance across the globe.
      </p>
    </motion.div>
  )
}