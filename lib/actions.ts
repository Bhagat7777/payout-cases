"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitCase(formData: FormData) {
  const supabase = createServerClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const firmId = formData.get("firmId") as string
  const type = formData.get("type") as "approval" | "denial"
  const payoutDate = formData.get("payoutDate") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const title = formData.get("title") as string
  const notes = formData.get("notes") as string
  const amount = formData.get("amount") as string

  // Handle file uploads
  const files = formData.getAll("files") as File[]
  const evidenceUrls: string[] = []

  for (const file of files) {
    if (file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("evidence")
        .upload(`private/${fileName}`, file)

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`)
      }

      evidenceUrls.push(uploadData.path)
    }
  }

  // Insert case
  const { data, error } = await supabase
    .from("cases")
    .insert({
      firm_id: firmId,
      type,
      payout_date: payoutDate,
      rating,
      title: title || null,
      notes: notes || null,
      evidence_urls: evidenceUrls,
      submitted_by: user.id,
      workflow_status: "submitted",
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to submit case: ${error.message}`)
  }

  // Create moderation event
  await supabase.from("moderation_events").insert({
    case_id: data.id,
    action: "submitted",
    actor: user.id,
  })

  revalidatePath(`/${type}s`)
  redirect(`/${type}s?highlight=${data.id}`)
}

export async function getFirms() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("firms").select("id, name, slug, logo_url").order("name")

  if (error) {
    throw new Error(`Failed to fetch firms: ${error.message}`)
  }

  return data
}

export async function getFirmsWithStats() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("firms")
    .select(`
      id,
      name,
      slug,
      logo_url,
      website,
      country,
      description,
      firms_agg (
        approvals_total,
        denials_total,
        approvals_7d,
        denials_7d,
        approvals_30d,
        denials_30d,
        avg_rating,
        approval_rate_30d,
        ranking_score
      )
    `)
    .order("firms_agg.ranking_score", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch firms with stats: ${error.message}`)
  }

  return data
}

export async function getFirmBySlug(slug: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("firms")
    .select(`
      *,
      firms_agg (
        approvals_total,
        denials_total,
        approvals_7d,
        denials_7d,
        approvals_30d,
        denials_30d,
        avg_rating,
        approval_rate_30d,
        ranking_score
      )
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    throw new Error(`Failed to fetch firm: ${error.message}`)
  }

  return data
}

export async function getCases(type?: "approval" | "denial", firmId?: string, limit = 20, offset = 0) {
  const supabase = createServerClient()

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

  if (firmId) {
    query = query.eq("firm_id", firmId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch cases: ${error.message}`)
  }

  return data
}

export async function getGlobalStats() {
  const supabase = createServerClient()

  // Get total counts
  const { data: totalStats, error: totalError } = await supabase
    .from("cases")
    .select("type, rating")
    .eq("workflow_status", "published")

  if (totalError) {
    throw new Error(`Failed to fetch stats: ${totalError.message}`)
  }

  const approvals = totalStats.filter((c) => c.type === "approval")
  const denials = totalStats.filter((c) => c.type === "denial")
  const totalCases = totalStats.length
  const avgRating = totalStats.reduce((sum, c) => sum + c.rating, 0) / totalCases || 0

  return {
    totalApprovals: approvals.length,
    totalDenials: denials.length,
    totalCases,
    approvalRate: totalCases > 0 ? (approvals.length / totalCases) * 100 : 0,
    avgRating: Math.round(avgRating * 100) / 100,
  }
}