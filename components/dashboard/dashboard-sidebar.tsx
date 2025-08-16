"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  LayoutDashboard,
  FolderOpen,
  TestTube,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  Webhook,
  ChevronLeft,
  ChevronRight,
  Plus,
  Activity,
  Clock,
  Key,
  Blocks,
  Calendar,
  BookOpen,
  CheckSquare,
  Brain,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Builder", href: "/dashboard/projects/builder", icon: Blocks },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Brain }, // Added AI Assistant navigation item
  { name: "Tests", href: "/dashboard/tests", icon: TestTube },
  { name: "Jobs", href: "/dashboard/jobs", icon: Clock },
  { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { name: "Observability", href: "/dashboard/observability", icon: Activity },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Integrations", href: "/dashboard/integrations", icon: Webhook },
  { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Docs", href: "/docs", icon: BookOpen },
  { name: "Admin Checklist", href: "/admin/checklist", icon: CheckSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-sidebar-primary animate-pulse-glow" />
            <div>
              <h1 className="font-bold text-sidebar-foreground">MOCK</h1>
              <p className="text-xs text-sidebar-foreground/60">by DIT</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Create */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          asChild
          className={cn(
            "bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground",
            collapsed ? "w-8 h-8 p-0" : "w-full",
          )}
        >
          <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Project</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.name === "Tests" && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  3
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center space-x-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-sidebar-primary-foreground">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
