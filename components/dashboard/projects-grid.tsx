"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TestTube,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: "1",
    name: "User Management API",
    description: "Authentication and user profile endpoints",
    status: "active",
    mocks: 12,
    tests: 45,
    lastRun: "2 hours ago",
    successRate: 98.2,
    environment: "production",
  },
  {
    id: "2",
    name: "Payment Gateway",
    description: "Stripe integration for payment processing",
    status: "testing",
    mocks: 8,
    tests: 23,
    lastRun: "30 minutes ago",
    successRate: 94.1,
    environment: "staging",
  },
  {
    id: "3",
    name: "Inventory API",
    description: "Product catalog and inventory management",
    status: "failed",
    mocks: 15,
    tests: 67,
    lastRun: "1 hour ago",
    successRate: 87.3,
    environment: "development",
  },
  {
    id: "4",
    name: "Notification Service",
    description: "Email and push notification endpoints",
    status: "active",
    mocks: 6,
    tests: 18,
    lastRun: "4 hours ago",
    successRate: 99.1,
    environment: "production",
  },
]

const statusConfig = {
  active: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  testing: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
}

export function ProjectsGrid() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your API projects and monitor their health</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const StatusIcon = statusConfig[project.status as keyof typeof statusConfig].icon
          return (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      <Link href={`/dashboard/projects/${project.id}`}>{project.name}</Link>
                    </CardTitle>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Run Tests</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        statusConfig[project.status as keyof typeof statusConfig].bg
                      }`}
                    >
                      <StatusIcon
                        className={`h-4 w-4 ${statusConfig[project.status as keyof typeof statusConfig].color}`}
                      />
                    </div>
                    <span className="text-sm font-medium capitalize">{project.status}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {project.environment}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-sm font-medium">{project.mocks}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mocks</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <TestTube className="h-3 w-3 text-accent" />
                      <span className="text-sm font-medium">{project.tests}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Tests</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <BarChart3 className="h-3 w-3 text-chart-5" />
                      <span className="text-sm font-medium">{project.successRate}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                </div>

                {/* Last Run */}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Last run: {project.lastRun}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
