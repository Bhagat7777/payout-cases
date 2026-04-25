"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Search, TrendingUp, ShieldCheck, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/home/Navbar";
import { AppWrapper } from "@/components/AppWrapper";
import { createBrowserClient } from "@/lib/supabase/client";

export default function ExploreFirmsPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFirms() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("firms")
        .select(`
          *,
          firms_agg (
            approvals_total,
            denials_total,
            approval_rate_30d,
            ranking_score
          )
        `);
      
      if (data) {
        // Filter: Only show firms with at least one approval
        const approvedFirms = data.filter(f => {
          const agg = Array.isArray(f.firms_agg) ? f.firms_agg[0] : f.firms_agg;
          return (agg?.approvals_total || 0) > 0;
        });
        setFirms(approvedFirms);
      }
      setIsLoading(false);
    }
    loadFirms();
  }, []);

  const filteredFirms = firms.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppWrapper>
      <div className="min-h-screen bg-[#0B0F17]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-[#E6E7EB] mb-4">
              Explore <span className="text-[#7C5CFF]">Paying Firms</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              We only list prop firms that have at least one verified payout approval on our platform.
            </p>
          </motion.div>

          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input 
              placeholder="Search verified firms..." 
              className="pl-12 bg-white/5 border-white/10 text-white h-14 text-lg rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFirms.map((firm, index) => {
                const agg = Array.isArray(firm.firms_agg) ? firm.firms_agg[0] : firm.firms_agg;
                return (
                  <motion.div
                    key={firm.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Link href={`/firms/${firm.slug}`}>
                      <Card className="glass border-white/10 hover:border-[#7C5CFF]/50 transition-all duration-500 group h-full">
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#7C5CFF]/30 transition-colors">
                              {firm.logo_url ? (
                                <img src={firm.logo_url} alt={firm.name} className="w-10 h-10 object-contain" />
                              ) : (
                                <Building2 className="w-8 h-8 text-gray-500" />
                              )}
                            </div>
                            <Badge className="bg-[#00D1B2]/10 text-[#00D1B2] border-[#00D1B2]/20 px-3 py-1">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Approved Firm
                            </Badge>
                          </div>

                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#7C5CFF] transition-colors">
                            {firm.name}
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                              <div className="text-xs text-gray-500 uppercase mb-1">Approvals</div>
                              <div className="text-xl font-bold text-green-400">{agg?.approvals_total || 0}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                              <div className="text-xs text-gray-500 uppercase mb-1">Ratio</div>
                              <div className="text-xl font-bold text-blue-400">{agg?.approval_rate_30d?.toFixed(1)}%</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center">
                              <Award className="w-4 h-4 mr-1 text-yellow-500" />
                              Score: {agg?.ranking_score?.toFixed(1)}
                            </div>
                            <div className="flex items-center group-hover:text-white transition-colors">
                              View Details
                              <TrendingUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppWrapper>
  );
}