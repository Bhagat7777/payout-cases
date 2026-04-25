"use client";

import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FirmsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-[#E6E7EB] mb-4">Prop Firm Directory</h1>
          <p className="text-gray-400 mb-6">Browse and compare prop trading firms</p>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#E6E7EB] mb-2">Feature Coming Soon</h3>
            <p className="text-gray-400 mb-6">This feature is currently under development.</p>
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}