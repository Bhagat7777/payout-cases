import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import { supabaseConfig } from "./config"
import { SupabaseClient } from "@supabase/supabase-js"

export function createBrowserClient() {
  // Only create client in browser environment
  if (typeof window === 'undefined') {
    // Return a minimal mock for server-side rendering
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }), eq: () => ({ data: null, error: null }), order: () => ({ data: null, error: null }), range: () => ({ data: null, error: null }), single: () => ({ data: null, error: null }) }),
        insert: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
        update: () => ({ data: null, error: null }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => ({}) }),
        subscribe: () => ({}),
      }),
      removeChannel: () => {},
      storage: {
        from: () => ({
          upload: () => ({ data: { path: '' }, error: null }),
        }),
      },
    } as unknown as SupabaseClient
  }
  
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    console.warn("Supabase config missing - using mock client")
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }), eq: () => ({ data: null, error: null }), order: () => ({ data: null, error: null }), range: () => ({ data: null, error: null }), single: () => ({ data: null, error: null }) }),
        insert: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
        update: () => ({ data: null, error: null }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => ({}) }),
        subscribe: () => ({}),
      }),
      removeChannel: () => {},
      storage: {
        from: () => ({
          upload: () => ({ data: { path: '' }, error: null }),
        }),
      },
    } as unknown as SupabaseClient
  }
  
  return createSupabaseBrowserClient(
    supabaseConfig.url!,
    supabaseConfig.anonKey!
  )
}

export function createClient() {
  return createBrowserClient()
}