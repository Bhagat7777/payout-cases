"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function ReviewsSection() {
  const reviews = [
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
  ]

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Recent Reviews
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            See what traders are saying about their payout experiences
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-500">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}