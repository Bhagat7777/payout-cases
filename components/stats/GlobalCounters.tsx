"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useAnimatedCounter } from "@/hooks/use-animated-counter"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { Star, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import type { GlobalStats, TimelineData } from "@/lib/mockData"

interface StatsWithSparkline extends GlobalStats {
  sparklineData: TimelineData[]
}

export function GlobalCounters({ stats }: { stats: StatsWithSparkline }) {
  const animatedApprovals = useAnimatedCounter(stats.totalApprovals, 1200)
  const animatedDenials = useAnimatedCounter(stats.totalDenials, 800)
  const animatedApprovalRate = useAnimatedCounter(stats.approvalRate, 1000)

  const counterCards = [
    {
      label: "Total Approvals",
      value: animatedApprovals.toLocaleString(),
      color: "text-green-400",
      icon: CheckCircle,
      sparklineKey: "approvals",
      sparklineColor: "#22c55e"
    },
    {
      label: "Total Denials",
      value: animatedDenials.toLocaleString(),
      color: "text-red-400",
      icon: XCircle,
      sparklineKey: "denials",
      sparklineColor: "#ef4444"
    },
    {
      label: "Approval Rate",
      value: `${animatedApprovalRate.toFixed(1)}%`,
      color: "text-blue-400",
      icon: TrendingUp,
      sparklineKey: null
    },
    {
      label: "Avg Rating",
      value: stats.avgRating.toFixed(1),
      color: "text-yellow-400",
      icon: Star,
      sparklineKey: null
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {counterCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <Card className="glass border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="flex items-end justify-between">
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                {card.sparklineKey && (
                  <div className="w-20 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.sparklineData}>
                        <Line 
                          type="monotone" 
                          dataKey={card.sparklineKey} 
                          stroke={card.sparklineColor} 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}