"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Search, Shield, Bell, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const features = [
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
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Payout Cases?
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Get the transparency you need to make informed decisions about prop trading firms
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}