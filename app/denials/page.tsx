"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, XCircle, TrendingDown, Plus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useSocket } from "@/components/providers/socket-provider";

// Mock data structure - replace with actual API response
interface Denial {
  id: string;
  traderName: string;
  propFirm: string;
  reason: string;
  date: string;
  amount: number;
  status: "resolved" | "pending" | "disputed";
}

// Mock data - replace with actual API endpoint
const mockDenials: Denial[] = [
  {
    id: "1",
    traderName: "Sam Thompson",
    propFirm: "FTMO",
    reason: "Rule violation",
    date: "2023-06-12",
    amount: 2500,
    status: "resolved"
  },
  {
    id: "2",
    traderName: "Emma Rodriguez",
    propFirm: "MyForexFunds",
    reason: "Platform issue",
    date: "2023-06-10",
    amount: 1800,
    status: "pending"
  },
  {
    id: "3",
    traderName: "Michael Chen",
    propFirm: "FundedNext",
    reason: "Documentation missing",
    date: "2023-06-08",
    amount: 3200,
    status: "disputed"
  }
];

export default function PayoutDenialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [denials, setDenials] = useState<Denial[]>(mockDenials);
  const [newItems, setNewItems] = useState<Set<string>>(new Set());
  const { socket, isConnected } = useSocket();
  
  // Filter denials based on search and date range
  const filteredDenials = denials?.filter(denial => {
    const matchesSearch = 
      denial.traderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denial.propFirm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denial.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = 
      (!dateRange.start || denial.date >= dateRange.start) &&
      (!dateRange.end || denial.date <= dateRange.end);
    
    return matchesSearch && matchesDateRange;
  }) || [];

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on("denialUpdate", (newDenial: Denial) => {
      setDenials(prev => [newDenial, ...prev]);
      setNewItems(prev => new Set(prev).add(newDenial.id));
      
      // Remove highlight after 5 seconds
      setTimeout(() => {
        setNewItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(newDenial.id);
          return newSet;
        });
      }, 5000);
    });

    return () => {
      socket.off("denialUpdate");
    };
  }, [socket]);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Resolved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case "disputed":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Disputed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payout Denials</h1>
              <p className="text-slate-400">
                {denials?.length || 0} denials reported this week
                {isConnected && (
                  <span className="ml-2 flex items-center">
                    <span className="flex w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Live
                  </span>
                )}
              </p>
            </div>
            <Link href="/submit/denial">
              <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Submit Denial
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by trader name, prop firm, or reason..."
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="date"
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="date"
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Denials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 px-4 text-left text-slate-400 font-medium">Trader</th>
                      <th className="py-3 px-4 text-left text-slate-400 font-medium">Prop Firm</th>
                      <th className="py-3 px-4 text-left text-slate-400 font-medium">Reason</th>
                      <th className="py-3 px-4 text-left text-slate-400 font-medium">Amount</th>
                      <th className="py-3 px-4 text-left text-slate-400 font-medium">Date</th>
                      <th className="py-3 px-4 text-left text-slate-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredDenials.map((denial) => (
                        <motion.tr
                          key={denial.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`border-b border-slate-700 hover:bg-slate-700/30 ${
                            newItems.has(denial.id) ? "bg-red-500/10 animate-pulse" : ""
                          }`}
                        >
                          <td className="py-4 px-4 text-white">{denial.traderName}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                                <span className="text-xs font-bold text-slate-300">
                                  {denial.propFirm.substring(0, 2)}
                                </span>
                              </div>
                              <span className="text-white">{denial.propFirm}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-300 max-w-xs truncate">{denial.reason}</td>
                          <td className="py-4 px-4 text-red-400 font-medium">
                            ${denial.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-slate-300">
                            {format(new Date(denial.date), "MMM dd, yyyy")}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={denial.status} />
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {filteredDenials.length === 0 && (
                <div className="text-center py-12">
                  <TrendingDown className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No denials found matching your criteria</p>
                  <Link href="/submit/denial">
                    <Button variant="outline" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Submit First Denial
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}