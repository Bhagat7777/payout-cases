import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { supabaseConfig } from "./config"
import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createServerClient() {
  // Only create client in server environment
  if (typeof window !== "undefined") {
    // Return a minimal mock for client-side calls
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ 
          data: null, 
          error: null, 
          single: () => ({ data: null, error: null }),
          eq: () => ({ 
            data: null, 
            error: null, 
            single: () => ({ data: null, error: null }),
            order: () => ({ data: null, error: null }),
            range: () => ({ data: null, error: null })
          }),
          order: () => ({ data: null, error: null }),
          range: () => ({ data: null, error: null })
        }),
        insert: () => ({ 
          data: null, 
          error: null, 
          select: () => ({ 
            data: null, 
            error: null, 
            single: () => ({ data: null, error: null })
          }) 
        }),
        update: () => ({ data: null, error: null }),
      }),
    } as unknown as SupabaseClient
  }
  
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    console.warn("Supabase config missing - using mock client")
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ 
          data: null, 
          error: null, 
          single: () => ({ data: null, error: null }),
          eq: () => ({ 
            data: null, 
            error: null, 
            single: () => ({ data: null, error: null }),
            order: () => ({ data: null, error: null }),
            range: () => ({ data: null, error: null })
          }),
          order: () => ({ data: null, error: null }),
          range: () => ({ data: null, error: null })
        }),
        insert: () => ({ 
          data: null, 
          error: null, 
          select: () => ({ 
            data: null, 
            error: null, 
            single: () => ({ data: null, error: null })
          }) 
        }),
        update: () => ({ data: null, error: null }),
      }),
    } as unknown as SupabaseClient
  }
  
  // Import inside function to avoid import error in client context
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()

  return createSupabaseServerClient(
    supabaseConfig.url!,
    supabaseConfig.anonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function createClient() {
  return createServerClient()
}
