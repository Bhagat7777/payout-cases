import { SupabaseClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@/lib/supabase/client"

export async function getCases(supabase: SupabaseClient, type?: "approval" | "denial", limit = 20, offset = 0) {
  let query = supabase
    .from("cases")
    .select(`
      *,
      firms (name, slug, logo_url),
      profiles (handle)
    `)
    .eq("workflow_status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) {
    query = query.eq("type", type)
  }

  const { data: cases, error } = await query

  if (error) {
    console.error("Error fetching cases:", error)
    return []
  }

  return cases || []
}

export async function getCaseById(supabase: SupabaseClient, id: string) {
  const { data: case_, error } = await supabase
    .from("cases")
    .select(`
      *,
      firms (name, slug, logo_url, website),
      profiles (handle)
    `)
    .eq("id", id)
    .eq("workflow_status", "published")
    .single()

  if (error) {
    console.error("Error fetching case:", error)
    return null
  }

  return case_
}

export async function getCasesByType(supabase: SupabaseClient, type: "approval" | "denial", limit = 20, offset = 0) {
  const query = supabase
    .from("cases")
    .select(`
      *,
      firms (name, slug, logo_url),
      profiles (handle)
    `)
    .eq("workflow_status", "published")
    .eq("type", type)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  const { data: cases, error } = await query

  if (error) {
    console.error("Error fetching cases:", error)
    throw error
  }

  return cases || []
}

export function subscribeToCases(type: "approval" | "denial", callback: (payload: any) => void) {
  const supabase = createBrowserClient()

  const subscription = supabase
    .channel(`cases_${type}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "cases",
        filter: `type=eq.${type}`,
      },
      callback,
    )
    .subscribe()

  return subscription
}