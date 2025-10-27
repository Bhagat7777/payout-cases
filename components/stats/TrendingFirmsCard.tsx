"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"
import type { TrendingFirm } from "@/lib/mockData"

export function TrendingFirmsCard({ firms }: { firms: TrendingFirm[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Trending Firms (7d Growth)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {firms.map((firm, index) => (
              <motion.div
                key={firm.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                      {firm.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{firm.name}</div>
                    <div className="text-sm text-gray-500">
                      {firm.approvals_previous} → {firm.approvals_current}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {firm.growth_7d > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-semibold ${firm.growth_7d > 0 ? "text-green-600" : "text-red-500"}`}>
                    {firm.growth_7d > 0 ? "+" : ""}
                    {firm.growth_7d.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}