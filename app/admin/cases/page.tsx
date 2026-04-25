import { createServerClient } from "@/lib/supabase/server"
import { ModerationTable } from "@/components/admin/ModerationTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function ModerationQueuePage() {
  const supabase = await createServerClient()
  
  const { data: pendingCases } = await (supabase as SupabaseClient)
    .from("cases")
    .select("*, firms(name)")
    .eq("workflow_status", "submitted")
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Moderation Queue</h1>
        <p className="text-gray-400">Review and verify payout submissions before they go live.</p>
      </div>

      <Card className="glass border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/5">
          <CardTitle className="text-white text-lg">Pending Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ModerationTable initialCases={pendingCases || []} />
        </CardContent>
      </Card>
    </div>
  )
}