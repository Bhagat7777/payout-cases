"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileCheck, 
  Building2, 
  Users, 
  Settings, 
  ShieldAlert,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Moderation Queue", href: "/admin/cases", icon: FileCheck },
  { label: "Manage Firms", href: "/admin/firms", icon: Building2 },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "System Logs", href: "/admin/logs", icon: ShieldAlert },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#0B0F17] border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Site</span>
        </Link>
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-8 h-8 bg-[#7C5CFF] rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Admin Hub</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-[#7C5CFF]")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-white/5">
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">System Online</span>
        </div>
      </div>
    </div>
  )
}