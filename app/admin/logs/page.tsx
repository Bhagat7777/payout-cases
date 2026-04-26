import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Clock, User, FileText } from "lucide-react"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function AdminLogsPage() {
  const supabase = await createServerClient()
  
  const { data: logs } = await (supabase as SupabaseClient)
    .from("moderation_events")
    .select("*, cases(title, type), profiles:actor(username)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Audit Logs</h1>
        <p className="text-gray-400">Complete history of moderation and administrative actions.</p>
      </div>

      <Card className="glass border-white/10 overflow-hidden">
        <div className="space-y-0">
          {logs?.map((log, index) => (
            <div 
              key={log.id} 
              className={cn(
                "p-6 flex items-start space-x-4 hover:bg-white/5 transition-colors",
                index !== logs.length - 1 && "border-b border-white/5"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                log.action === "published" ? "bg-green-500/10" : 
                log.action === "rejected" ? "bg-red-500/10" : "bg-blue-500/10"
              )}>
                <ShieldAlert className={cn(
                  "w-5 h-5",
                  log.action === "published" ? "text-green-400" : 
                  log.action === "rejected" ? "text-red-400" : "text-blue-400"
                )} />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">
                    Case <span className="capitalize font-bold">{log.action}</span>
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {log.cases?.title || "Untitled Case"}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {log.profiles?.username || "System"}
                  </div>
                </div>

                {log.reason && (
                  <div className="mt-2 p-3 bg-white/5 rounded-lg text-xs text-gray-500 italic">
                    Reason: {log.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!logs || logs.length === 0) && (
            <div className="p-12 text-center text-gray-500">
              No audit logs found.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}