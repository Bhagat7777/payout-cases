"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function submitCase(formData: FormData) {
  const supabase = await createServerClient()

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
  const files = formData.getAll("files") as File[]

  // Upload evidence files
  const evidenceUrls: string[] = []
  for (const file of files) {
    if (file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("evidence")
        .upload(`private/${fileName}`, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        continue
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

  // Revalidate relevant pages
  revalidatePath("/approvals")
  revalidatePath("/denials")
  revalidatePath("/admin")

  // Redirect to appropriate review page
  redirect(type === "approval" ? "/approvals" : "/denials")
}

export async function publishCase(caseId: string) {
  const supabase = await createServerClient()

  // Get current user and check if moderator/admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["moderator", "admin"].includes(profile.role)) {
    throw new Error("Insufficient permissions")
  }

  // Update case status
  const { error } = await supabase
    .from("cases")
    .update({
      workflow_status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", caseId)

  if (error) {
    throw new Error(`Failed to publish case: ${error.message}`)
  }

  // Revalidate pages
  revalidatePath("/approvals")
  revalidatePath("/denials")
  revalidatePath("/admin")
  revalidatePath("/firms")
  revalidatePath("/stats")
}