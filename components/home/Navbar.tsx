"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
            <Link href="/auth/login">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] hover:opacity-90 text-white">
                Sign Up
              </Button>
            </Link>
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
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] hover:opacity-90 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
