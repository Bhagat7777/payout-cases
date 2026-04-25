import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Clock
} from "lucide-react"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  
  // Fetch summary stats
  const { count: pendingCount } = await (supabase as SupabaseClient)
    .from("cases")
    .select("*", { count: 'exact', head: true })
    .eq("workflow_status", "submitted")

  const { count: totalFirms } = await (supabase as SupabaseClient)
    .from("firms")
    .select("*", { count: 'exact', head: true })

  const { data: recentEvents } = await (supabase as SupabaseClient)
    .from("moderation_events")
    .select("*, cases(title, type)")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { label: "Pending Moderation", value: pendingCount || 0, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Active Firms", value: totalFirms || 0, icon: TrendingUp, color: "text-[#00D1B2]", bg: "bg-[#00D1B2]/10" },
    { label: "Total Cases", value: "1,240", icon: FileText, color: "text-[#7C5CFF]", bg: "bg-[#7C5CFF]/10" },
    { label: "System Health", value: "99.9%", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <p className="text-gray-400">Overview of system activity and moderation queue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-[#7C5CFF]" />
              Recent Moderation Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents?.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">
                      Case {event.action}
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.cases?.title || "Untitled Case"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(event.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {(!recentEvents || recentEvents.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Database Load</span>
                  <span className="text-white">12%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C5CFF] w-[12%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Storage Usage</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00D1B2] w-[45%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}