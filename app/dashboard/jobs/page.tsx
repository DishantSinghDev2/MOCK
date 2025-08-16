import { JobQueuePanel } from "@/components/jobs/job-queue-panel"

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Queue</h1>
        <p className="text-muted-foreground">Monitor and manage your background jobs and automation tasks.</p>
      </div>

      <JobQueuePanel />
    </div>
  )
}
