"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useAnimatedCounter } from "@/hooks/use-animated-counter"
import type { Database } from "@/lib/supabase/types"
import { useEffect, useState } from "react"

type FirmAgg = Database["public"]["Tables"]["firms_agg"]["Row"] | null

interface KpiStripProps {
  agg: FirmAgg
}

export function KpiStrip({ agg }: KpiStripProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const approvalsToday = useAnimatedCounter(agg?.approvals_30d ? Math.floor(agg.approvals_30d / 30) : 0, 800)
  const approvals7d = useAnimatedCounter(agg?.approvals_7d || 0, 1000)
  const approvals30d = useAnimatedCounter(agg?.approvals_30d || 0, 1200)

  if (!isClient) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-500">Approvals Today</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-500">Approvals 7d</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-500">Approvals 30d</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-sm text-gray-500">Denials Today</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-sm text-gray-500">Denials 7d</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-sm text-gray-500">Denials 30d</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{approvalsToday}</div>
            <div className="text-sm text-gray-500">Approvals Today</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{approvals7d}</div>
            <div className="text-sm text-gray-500">Approvals 7d</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{approvals30d}</div>
            <div className="text-sm text-gray-500">Approvals 30d</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{agg?.denials_30d ? Math.floor(agg.denials_30d / 30) : 0}</div>
            <div className="text-sm text-gray-500">Denials Today</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{agg?.denials_7d || 0}</div>
            <div className="text-sm text-gray-500">Denials 7d</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{agg?.denials_30d || 0}</div>
            <div className="text-sm text-gray-500">Denials 30d</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}