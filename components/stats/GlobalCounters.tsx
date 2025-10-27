"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useAnimatedCounter } from "@/hooks/use-animated-counter"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { Star, TrendingUp } from "lucide-react"
import type { GlobalStats, TimelineData } from "@/lib/mockData"

interface StatsWithSparkline extends GlobalStats {
  sparklineData: TimelineData[]
}

export function GlobalCounters({ stats }: { stats: StatsWithSparkline }) {
  const animatedApprovals = useAnimatedCounter(stats.totalApprovals, 1200)
  const animatedDenials = useAnimatedCounter(stats.totalDenials, 800)
  const animatedApprovalRate = useAnimatedCounter(stats.approvalRate, 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Approvals</p>
              <p className="text-3xl font-bold text-green-600">{animatedApprovals.toLocaleString()}</p>
            </div>
            <div className="w-16 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.sparklineData}>
                  <Line type="monotone" dataKey="approvals" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Denials</p>
              <p className="text-3xl font-bold text-red-500">{animatedDenials.toLocaleString()}</p>
            </div>
            <div className="w-16 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.sparklineData}>
                  <Line type="monotone" dataKey="denials" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-3xl font-bold text-blue-600">{animatedApprovalRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}