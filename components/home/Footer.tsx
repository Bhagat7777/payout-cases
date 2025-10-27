import Link from "next/link"
import { TrendingUp } from "lucide-react"

export function Footer() {
  return (
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
  )
}