import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import { supabaseConfig, validateSupabaseConfig } from "./config"
import type { SupabaseClient } from "@supabase/supabase-js"

export function createBrowserClient(): SupabaseClient {
  validateSupabaseConfig()
  
  return createSupabaseBrowserClient(
    supabaseConfig.url!,
    supabaseConfig.anonKey!
  )
}

export function createClient(): SupabaseClient {
  return createBrowserClient()
}