import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamOverview } from "@/components/team/team-overview"
import { TeamMembers } from "@/components/team/team-members"
import { RoleManagement } from "@/components/team/role-management"
import { ProjectSharing } from "@/components/team/project-sharing"
import { AuditLogs } from "@/components/team/audit-logs"
import { TeamSettings } from "@/components/team/team-settings"

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">Manage your organization, team members, and permissions</p>
      </div>

      <TeamOverview />

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="projects">Project Sharing</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Suspense fallback={<div>Loading team members...</div>}>
            <TeamMembers />
          </Suspense>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Suspense fallback={<div>Loading roles...</div>}>
            <RoleManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Suspense fallback={<div>Loading project sharing...</div>}>
            <ProjectSharing />
          </Suspense>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Suspense fallback={<div>Loading audit logs...</div>}>
            <AuditLogs />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Suspense fallback={<div>Loading team settings...</div>}>
            <TeamSettings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
