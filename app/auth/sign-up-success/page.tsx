import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
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
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#00D1B2]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#00D1B2]" />
                </div>
              </div>
              <CardTitle className="text-2xl text-[#E6E7EB]">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-gray-400">
                We&apos;ve sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-[#0B0F17] rounded-lg border border-[#2A2F3E]">
                <Mail className="w-5 h-5 text-[#7C5CFF] mt-0.5" />
                <p className="text-sm text-gray-400">
                  Please check your email inbox and click the confirmation link to activate your account.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#00D1B2] hover:opacity-90 text-white">
                    Go to Sign In
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-[#2A2F3E] text-gray-300 hover:bg-[#2A2F3E]">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
