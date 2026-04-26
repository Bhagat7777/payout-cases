'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TrendingUp } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-[#0B0F17]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#E6E7EB]">
              Payout Cases
            </span>
          </Link>

          <Card className="bg-[#1A1F2E] border-[#2A2F3E]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#E6E7EB]">Create Account</CardTitle>
              <CardDescription className="text-gray-400">
                Sign up to share your payout experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[#E6E7EB]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#0B0F17] border-[#2A2F3E] text-[#E6E7EB] placeholder:text-gray-500 focus:border-[#7C5CFF] focus:ring-[#7C5CFF]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-[#E6E7EB]">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#0B0F17] border-[#2A2F3E] text-[#E6E7EB] placeholder:text-gray-500 focus:border-[#7C5CFF] focus:ring-[#7C5CFF]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="text-[#E6E7EB]">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      placeholder="Repeat your password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="bg-[#0B0F17] border-[#2A2F3E] text-[#E6E7EB] placeholder:text-gray-500 focus:border-[#7C5CFF] focus:ring-[#7C5CFF]"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">
                      {error}
                    </p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] hover:opacity-90 text-white font-semibold" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-[#7C5CFF] hover:text-[#00D1B2] underline underline-offset-4 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <Link href="/" className="text-center text-sm text-gray-400 hover:text-[#E6E7EB] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
