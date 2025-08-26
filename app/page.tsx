"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
  Bell,
  Menu,
  X,
  ArrowRight,
  Plus,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [submitMenuOpen, setSubmitMenuOpen] = useState(false)
  const [liveStats, setLiveStats] = useState({
    todayApprovals: 23,
    todayDenials: 7,
    weekApprovals: 156,
    weekDenials: 42,
    monthApprovals: 687,
    monthDenials: 198,
  })

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        todayApprovals: prev.todayApprovals + Math.random() > 0.7 ? 1 : 0,
        todayDenials: prev.todayDenials + Math.random() > 0.9 ? 1 : 0,
      }))
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const counterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#E6E7EB" }}>
                Payout Cases
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/approvals" className="text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Approvals
              </Link>
              <Link href="/denials" className="text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Denials
              </Link>
              <Link href="/firms" className="text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Firms
              </Link>
              <Link href="/stats" className="text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Stats
              </Link>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Sign In
              </Button>

              <div className="relative">
                <Button
                  className="bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] hover:opacity-90 text-white flex items-center"
                  onClick={() => setSubmitMenuOpen(!submitMenuOpen)}
                >
                  Submit Case
                  <ChevronDown className="ml-2 w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {submitMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-lg border border-white/10 overflow-hidden"
                    >
                      <Link
                        href="/approvals/submit"
                        className="block px-4 py-3 text-[#22C55E] hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Approval
                        </div>
                      </Link>
                      <Link
                        href="/denials/submit"
                        className="block px-4 py-3 text-[#EF4444] hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center">
                          <XCircle className="w-4 h-4 mr-2" />
                          Submit Denial
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button className="md:hidden text-[#E6E7EB]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              <Link href="/approvals" className="block text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Approvals
              </Link>
              <Link href="/denials" className="block text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Denials
              </Link>
              <Link href="/firms" className="block text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Firms
              </Link>
              <Link href="/stats" className="block text-gray-300 hover:text-[#E6E7EB] transition-colors">
                Stats
              </Link>
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] hover:opacity-90 text-white">
                  Submit Case
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/10 via-transparent to-[#00D1B2]/10 animate-gradient"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-20 right-20 w-72 h-72 bg-[#7C5CFF]/20 rounded-full blur-3xl animate-float"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#00D1B2]/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div variants={containerVariants} initial="hidden" animate={isVisible ? "visible" : "hidden"}>
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 hover:bg-[#22C55E]/20 transition-colors">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full mr-2 animate-pulse" />
                Live Tracking • 10,000+ Traders
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
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

            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
                <motion.div variants={counterVariants} className="glass rounded-lg p-4 border border-[#22C55E]/20">
                  <div className="text-2xl font-bold text-[#22C55E]">{liveStats.todayApprovals}</div>
                  <div className="text-xs text-gray-400">Today Approvals</div>
                </motion.div>
                <motion.div variants={counterVariants} className="glass rounded-lg p-4 border border-[#EF4444]/20">
                  <div className="text-2xl font-bold text-[#EF4444]">{liveStats.todayDenials}</div>
                  <div className="text-xs text-gray-400">Today Denials</div>
                </motion.div>
                <motion.div variants={counterVariants} className="glass rounded-lg p-4 border border-[#22C55E]/20">
                  <div className="text-2xl font-bold text-[#22C55E]">{liveStats.weekApprovals}</div>
                  <div className="text-xs text-gray-400">7d Approvals</div>
                </motion.div>
                <motion.div variants={counterVariants} className="glass rounded-lg p-4 border border-[#EF4444]/20">
                  <div className="text-2xl font-bold text-[#EF4444]">{liveStats.weekDenials}</div>
                  <div className="text-xs text-gray-400">7d Denials</div>
                </motion.div>
                <motion.div variants={counterVariants} className="glass rounded-lg p-4 border border-[#22C55E]/20">
                  <div className="text-2xl font-bold text-[#22C55E]">{liveStats.monthApprovals}</div>
                  <div className="text-xs text-gray-400">30d Approvals</div>
                </motion.div>
                <motion.div variants={counterVariants} className="glass rounded-lg p-4 border border-[#EF4444]/20">
                  <div className="text-2xl font-bold text-[#EF4444]">{liveStats.monthDenials}</div>
                  <div className="text-xs text-gray-400">30d Denials</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track real payout approvals and denials across forex prop firms. Submit evidence, read verified reviews,
              and make informed decisions about your trading career.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2 justify-center">
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
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: "Prop Firms", value: "150+", icon: Shield, color: "#7C5CFF" },
              { label: "Total Reviews", value: "5,000+", icon: Users, color: "#00D1B2" },
              { label: "Payouts Tracked", value: "$2.5M+", icon: TrendingUp, color: "#22C55E" },
              { label: "Success Rate", value: "78%", icon: CheckCircle, color: "#22C55E" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center group"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
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
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Payout Cases?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get the transparency you need to make informed decisions about prop trading firms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Verified Reviews",
                description: "All reviews are verified and moderated to ensure authenticity and quality.",
                color: "emerald",
              },
              {
                icon: XCircle,
                title: "Payout Tracking",
                description: "Track both successful payouts and denials with detailed proof and documentation.",
                color: "red",
              },
              {
                icon: Search,
                title: "Advanced Filtering",
                description: "Filter reviews by firm, date range, rating, and payout amount to find what matters.",
                color: "blue",
              },
              {
                icon: Shield,
                title: "Anonymous Options",
                description: "Submit reviews anonymously to protect your identity while sharing your experience.",
                color: "purple",
              },
              {
                icon: Bell,
                title: "Real-time Updates",
                description: "Get notified when new reviews are posted for firms you follow.",
                color: "yellow",
              },
              {
                icon: TrendingUp,
                title: "Firm Analytics",
                description: "View comprehensive statistics and trends for each prop trading firm.",
                color: "indigo",
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-xl delay-${index * 100} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Simple steps to share your experience and help the trading community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Your Firm",
                description: "Search for your prop trading firm or add a new one if it doesn't exist yet.",
              },
              {
                step: "02",
                title: "Share Your Experience",
                description: "Submit a detailed review with proof of your payout approval or denial.",
              },
              {
                step: "03",
                title: "Help Others Decide",
                description: "Your verified review helps other traders make informed decisions.",
              },
            ].map((step, index) => (
              <div
                key={step.step}
                className={`text-center transition-all duration-700 delay-${index * 200} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Reviews Section */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Recent Reviews</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              See what traders are saying about their payout experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                firm: "FTMO",
                type: "approval",
                rating: 5,
                amount: "$2,500",
                comment: "Smooth payout process, received funds within 24 hours as promised. Great support team.",
                date: "2 days ago",
                anonymous: false,
              },
              {
                firm: "MyForexFunds",
                type: "denial",
                rating: 2,
                amount: "$1,200",
                comment: "Payout denied due to unclear rule violation. Poor communication from support.",
                date: "1 week ago",
                anonymous: true,
              },
            ].map((review, index) => (
              <Card
                key={index}
                className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-500 delay-${index * 200} ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.firm[0]}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{review.firm}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${
                              review.type === "approval"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {review.type === "approval" ? "Payout Approved" : "Payout Denied"}
                          </Badge>
                          <span className="text-slate-400 text-sm">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-white font-bold">{review.amount}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-3">{review.comment}</p>
                  <div className="text-sm text-slate-400">
                    {review.anonymous ? "Anonymous Review" : "Verified Trader"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#7C5CFF]/10 to-[#00D1B2]/10 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: "#E6E7EB" }}>
              Ready to Share Your Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of traders building transparency in the prop trading industry
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/approvals/submit">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#22C55E] to-[#00D1B2] hover:opacity-90 text-lg px-8 py-6 text-white"
                >
                  Submit Approval
                </Button>
              </Link>
              <Link href="/denials/submit">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#EF4444] to-[#7C5CFF] hover:opacity-90 text-lg px-8 py-6 text-white"
                >
                  Submit Denial
                </Button>
              </Link>
              <Link href="/firms">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-6 bg-transparent"
                >
                  Browse All Firms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#E6E7EB" }}>
                Payout Cases
              </span>
            </Link>
            <div className="flex items-center space-x-6 text-gray-400">
              <Link href="/about" className="hover:text-[#E6E7EB] transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-[#E6E7EB] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#E6E7EB] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[#E6E7EB] transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2024 Payout Cases. All rights reserved. Empowering traders with transparency.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
