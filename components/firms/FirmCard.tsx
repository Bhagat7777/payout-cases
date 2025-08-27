"use client"

import { motion } from "framer-motion"
import { Star, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { Database } from "@/lib/supabase/types"

type Firm = Database["public"]["Tables"]["firms"]["Row"] & {
  firms_agg?: Database["public"]["Tables"]["firms_agg"]["Row"] | null
}

interface FirmCardProps {
  firm: Firm
  index: number
}

export function FirmCard({ firm, index }: FirmCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {firm.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {firm.name}
                </h3>
                <p className="text-sm text-gray-500">{firm.headquarters}</p>
              </div>
            </div>
            {firm.website_url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={firm.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>

          {agg && (
            <>
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(agg.avg_rating || 0)}
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {(agg.avg_rating || 0).toFixed(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{agg.approvals_30d || 0}</div>
                  <div className="text-xs text-gray-500">Approvals (30d)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{agg.denials_30d || 0}</div>
                  <div className="text-xs text-gray-500">Denials (30d)</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {agg.approval_rate_30d ? `${agg.approval_rate_30d.toFixed(1)}%` : "N/A"} Approval Rate
                </Badge>
                <div className="text-sm text-gray-600">
                  Score: <span className="font-semibold">{agg.ranking_score?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
            </>
          )}

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{firm.description}</p>

          <div className="flex space-x-2">
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Link href={`/firms/${firm.slug}`}>View Details</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/approvals/submit?firm=${firm.slug}`}>Submit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}