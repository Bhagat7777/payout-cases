"use client"

import { useEffect } from "react"
import { validateSupabaseConfig } from "@/lib/supabase/config"

export function SupabaseConfigChecker() {
  useEffect(() => {
    try {
      validateSupabaseConfig()
    } catch (error) {
      console.warn("Supabase configuration warning:", error)
    }
  }, [])

  return null
}