import { createServerClient } from "@/lib/supabase/server"
import { createBrowserClient } from "@/lib/supabase/client"
import { SupabaseClient } from "@supabase/supabase-js"

export async function getFirms(onlyApproved = false) {
  const supabase = await createServerClient()

  let query = (supabase as SupabaseClient)
    .from("firms")
    .select(`
      *,
      firms_agg (
        approvals_30d,
        denials_30d,
        approvals_total,
        denials_total,
        avg_rating,
        approval_rate_30d,
        ranking_score
      )
    `)
    .order("name")

  const { data: firms, error } = await query

  if (error) {
    console.error("Error fetching firms:", error)
    return []
  }

  if (onlyApproved) {
    return firms.filter(f => {
      const agg = Array.isArray(f.firms_agg) ? f.firms_agg[0] : f.firms_agg;
      return (agg?.approvals_total || 0) > 0;
    });
  }

  return firms || []
}

export async function getFirmBySlug(slug: string) {
  const supabase = await createServerClient()
  const { data: firm, error } = await (supabase as SupabaseClient)
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

  if (error) return null
  return firm
}