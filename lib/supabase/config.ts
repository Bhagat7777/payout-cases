// Supabase configuration utility
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

export function validateSupabaseConfig() {
  // Only validate in browser environment
  if (typeof window !== 'undefined') {
    if (!supabaseConfig.url) {
      console.warn("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
      return false
    }
    
    if (!supabaseConfig.anonKey) {
      console.warn("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
      return false
    }
  }
  
  return true
}