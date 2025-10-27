"use client"

import { motion } from "framer-motion"
import { FirmCard } from "@/components/firms/FirmCard"
import type { Firm } from "@/hooks/use-firm-filtering"

interface FirmGridProps {
  firms: Firm[]
}

export function FirmGrid({ firms }: FirmGridProps) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {firms.map((firm, index) => (
        <FirmCard key={firm.id} firm={firm} index={index} />
      ))}
    </motion.div>
  )
}