"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createBrowserClient()

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      toast.success("Account created — check your email for confirmation if required")
      router.replace("/auth/login")
    } catch (err) {
      console.error(err)
      toast.error((err as Error).message || "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0B0F17" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md p-8 glass border border-white/10 rounded-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 mb-6">Sign up to submit payout cases and participate in the community.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 text-white" />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/5 text-white" />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button type="submit" className="bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] flex-1" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
              ) : (
                "Create account"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-400">
          Already have an account? <Link href="/auth/login" className="text-[#00D1B2] hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  )
}
