import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Building2, Globe, ExternalLink, Edit2 } from "lucide-react"
import { SupabaseClient } from "@supabase/supabase-js"
import { FirmFormDialog } from "@/components/admin/FirmFormDialog"

export default async function AdminFirmsPage() {
  const supabase = await createServerClient()
  
  const { data: firms } = await (supabase as SupabaseClient)
    .from("firms")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Prop Firm Directory</h1>
          <p className="text-gray-400">Manage the firms listed on the platform.</p>
        </div>
        <FirmFormDialog>
          <Button className="bg-[#7C5CFF] hover:bg-[#6a4ee0] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Firm
          </Button>
        </FirmFormDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {firms?.map((firm) => (
          <Card key={firm.id} className="glass border-white/10 hover:border-[#7C5CFF]/30 transition-all group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {firm.logo_url ? (
                    <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <Building2 className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="flex space-x-2">
                  <FirmFormDialog firm={firm}>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </FirmFormDialog>
                  {firm.website_url && (
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5" asChild>
                      <a href={firm.website_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{firm.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <Globe className="w-3 h-3 mr-1" />
                {firm.slug}
              </p>
              
              <p className="text-sm text-gray-400 line-clamp-2 mb-6">
                {firm.description || "No description provided."}
              </p>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  Added {new Date(firm.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}