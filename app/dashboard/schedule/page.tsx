import { TaskScheduler } from "@/components/scheduling/task-scheduler"

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Scheduler</h1>
        <p className="text-muted-foreground">Automate your API testing, mock refreshing, and maintenance tasks</p>
      </div>

      <TaskScheduler projectId="current-project" />
    </div>
  )
}
