"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useAnimatedCounter } from "@/hooks/use-animated-counter"

interface AnimatedCounterProps {
  value: number
  label: string
  color: string
  borderColor: string
}

export function AnimatedCounter({ value, label, color, borderColor }: AnimatedCounterProps) {
  // Removed isClient state and useEffect
  const animatedValue = useAnimatedCounter(value, 800)

  // Removed if (!isClient) return (...) block

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`glass rounded-lg p-4 ${borderColor}`}
    >
      <div className={`text-2xl font-bold ${color}`}>{animatedValue}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </motion.div>
  )
}