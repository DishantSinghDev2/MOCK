"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { UserPlus, Search, MoreHorizontal, Mail, Shield, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  status: "active" | "pending" | "inactive"
  joinedAt: string
  lastActive: string
  projects: number
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@dit.tech",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
    status: "active",
    joinedAt: "2023-01-15",
    lastActive: "2 hours ago",
    projects: 8,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@dit.tech",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Developer",
    status: "active",
    joinedAt: "2023-03-20",
    lastActive: "1 day ago",
    projects: 5,
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@dit.tech",
    role: "Viewer",
    status: "pending",
    joinedAt: "2024-01-10",
    lastActive: "Never",
    projects: 0,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@dit.tech",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Developer",
    status: "active",
    joinedAt: "2023-08-12",
    lastActive: "5 minutes ago",
    projects: 12,
  },
]

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "inactive":
        return "outline"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800"
      case "Developer":
        return "bg-blue-100 text-blue-800"
      case "Viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to join your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="colleague@company.com" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="viewer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Input id="message" placeholder="Welcome to the team!" />
              </div>
              <Button className="w-full">Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                      </div>
                      <span>Last active: {member.lastActive}</span>
                      <span>{member.projects} projects</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                  <Badge variant={getStatusVariant(member.status)}>{member.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remove Member</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
