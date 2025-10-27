"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { HeatmapData } from "@/lib/mockData"

const getHeatmapColor = (count: number) => {
  const intensity = Math.min(count / 10, 1)
  return `rgba(239, 68, 68, ${intensity})`
}

export function DenialsHeatmapCard({ data }: { data: HeatmapData[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8">
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Denials Heatmap (Day × Hour)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-24 gap-1">
            <div className="col-span-24 grid grid-cols-24 gap-1 mb-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="text-xs text-gray-500 text-center">
                  {i}
                </div>
              ))}
            </div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="col-span-24 grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }, (_, hour) => {
                  const dataPoint = data.find((d) => d.day === day && d.hour === hour)
                  const count = dataPoint?.count || 0
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="aspect-square rounded-sm border border-gray-200"
                      style={{ backgroundColor: getHeatmapColor(count) }}
                      title={`${day} ${hour}:00 - ${count} denials`}
                    />
                  )
                })}
              </div>
            ))}
            <div className="col-span-24 grid grid-cols-7 gap-1 mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-sm text-gray-600 text-center col-span-3">
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="text-sm text-gray-500">Less</span>
            <div className="flex space-x-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
                <div
                  key={intensity}
                  className="w-3 h-3 rounded-sm border border-gray-200"
                  style={{ backgroundColor: `rgba(239, 68, 68, ${intensity})` }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">More</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}