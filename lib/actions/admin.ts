"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { SupabaseClient } from "@supabase/supabase-js"

async function checkAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await (supabase as SupabaseClient).auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await (supabase as SupabaseClient)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "moderator"].includes(profile.role || "")) {
    throw new Error("Forbidden")
  }
  
  return { supabase, user }
}

export async function updateCaseStatus(caseId: string, status: "published" | "rejected", notes?: string) {
  const { supabase } = await checkAdmin()

  const updateData: any = { 
    workflow_status: status,
    updated_at: new Date().toISOString()
  }
  
  if (status === "published") {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await (supabase as SupabaseClient)
    .from("cases")
    .update(updateData)
    .eq("id", caseId)

  if (error) throw error

  // Log moderation event
  await (supabase as SupabaseClient).from("moderation_events").insert({
    case_id: caseId,
    action: status,
    reason: notes
  })

  revalidatePath("/admin/cases")
  revalidatePath("/approvals")
  revalidatePath("/denials")
}

export async function upsertFirm(formData: FormData) {
  const { supabase } = await checkAdmin()
  
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/ /g, "-")
  const website_url = formData.get("website_url") as string
  const description = formData.get("description") as string

  const firmData = {
    name,
    slug,
    website_url,
    description,
    updated_at: new Date().toISOString()
  }

  let error
  if (id) {
    const { error: updateError } = await (supabase as SupabaseClient)
      .from("firms")
      .update(firmData)
      .eq("id", id)
    error = updateError
  } else {
    const { error: insertError } = await (supabase as SupabaseClient)
      .from("firms")
      .insert(firmData)
    error = insertError
  }

  if (error) throw error
  
  revalidatePath("/admin/firms")
  revalidatePath("/firms")
}