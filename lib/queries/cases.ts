import { createBrowserClient } from "@/lib/supabase/client"
import { SupabaseClient } from "@supabase/supabase-js"

export async function getCasesByType(supabase: any, type: "approval" | "denial", limit = 20, offset = 0) {
  // First fetch case rows (without nested relationship selects)
  const { data: casesData, error: casesError } = await (supabase as SupabaseClient)
    .from("cases")
    .select(`id, firm_id, type, payout_date, rating, title, notes, evidence_urls, submitted_by, workflow_status, created_at, published_at`)
    .eq("workflow_status", "published")
    .eq("type", type)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (casesError) {
    console.error("Error fetching cases:", casesError)
    throw casesError
  }

  const cases = (casesData || []) as any[]

  // If there are no cases, return empty array early
  if (!cases.length) return []

  // Collect unique firm_ids from cases
  const firmIds = Array.from(new Set(cases.map((c) => c.firm_id).filter(Boolean)))

  // Fetch firm metadata separately
  const { data: firmsData, error: firmsError } = await (supabase as SupabaseClient)
    .from("firms")
    .select(`id, name, slug, logo_url`)
    .in("id", firmIds)

  if (firmsError) {
    console.error("Error fetching firms for cases:", firmsError)
    throw firmsError
  }

  const firmsById = (firmsData || []).reduce((acc: Record<string, any>, f: any) => {
    acc[f.id] = f
    return acc
  }, {})

  // Attach firm metadata to each case as `firms` to match previous shape
  const merged = cases.map((c) => ({ ...c, firms: firmsById[c.firm_id] || null }))

  return merged
}

export async function getCaseById(id: string) {
  const supabase = createBrowserClient()

  const { data, error } = await (supabase as SupabaseClient)
    .from("cases")
    .select(`
      *,
      firms (name, slug, logo_url)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching case:", error)
    throw error
  }

  return data
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