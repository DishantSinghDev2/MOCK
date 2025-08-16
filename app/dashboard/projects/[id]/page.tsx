import { Suspense } from "react"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectTabs } from "@/components/projects/project-tabs"
import { DiscoveryProgress } from "@/components/ai/discovery-progress"

// Mock project data - in real app this would come from API
const project = {
  id: "1",
  name: "User Management API",
  description: "Authentication and user profile endpoints",
  status: "active",
  baseUrl: "https://api.example.com",
  environment: "production",
  createdAt: "2024-01-15",
  discoveryStatus: "completed",
  mocks: 12,
  tests: 45,
  successRate: 98.2,
  lastRun: "2 hours ago",
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        {project.discoveryStatus === "in-progress" ? (
          <DiscoveryProgress projectId={params.id} />
        ) : (
          <ProjectTabs project={project} />
        )}
      </Suspense>
    </div>
  )
}
