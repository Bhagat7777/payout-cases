import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import { supabaseConfig, validateSupabaseConfig } from "./config"

export function createBrowserClient() {
  validateSupabaseConfig()
  
  return createSupabaseBrowserClient(
    supabaseConfig.url!,
    supabaseConfig.anonKey!
  )
}

export function createClient() {
  return createBrowserClient()
}