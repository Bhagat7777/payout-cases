"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Download, Star } from "lucide-react"
import type { TopFirm } from "@/lib/mockData"

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
  ))
}

export function TopFirmsCard({ firms, onExport }: { firms: TopFirm[]; onExport: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Top Firms (30d)</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onExport} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {firms.slice(0, 5).map((firm, index) => (
              <motion.div
                key={firm.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-gray-500 w-8">#{firm.rank}</div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                      {firm.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{firm.name}</div>
                    <div className="flex items-center space-x-1">{renderStars(firm.avg_rating)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{firm.approvals_30d}</div>
                    <div className="text-gray-500">Approvals</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-500">{firm.denials_30d}</div>
                    <div className="text-gray-500">Denials</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">{firm.approval_rate.toFixed(1)}%</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}