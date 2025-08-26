import { createServerClient } from "@/lib/supabase/server"
import { createBrowserClient } from "@/lib/supabase/client"

export async function getFirms() {
  const supabase = createServerClient()

  const { data: firms, error } = await supabase
    .from("firms")
    .select(`
      *,
      firms_agg (
        approvals_30d,
        denials_30d,
        avg_rating,
        approval_rate_30d,
        ranking_score
      )
    `)
    .order("name")

  if (error) {
    console.error("Error fetching firms:", error)
    return []
  }

  return firms || []
}

export async function getFirmBySlug(slug: string) {
  const supabase = createServerClient()

  const { data: firm, error } = await supabase
    .from("firms")
    .select(`
      *,
      firms_agg (
        approvals_7d,
        approvals_30d,
        approvals_total,
        denials_7d,
        denials_30d,
        denials_total,
        avg_rating,
        approval_rate_30d,
        ranking_score
      )
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching firm:", error)
    return null
  }

  return firm
}

export async function getFirmCases(firmId: string, type?: "approval" | "denial", limit = 20) {
  const supabase = createServerClient()

  let query = supabase
    .from("cases")
    .select(`
      *,
      firms (name, slug, logo_url)
    `)
    .eq("firm_id", firmId)
    .eq("workflow_status", "published")
    .order("published_at", { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq("type", type)
  }

  const { data: cases, error } = await query

  if (error) {
    console.error("Error fetching firm cases:", error)
    return []
  }

  return cases || []
}

export function subscribeToFirmUpdates(callback: (payload: any) => void) {
  const supabase = createBrowserClient()

  const subscription = supabase
    .channel("firms_agg_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "firms_agg",
      },
      callback,
    )
    .subscribe()

  return subscription
}
