"use client"

import { motion } from "framer-motion"
import { Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Period } from "@/lib/mockData"

interface StatsControlsProps {
  period: Period
  onPeriodChange: (period: Period) => void
  firmFilter: string
  onFirmFilterChange: (filter: string) => void
  onExport: () => void
}

export function StatsControls({
  period,
  onPeriodChange,
  firmFilter,
  onFirmFilterChange,
  onExport,
}: StatsControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Filter by firm..."
              value={firmFilter}
              onChange={(e) => onFirmFilterChange(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 w-64"
            />
          </div>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={onExport} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </div>
    </motion.div>
  )
}