"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle, XCircle, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProofViewer } from "./ProofViewer";

interface CaseCardProps {
  id: string;
  type: "approval" | "denial";
  firmName: string;
  firmLogo?: string;
  payoutAmount: number;
  payoutDate: string;
  proofUrl?: string;
  rating?: number;
  verified: boolean;
  rejectionReason?: string;
  index?: number;
}

export function CaseCard({
  id,
  type,
  firmName,
  firmLogo,
  payoutAmount,
  payoutDate,
  proofUrl,
  rating,
  verified,
  rejectionReason,
  index = 0,
}: CaseCardProps) {
  const isApproval = type === "approval";
  const themeColor = isApproval ? "from-green-600/20 to-blue-600/20" : "from-red-600/20 to-orange-600/20";
  const borderColor = isApproval ? "border-green-500/30" : "border-red-500/30";
  const glowColor = isApproval ? "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]";
  const IconComp = isApproval ? CheckCircle : XCircle;
  const iconColor = isApproval ? "text-green-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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

        <div className="p-6 space-y-4">
          {/* Header: Firm + Status Badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {firmLogo && (
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={firmLogo} alt={firmName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{firmName}</h3>
                <p className="text-xs text-slate-400">{format(new Date(payoutDate), "MMM dd, yyyy")}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComp className={`w-6 h-6 ${iconColor}`} />
            </motion.div>
          </div>

          {/* Amount - Highlighted */}
          <div className="py-3 px-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Payout Amount</p>
            <p className={`text-2xl font-bold ${isApproval ? "text-green-400" : "text-red-400"}`}>
              ${payoutAmount.toLocaleString()}
            </p>
          </div>

          {/* Rating (if applicable) */}
          {rating && rating > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Rating:</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Proof */}
          {proofUrl && (
            <div>
              <p className="text-xs text-slate-400 mb-2">Proof Screenshot</p>
              <ProofViewer
                imageUrl={proofUrl}
                verified={verified}
                firmName={firmName}
              />
            </div>
          )}

          {/* Rejection Reason (for denials) */}
          {!isApproval && rejectionReason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-slate-400 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-300">{rejectionReason}</p>
            </div>
          )}

          {/* Footer: Verified Badge */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">ID: {id.slice(0, 8)}</div>
            {verified && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                ✓ Verified
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
