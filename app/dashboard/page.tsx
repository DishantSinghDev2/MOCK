import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { ProjectsGrid } from "@/components/dashboard/projects-grid"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your API projects and testing activity.
        </p>
      </div>

      <DashboardOverview />
      <QuickActions />
      <ProjectsGrid />
    </div>
  )
}
