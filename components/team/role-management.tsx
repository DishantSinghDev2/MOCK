"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Shield, Users, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  permissions: string[]
  isDefault?: boolean
}

const permissions: Permission[] = [
  { id: "projects.create", name: "Create Projects", description: "Create new API projects", category: "Projects" },
  { id: "projects.edit", name: "Edit Projects", description: "Modify existing projects", category: "Projects" },
  { id: "projects.delete", name: "Delete Projects", description: "Remove projects", category: "Projects" },
  { id: "projects.share", name: "Share Projects", description: "Share projects with team", category: "Projects" },
  { id: "mocks.create", name: "Create Mocks", description: "Generate mock endpoints", category: "Mocks" },
  { id: "mocks.edit", name: "Edit Mocks", description: "Modify mock configurations", category: "Mocks" },
  { id: "mocks.delete", name: "Delete Mocks", description: "Remove mock endpoints", category: "Mocks" },
  { id: "tests.create", name: "Create Tests", description: "Create test suites", category: "Testing" },
  { id: "tests.run", name: "Run Tests", description: "Execute test suites", category: "Testing" },
  { id: "tests.view", name: "View Test Results", description: "Access test reports", category: "Testing" },
  { id: "team.invite", name: "Invite Members", description: "Send team invitations", category: "Team" },
  { id: "team.manage", name: "Manage Members", description: "Edit member roles", category: "Team" },
  { id: "billing.view", name: "View Billing", description: "Access billing information", category: "Billing" },
  { id: "billing.manage", name: "Manage Billing", description: "Update payment methods", category: "Billing" },
]

const roles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all features and settings",
    memberCount: 3,
    permissions: permissions.map((p) => p.id),
    isDefault: false,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Can create and manage projects, mocks, and tests",
    memberCount: 15,
    permissions: [
      "projects.create",
      "projects.edit",
      "projects.share",
      "mocks.create",
      "mocks.edit",
      "tests.create",
      "tests.run",
      "tests.view",
      "billing.view",
    ],
    isDefault: true,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to projects and test results",
    memberCount: 6,
    permissions: ["projects.share", "tests.view", "billing.view"],
    isDefault: false,
  },
]

export function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0])
  const [isCreatingRole, setIsCreatingRole] = useState(false)

  const permissionsByCategory = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const hasPermission = (permissionId: string) => {
    return selectedRole?.permissions.includes(permissionId) || false
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage access control for your team</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>Define a new role with specific permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input id="role-name" placeholder="e.g., QA Engineer" />
              </div>
              <div>
                <Label htmlFor="role-description">Description</Label>
                <Input id="role-description" placeholder="Brief description of this role" />
              </div>
              <Button className="w-full">Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Roles</h3>
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-colors ${
                selectedRole?.id === role.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <h4 className="font-semibold">{role.name}</h4>
                  </div>
                  {role.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{role.memberCount} members</span>
                  <span>•</span>
                  <span>{role.permissions.length} permissions</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedRole ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {selectedRole.name} Permissions
                    </CardTitle>
                    <CardDescription>{selectedRole.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-3">{category}</h4>
                    <div className="space-y-3">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div>
                            <Label htmlFor={permission.id} className="font-medium">
                              {permission.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <Switch id={permission.id} checked={hasPermission(permission.id)} disabled />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Select a role to view permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
