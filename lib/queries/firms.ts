import { SupabaseClient } from "@supabase/supabase-js"

export async function getFirms(supabase: SupabaseClient, onlyApproved = false) {
  let query = supabase
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

export async function getFirmBySlug(supabase: SupabaseClient, slug: string) {
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

  if (error) return null
  return firm
}