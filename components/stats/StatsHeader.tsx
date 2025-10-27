"use client"

import { motion } from "framer-motion"

export function StatsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Comprehensive insights into prop firm performance and community trends
      </p>
    </motion.div>
  )
}