"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, TrendingUp, TrendingDown, Star } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/supabase/types"

type Firm = Database["public"]["Tables"]["firms"]["Row"] & {
  firms_agg?: Database["public"]["Tables"]["firms_agg"]["Row"] | null
}

interface FirmHeaderProps {
  firm: Firm
}

export function FirmHeader({ firm }: FirmHeaderProps) {
  const agg = firm.firms_agg

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={firm.logo_url || ""} alt={firm.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                  {firm.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{firm.name}</h1>
                  <Badge className="bg-blue-100 text-blue-700">#{1}</Badge>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {agg && renderStars(agg.avg_rating || 0)}
                    <span className="text-lg font-semibold text-gray-700 ml-2">
                      {agg ? agg.avg_rating?.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({agg ? agg.approvals_total : 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {agg?.approval_rate_30d ? `${agg.approval_rate_30d.toFixed(1)}%` : "N/A"} Approval Rate
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Score: <span className="font-semibold">{agg?.ranking_score?.toFixed(1) || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {firm.website_url && (
                <Button variant="outline" asChild>
                  <a href={firm.website_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href={`/approvals/submit?firm=${firm.slug}`}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Submit Approval
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/denials/submit?firm=${firm.slug}`}>
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Submit Denial
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}