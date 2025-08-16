import { SystemMonitor } from "@/components/admin/system-monitor"

export default function SystemPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Monitor</h1>
        <p className="text-muted-foreground">Real-time system health and performance monitoring</p>
      </div>
      <SystemMonitor />
    </div>
  )
}
