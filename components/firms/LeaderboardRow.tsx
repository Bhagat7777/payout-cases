"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { Database } from "@/lib/supabase/types"

type Firm = Database["public"]["Tables"]["firms"]["Row"] & {
  firms_agg?: Database["public"]["Tables"]["firms_agg"]["Row"] | null
}

interface LeaderboardRowProps {
  firm: Firm
  rank: number
}

export function LeaderboardRow({ firm, rank }: LeaderboardRowProps) {
  const agg = firm.firms_agg

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.06, duration: 0.3 }}
      className="hover:bg-blue-50/50 transition-colors group"
    >
      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{rank + 1}</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
              {firm.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/firms/${firm.slug}`}
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {firm.name}
            </Link>
            <p className="text-xs text-gray-500">{firm.headquarters}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {agg && (
          <div className="flex items-center space-x-1">
            {renderStars(agg.avg_rating || 0)}
            <span className="text-sm font-medium text-gray-700 ml-2">
              {(agg.avg_rating || 0).toFixed(1)}
            </span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-green-600">{agg?.approvals_30d || 0}</td>
      <td className="px-6 py-4 text-sm font-medium text-red-500">{agg?.denials_30d || 0}</td>
      <td className="px-6 py-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {agg?.approval_rate_30d ? `${agg.approval_rate_30d.toFixed(1)}%` : "N/A"}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {agg?.ranking_score?.toFixed(1) || "N/A"}
      </td>
    </motion.tr>
  )
}