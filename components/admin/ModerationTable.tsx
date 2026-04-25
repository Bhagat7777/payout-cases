"use client"

import { useState } from "react"
import { 
  Check, 
  X, 
  Eye, 
  ExternalLink,
  MoreVertical,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateCaseStatus } from "@/lib/actions/admin"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModerationTable({ initialCases }: { initialCases: any[] }) {
  const [cases, setCases] = useState(initialCases)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleAction = async (id: string, action: "published" | "rejected") => {
    setIsProcessing(id)
    try {
      await updateCaseStatus(id, action)
      setCases(prev => prev.filter(c => c.id !== id))
      toast.success(`Case ${action === "published" ? "approved" : "rejected"} successfully`)
    } catch (error) {
      toast.error("Failed to update case status")
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Firm</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Evidence</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {cases.map((c) => (
            <tr key={c.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="text-xs font-bold text-gray-400">{c.firms?.name?.[0]}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{c.firms?.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge className={c.type === "approval" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}>
                  {c.type}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-white max-w-xs truncate">{c.title || "No title"}</div>
                <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className={cn("w-4 h-4", c.evidence_urls?.length > 0 ? "text-blue-400" : "text-gray-600")} />
                  <span className="text-xs text-gray-400">{c.evidence_urls?.length || 0} files</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                    onClick={() => handleAction(c.id, "published")}
                    disabled={isProcessing === c.id}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => handleAction(c.id, "rejected")}
                    disabled={isProcessing === c.id}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1f2e] border-white/10 text-white">
                      <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                        <ExternalLink className="w-4 h-4 mr-2" /> Open Evidence
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
          {cases.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                Queue is empty. All cases moderated.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}