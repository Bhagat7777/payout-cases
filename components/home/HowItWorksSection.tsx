"use client"

import { motion } from "framer-motion"

export function HowItWorksSection() {
  const steps = [
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
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Simple steps to share your experience and help the trading community
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-300 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}