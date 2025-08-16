"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Users, Share, Lock, Globe } from "lucide-react"

interface SharedProject {
  id: string
  name: string
  description: string
  visibility: "private" | "team" | "public"
  collaborators: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    role: "owner" | "editor" | "viewer"
  }>
  createdAt: string
  lastModified: string
}

const mockProjects: SharedProject[] = [
  {
    id: "1",
    name: "E-commerce API",
    description: "Mock API for online store functionality",
    visibility: "team",
    collaborators: [
      {
        id: "1",
        name: "John Doe",
        email: "john@dit.tech",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "owner",
      },
      {
        id: "2",
        name: "Sarah Wilson",
        email: "sarah@dit.tech",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "editor",
      },
      {
        id: "4",
        name: "Emily Rodriguez",
        email: "emily@dit.tech",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "viewer",
      },
    ],
    createdAt: "2024-01-15",
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    name: "Payment Gateway",
    description: "Mock payment processing endpoints",
    visibility: "private",
    collaborators: [
      {
        id: "2",
        name: "Sarah Wilson",
        email: "sarah@dit.tech",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "owner",
      },
      {
        id: "1",
        name: "John Doe",
        email: "john@dit.tech",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "editor",
      },
    ],
    createdAt: "2024-01-20",
    lastModified: "1 day ago",
  },
  {
    id: "3",
    name: "User Management API",
    description: "Authentication and user profile endpoints",
    visibility: "public",
    collaborators: [
      {
        id: "4",
        name: "Emily Rodriguez",
        email: "emily@dit.tech",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "owner",
      },
    ],
    createdAt: "2024-01-25",
    lastModified: "3 days ago",
  },
]

export function ProjectSharing() {
  const [projects, setProjects] = useState<SharedProject[]>(mockProjects)
  const [visibilityFilter, setVisibilityFilter] = useState("all")

  const filteredProjects = projects.filter((project) =>
    visibilityFilter === "all" ? true : project.visibility === visibilityFilter,
  )

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-4 w-4 text-red-600" />
      case "team":
        return <Users className="h-4 w-4 text-blue-600" />
      case "public":
        return <Globe className="h-4 w-4 text-green-600" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "bg-red-100 text-red-800"
      case "team":
        return "bg-blue-100 text-blue-800"
      case "public":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Sharing</h2>
          <p className="text-muted-foreground">Manage project access and collaboration</p>
        </div>
        <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Share a Project</h3>
            <p className="text-sm text-muted-foreground mb-4">Invite team members to collaborate</p>
            <Button>
              <Share className="h-4 w-4 mr-2" />
              Share Project
            </Button>
          </div>
        </Card>

        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                {getVisibilityIcon(project.visibility)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getVisibilityColor(project.visibility)}>{project.visibility}</Badge>
                <span className="text-xs text-muted-foreground">{project.collaborators.length} collaborators</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Collaborators</h4>
                <div className="space-y-2">
                  {project.collaborators.slice(0, 3).map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                          <AvatarFallback className="text-xs">
                            {collaborator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{collaborator.name}</span>
                      </div>
                      <Badge className={getRoleColor(collaborator.role)} variant="outline">
                        {collaborator.role}
                      </Badge>
                    </div>
                  ))}
                  {project.collaborators.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{project.collaborators.length - 3} more collaborators
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>Modified {project.lastModified}</span>
              </div>

              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Manage Access
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
