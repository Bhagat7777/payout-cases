"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle, XCircle } from "lucide-react"
import { ProofViewer } from "@/components/cases/ProofViewer"
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
  const isApproval = caseItem.type === "approval"
  const themeColor = isApproval ? "from-green-600/20 to-blue-600/20" : "from-red-600/20 to-orange-600/20"
  const borderColor = isApproval ? "border-green-500/30" : "border-red-500/30"
  const glowColor = isApproval ? "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
  const IconComp = isApproval ? CheckCircle : XCircle
  const iconColor = isApproval ? "text-green-400" : "text-red-400"

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
      />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className={`
          relative overflow-hidden border backdrop-blur-xl
          bg-gradient-to-br ${themeColor} ${borderColor} ${glowColor}
          transition-all duration-300
        `}
      >
        {/* Top accent line */}
        <div className={`h-1 w-full ${isApproval ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gradient-to-r from-red-500 to-orange-500"}`} />

        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant={isApproval ? "default" : "destructive"}
                className={
                  isApproval
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {isApproval ? "Approval" : "Denial"}
              </Badge>
              <div className="flex items-center space-x-1">{renderStars(caseItem.rating)}</div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComp className={`w-5 h-5 ${iconColor}`} />
            </motion.div>
          </div>

          <div className="text-xs text-slate-400">
            {caseItem.payout_date ? new Date(caseItem.payout_date).toLocaleDateString() : "N/A"}
          </div>

          {caseItem.title && <h3 className="font-semibold text-white">{caseItem.title}</h3>}

          {caseItem.notes && <p className="text-slate-300 text-sm">{caseItem.notes}</p>}

          {caseItem.evidence_urls && caseItem.evidence_urls.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2">Proof Screenshot</p>
              <ProofViewer
                imageUrl={caseItem.evidence_urls[0]}
                verified={caseItem.workflow_status === "published"}
                firmName={caseItem.firms?.name}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <div>Published {caseItem.published_at ? new Date(caseItem.published_at).toLocaleDateString() : "N/A"}</div>
            {caseItem.workflow_status === "published" && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                ✓ Verified
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}