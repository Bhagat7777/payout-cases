import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await (supabase as SupabaseClient).auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await (supabase as SupabaseClient)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "moderator"].includes(profile.role || "")) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F17]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}