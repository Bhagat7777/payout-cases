"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { LeaderboardRow } from "@/components/firms/LeaderboardRow"
import type { Firm } from "@/hooks/use-firm-filtering"

interface FirmTableProps {
  firms: Firm[]
}

export function FirmTable({ firms }: FirmTableProps) {
  return (
    <motion.div
      key="table"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Firm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approvals (30d)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Denials (30d)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {firms.map((firm, index) => (
              <LeaderboardRow key={firm.id} firm={firm} rank={index} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}