"use server"

import { createServerClient } from "@/lib/supabase/server"
import { SupabaseClient } from "@supabase/supabase-js"

const BUCKET_NAME = "evidence"
const EXPIRATION_SECONDS = 60 * 60 // 1 hour

/**
 * Generates signed URLs for a list of private file paths in the 'evidence' bucket.
 * This allows the client to securely access private files temporarily.
 * @param paths Array of file paths (e.g., ['private/file-name.jpg'])
 * @returns Array of signed public URLs.
 */
export async function getSignedEvidenceUrls(paths: string[]): Promise<string[]> {
  const supabase = await createServerClient()

  if (!paths || paths.length === 0) {
    return []
  }

  const { data, error } = await (supabase as SupabaseClient).storage
    .from(BUCKET_NAME)
    .createSignedUrls(paths, EXPIRATION_SECONDS)

  if (error) {
    console.error("Error generating signed URLs:", error)
    // Return empty array on error to prevent crashing the UI
    return []
  }

  return data.map(item => item.signedUrl)
}