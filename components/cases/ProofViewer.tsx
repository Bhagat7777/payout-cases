"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProofViewerProps {
  imageUrl: string;
  verified?: boolean;
  firmName?: string;
}

export function ProofViewer({ imageUrl, verified = false, firmName }: ProofViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Thumbnail */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group cursor-pointer overflow-hidden rounded-lg"
        onClick={() => setIsExpanded(true)}
      >
        <div className="relative w-full h-32 bg-slate-700 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt="Payout proof"
            fill
            className="object-cover"
            onLoadingComplete={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>

          {/* Verified badge */}
          {verified && (
            <div className="absolute top-2 right-2 bg-green-500/90 px-2 py-1 rounded text-xs font-semibold text-white flex items-center gap-1">
              ✓ Verified
            </div>
          )}
        </div>
      </motion.div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute -top-12 right-0 text-white hover:bg-white/10"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Image container */}
              <div className="relative flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Payout proof full view"
                  fill
                  className="object-contain"
                  quality={95}
                />
              </div>

              {/* Footer with watermark info */}
              <div className="mt-4 flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div>
                  <p className="text-sm text-slate-300">
                    {firmName && <span className="text-white font-semibold">{firmName}</span>}
                    {firmName && " — "}
                    Verified by PayoutCases
                  </p>
                  <p className="text-xs text-slate-500">All proofs undergo admin verification before publication</p>
                </div>
                {verified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
