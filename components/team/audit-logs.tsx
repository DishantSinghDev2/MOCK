"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Shield, User, Settings, FolderOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AuditLog {
  id: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  action: string
  resource: string
  details: string
  category: "auth" | "project" | "team" | "billing" | "security"
  severity: "low" | "medium" | "high"
  ipAddress: string
  userAgent: string
}

const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    user: {
      id: "1",
      name: "John Doe",
      email: "john@dit.tech",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "project.created",
    resource: "E-commerce API",
    details: "Created new project with AI discovery",
    category: "project",
    severity: "low",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@dit.tech",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "team.member_invited",
    resource: "mike@dit.tech",
    details: "Invited new team member with Developer role",
    category: "team",
    severity: "medium",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/121.0.0.0",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily@dit.tech",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "auth.login_failed",
    resource: "Authentication",
    details: "Failed login attempt - invalid credentials",
    category: "security",
    severity: "high",
    ipAddress: "203.0.113.42",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    user: {
      id: "1",
      name: "John Doe",
      email: "john@dit.tech",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "billing.plan_upgraded",
    resource: "Enterprise Plan",
    details: "Upgraded from Pro to Enterprise plan",
    category: "billing",
    severity: "medium",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    user: {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@dit.tech",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "project.deleted",
    resource: "Legacy API",
    details: "Permanently deleted project and all associated data",
    category: "project",
    severity: "high",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/121.0.0.0",
  },
]

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter

    return matchesSearch && matchesCategory && matchesSeverity
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "auth":
        return <Shield className="h-4 w-4" />
      case "project":
        return <FolderOpen className="h-4 w-4" />
      case "team":
        return <User className="h-4 w-4" />
      case "billing":
        return <Settings className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4 text-red-600" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "auth":
        return "bg-blue-100 text-blue-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "team":
        return "bg-purple-100 text-purple-800"
      case "billing":
        return "bg-orange-100 text-orange-800"
      case "security":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Track all activities and changes in your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={log.user.avatar || "/placeholder.svg"} alt={log.user.name} />
                    <AvatarFallback className="text-xs">
                      {log.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(log.category)}
                      <span className="font-medium">{log.user.name}</span>
                      <Badge className={getCategoryColor(log.category)}>{log.category}</Badge>
                      <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="font-mono">{log.action}</span> on{" "}
                      <span className="font-medium">{log.resource}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>IP: {log.ipAddress}</span>
                      <span>User Agent: {log.userAgent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
