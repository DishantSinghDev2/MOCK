"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, FolderOpen, Activity } from "lucide-react"

export function TeamOverview() {
  const orgStats = {
    name: "DIT Technologies",
    plan: "Enterprise",
    members: 24,
    activeProjects: 12,
    roles: 5,
    monthlyActivity: 1847,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Organization</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orgStats.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" className="text-xs">
              {orgStats.plan}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orgStats.members}</div>
          <p className="text-xs text-muted-foreground">Active users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shared Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orgStats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">Collaborative projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Activity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orgStats.monthlyActivity.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Actions this month</p>
        </CardContent>
      </Card>
    </div>
  )
}
