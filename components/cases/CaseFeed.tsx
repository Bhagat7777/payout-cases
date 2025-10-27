"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Search,
  Building2,
  TrendingUp,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseFeedProps {
  type: "approval" | "denial";
}

export function CaseFeed({ type }: CaseFeedProps) {
  const isApproval = type === "approval";
  const title = isApproval ? "Payout Approvals" : "Payout Denials";
  const description = isApproval ? "Real-time feed of successful payouts" : "Real-time feed of denied payouts";
  const icon = isApproval ? CheckCircle : XCircle;
  const gradientFrom = isApproval ? "#22C55E" : "#EF4444";
  const gradientTo = isApproval ? "#00D1B2" : "#7C5CFF";
  const badgeColor = isApproval ? "#22C55E" : "#EF4444";
  const submitPath = isApproval ? "/approvals/submit" : "/denials/submit";

  const Icon = icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#E6E7EB" }}>
                  {title}
                </h1>
                <p className="text-gray-400">{description}</p>
              </div>
            </div>

            <Link href={submitPath}>
              <Button
                className="hover:opacity-90 text-white"
                style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit {isApproval ? "Approval" : "Denial"}
              </Button>
            </Link>
          </div>

          <div className="text-center py-20">
            <Icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#E6E7EB] mb-2">Feature Coming Soon</h3>
            <p className="text-gray-400 mb-6">This feature is currently under development.</p>
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}