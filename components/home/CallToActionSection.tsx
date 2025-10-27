"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CallToActionSection() {
  return (
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
  )
}