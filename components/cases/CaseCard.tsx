"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Star, Calendar, ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { ProofViewer } from "./ProofViewer";

interface CaseCardProps {
  caseItem: any;
  index: number;
}

export function CaseCard({ caseItem, index }: CaseCardProps) {
  const [isProofOpen, setIsProofOpen] = useState(false);
  const isApproval = caseItem.type === "approval";
  
  const glowClass = isApproval 
    ? "hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] border-green-500/20" 
    : "hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] border-red-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`glass overflow-hidden transition-all duration-300 ${glowClass}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                {caseItem.firms?.logo_url ? (
                  <img src={caseItem.firms.logo_url} alt={caseItem.firms.name} className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-xs font-bold">{caseItem.firms?.name?.[0]}</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-[#E6E7EB]">{caseItem.firms?.name}</h3>
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {caseItem.payout_date ? format(new Date(caseItem.payout_date), "MMM dd, yyyy") : "N/A"}
                </div>
              </div>
            </div>
            <Badge className={isApproval ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
              {isApproval ? "Verified Approval" : "Payout Denied"}
            </Badge>
          </div>

          <div className="mb-4">
            <div className={`text-2xl font-bold mb-1 ${isApproval ? "text-green-400" : "text-red-400"}`}>
              {caseItem.amount || "N/A"}
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">{caseItem.title || caseItem.notes}</p>
          </div>

          {caseItem.evidence_urls?.[0] && (
            <div 
              className="relative group cursor-pointer mb-4 rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/20"
              onClick={() => setIsProofOpen(true)}
            >
              <img 
                src={caseItem.evidence_urls[0]} 
                alt="Proof" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <Button variant="secondary" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Proof
                </Button>
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-500/80 text-white border-none text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified Proof
                </Badge>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < (caseItem.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-600"}`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              ID: {caseItem.id.substring(0, 8)}
            </span>
          </div>
        </CardContent>
      </Card>

      <ProofViewer 
        isOpen={isProofOpen} 
        onClose={() => setIsProofOpen(false)} 
        imageUrl={caseItem.evidence_urls?.[0]} 
      />
    </motion.div>
  );
}