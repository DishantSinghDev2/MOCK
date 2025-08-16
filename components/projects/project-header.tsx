"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreHorizontal, Play, Settings, Share, Trash2, RefreshCw, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProjectHeaderProps {
  project: {
    id: string
    name: string
    description: string
    status: string
    baseUrl: string
    environment: string
    createdAt: string
    mocks: number
    tests: number
    successRate: number
    lastRun: string
  }
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-500" },
  testing: { label: "Testing", color: "bg-yellow-500" },
  failed: { label: "Failed", color: "bg-red-500" },
  draft: { label: "Draft", color: "bg-gray-500" },
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Project Info */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${statusConfig[project.status as keyof typeof statusConfig].color}`}
              />
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              {project.environment}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl">{project.description}</p>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <a
                href={project.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {project.baseUrl}
              </a>
            </div>
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-discover
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-4 w-4" />
            Run Tests
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share Project
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{project.mocks}</div>
            <p className="text-xs text-muted-foreground">Mock Endpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{project.tests}</div>
            <p className="text-xs text-muted-foreground">Test Cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">{project.successRate}%</div>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">{project.lastRun}</div>
            <p className="text-xs text-muted-foreground">Last Test Run</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
