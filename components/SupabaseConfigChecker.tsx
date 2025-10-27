"use client"

import { useEffect } from "react"
import { validateSupabaseConfig } from "@/lib/supabase/config"

export function SupabaseConfigChecker() {
  useEffect(() => {
    // Only run validation in browser environment
    if (typeof window !== 'undefined') {
      try {
        const isValid = validateSupabaseConfig()
        if (!isValid) {
          console.warn("Supabase configuration warning: Missing environment variables")
        }
      } catch (error) {
        console.warn("Supabase configuration warning:", error)
      }
    }
  }, [])

  return null
}