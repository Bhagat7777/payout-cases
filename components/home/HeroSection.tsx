"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "@/components/home/AnimatedCounter"

export function HeroSection() {
  const [liveStats, setLiveStats] = useState({
    todayApprovals: 23,
    todayDenials: 7,
    weekApprovals: 156,
    weekDenials: 42,
    monthApprovals: 687,
    monthDenials: 198,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  if (!isClient) {
    return (
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/10 via-transparent to-[#00D1B2]/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full mr-2"></div>
              Live Tracking • 10,000+ Traders
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ color: "#E6E7EB" }}>
            Real-Time
            <span className="bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] bg-clip-text text-transparent">
              {" "}
              Prop Firm
            </span>
            <br />
            Payout Tracking
          </h1>

          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              <div className="glass rounded-lg p-4 border-[#22C55E]/20">
                <div className="text-2xl font-bold text-[#22C55E]">0</div>
                <div className="text-xs text-gray-400">Today Approvals</div>
              </div>
              <div className="glass rounded-lg p-4 border-[#EF4444]/20">
                <div className="text-2xl font-bold text-[#EF4444]">0</div>
                <div className="text-xs text-gray-400">Today Denials</div>
              </div>
              <div className="glass rounded-lg p-4 border-[#22C55E]/20">
                <div className="text-2xl font-bold text-[#22C55E]">0</div>
                <div className="text-xs text-gray-400">7d Approvals</div>
              </div>
              <div className="glass rounded-lg p-4 border-[#EF4444]/20">
                <div className="text-2xl font-bold text-[#EF4444]">0</div>
                <div className="text-xs text-gray-400">7d Denials</div>
              </div>
              <div className="glass rounded-lg p-4 border-[#22C55E]/20">
                <div className="text-2xl font-bold text-[#22C55E]">0</div>
                <div className="text-xs text-gray-400">30d Approvals</div>
              </div>
              <div className="glass rounded-lg p-4 border-[#EF4444]/20">
                <div className="text-2xl font-bold text-[#EF4444]">0</div>
                <div className="text-xs text-gray-400">30d Denials</div>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track real payout approvals and denials across forex prop firms. Submit evidence, read verified reviews,
            and make informed decisions about your trading career.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/approvals">
              <Button size="lg" className="bg-gradient-to-r from-[#22C55E] to-[#00D1B2] text-lg px-8 py-6 text-white">
                <CheckCircle className="mr-2 w-5 h-5" />
                Payout Approvals
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/denials">
              <Button size="lg" className="bg-gradient-to-r from-[#EF4444] to-[#7C5CFF] text-lg px-8 py-6 text-white">
                <XCircle className="mr-2 w-5 h-5" />
                Payout Denials
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/approvals/submit">
              <Button variant="outline" className="border-[#22C55E]/30 text-[#22C55E]">
                <Plus className="mr-2 w-4 h-4" />
                Submit Approval
              </Button>
            </Link>
            <Link href="/denials/submit">
              <Button variant="outline" className="border-[#EF4444]/30 text-[#EF4444]">
                <Plus className="mr-2 w-4 h-4" />
                Submit Denial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/10 via-transparent to-[#00D1B2]/10 animate-gradient"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-20 right-20 w-72 h-72 bg-[#7C5CFF]/20 rounded-full blur-3xl animate-float"
      />
      <div 
        className="absolute bottom-20 left-20 w-96 h-96 bg-[#00D1B2]/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 hover:bg-[#22C55E]/20 transition-colors">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full mr-2 animate-pulse" />
            Live Tracking • 10,000+ Traders
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          style={{ color: "#E6E7EB" }}
        >
          Real-Time
          <span className="bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] bg-clip-text text-transparent animate-gradient">
            {" "}
            Prop Firm
          </span>
          <br />
          Payout Tracking
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            <AnimatedCounter 
              value={liveStats.todayApprovals} 
              label="Today Approvals" 
              color="text-[#22C55E]" 
              borderColor="border-[#22C55E]/20" 
            />
            <AnimatedCounter 
              value={liveStats.todayDenials} 
              label="Today Denials" 
              color="text-[#EF4444]" 
              borderColor="border-[#EF4444]/20" 
            />
            <AnimatedCounter 
              value={liveStats.weekApprovals} 
              label="7d Approvals" 
              color="text-[#22C55E]" 
              borderColor="border-[#22C55E]/20" 
            />
            <AnimatedCounter 
              value={liveStats.weekDenials} 
              label="7d Denials" 
              color="text-[#EF4444]" 
              borderColor="border-[#EF4444]/20" 
            />
            <AnimatedCounter 
              value={liveStats.monthApprovals} 
              label="30d Approvals" 
              color="text-[#22C55E]" 
              borderColor="border-[#22C55E]/20" 
            />
            <AnimatedCounter 
              value={liveStats.monthDenials} 
              label="30d Denials" 
              color="text-[#EF4444]" 
              borderColor="border-[#EF4444]/20" 
            />
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Track real payout approvals and denials across forex prop firms. Submit evidence, read verified reviews,
          and make informed decisions about your trading career.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Link href="/approvals">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#22C55E] to-[#00D1B2] hover:opacity-90 text-lg px-8 py-6 text-white group"
            >
              <CheckCircle className="mr-2 w-5 h-5" />
              Payout Approvals
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/denials">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#EF4444] to-[#7C5CFF] hover:opacity-90 text-lg px-8 py-6 text-white group"
            >
              <XCircle className="mr-2 w-5 h-5" />
              Payout Denials
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-2 justify-center"
        >
          <Link href="/approvals/submit">
            <Button
              variant="outline"
              className="border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10 bg-transparent"
            >
              <Plus className="mr-2 w-4 h-4" />
              Submit Approval
            </Button>
          </Link>
          <Link href="/denials/submit">
            <Button
              variant="outline"
              className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 bg-transparent"
            >
              <Plus className="mr-2 w-4 h-4" />
              Submit Denial
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}