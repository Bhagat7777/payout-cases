"use client"

import { motion } from "framer-motion"
import { Shield, Users, TrendingUp, CheckCircle } from "lucide-react"

export function StatsSection() {
  const stats = [
    { label: "Prop Firms", value: "150+", icon: Shield, color: "#7C5CFF" },
    { label: "Total Reviews", value: "5,000+", icon: Users, color: "#00D1B2" },
    { label: "Payouts Tracked", value: "$2.5M+", icon: TrendingUp, color: "#22C55E" },
    { label: "Success Rate", value: "78%", icon: CheckCircle, color: "#22C55E" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 } as any}
            >
              <div className="mb-4 flex justify-center">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    boxShadow: `0 0 20px ${stat.color}30`,
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <motion.div
                className="text-3xl font-bold mb-1"
                style={{ color: "#E6E7EB" }}
                whileHover={{ scale: 1.1 } as any}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}