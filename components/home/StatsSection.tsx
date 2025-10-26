"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useAnimatedCounter } from "@/hooks/use-animated-counter"
import type { Database } from "@/lib/supabase/types"

type FirmAgg = Database["public"]["Tables"]["firms_agg"]["Row"] | null

interface KpiStripProps {
  agg: FirmAgg
}

export function StatsSection() {
  const approvalsToday = useAnimatedCounter(0, 800)
  const approvals7d = useAnimatedCounter(0, 1000)
  const approvals30d = useAnimatedCounter(0, 1200)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            key="stat1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center group"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: "#7C5CFF20",
                  boxShadow: "0 0 20px #7C5CFF30",
                }}
              >
                <Shield className="w-6 h-6" style={{ color: "#7C5CFF" }} />
              </div>
            </div>
            <motion.div
              className="text-3xl font-bold mb-1"
              style={{ color: "#E6E7EB" }}
              whileHover={{ scale: 1.1 }}
            >
              150+
            </motion.div>
            <div className="text-gray-400">Prop Firms</div>
          </motion.div>
          
          <motion.div
            key="stat2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center group"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: "#00D1B220",
                  boxShadow: "0 0 20px #00D1B230",
                }}
              >
                <Users className="w-6 h-6" style={{ color: "#00D1B2" }} />
              </div>
            </div>
            <motion.div
              className="text-3xl font-bold mb-1"
              style={{ color: "#E6E7EB" }}
              whileHover={{ scale: 1.1 }}
            >
              5,000+
            </motion.div>
            <div className="text-gray-400">Total Reviews</div>
          </motion.div>
          
          <motion.div
            key="stat3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center group"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: "#22C55E20",
                  boxShadow: "0 0 20px #22C55E30",
                }}
              >
                <TrendingUp className="w-6 h-6" style={{ color: "#22C55E" }} />
              </div>
            </div>
            <motion.div
              className="text-3xl font-bold mb-1"
              style={{ color: "#E6E7EB" }}
              whileHover={{ scale: 1.1 }}
            >
              $2.5M+
            </motion.div>
            <div className="text-gray-400">Payouts Tracked</div>
          </motion.div>
          
          <motion.div
            key="stat4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center group"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: "#22C55E20",
                  boxShadow: "0 0 20px #22C55E30",
                }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: "#22C55E" }} />
              </div>
            </div>
            <motion.div
              className="text-3xl font-bold mb-1"
              style={{ color: "#E6E7EB" }}
              whileHover={{ scale: 1.1 }}
            >
              78%
            </motion.div>
            <div className="text-gray-400">Success Rate</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Import required icons
import { Shield, Users, TrendingUp, CheckCircle } from "lucide-react"