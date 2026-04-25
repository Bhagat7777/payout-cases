"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Database } from "@/lib/supabase/types"

type Case = Database["public"]["Tables"]["cases"]["Row"] & {
  firms: {
    name: string
    slug: string
    logo_url: string | null
  } | null
}

interface CaseCardProps {
  caseItem: Case
  index: number
}

export function CaseCard({ caseItem, index }: CaseCardProps) {
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
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Badge
                variant={caseItem.type === "approval" ? "default" : "destructive"}
                className={
                  caseItem.type === "approval"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }
              >
                {caseItem.type === "approval" ? "Approval" : "Denial"}
              </Badge>
              <div className="flex items-center space-x-1">{renderStars(caseItem.rating)}</div>
            </div>
            <div className="text-sm text-gray-500">
              {caseItem.payout_date ? new Date(caseItem.payout_date).toLocaleDateString() : "N/A"}
            </div>
          </div>

          {caseItem.title && <h3 className="font-semibold text-gray-900 mb-2">{caseItem.title}</h3>}

          {caseItem.notes && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{caseItem.notes}</p>}

          {caseItem.evidence_urls && caseItem.evidence_urls.length > 0 && (
            <div className="flex space-x-2 mb-4">
              {caseItem.evidence_urls.slice(0, 3).map((url, i) => (
                <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={url || "/placeholder.svg"} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
              {caseItem.evidence_urls.length > 3 && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                  +{caseItem.evidence_urls.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Published {caseItem.published_at ? new Date(caseItem.published_at).toLocaleDateString() : "N/A"}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}