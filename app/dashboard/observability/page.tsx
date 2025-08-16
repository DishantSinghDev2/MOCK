import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsDashboard } from "@/components/observability/metrics-dashboard"
import { LogsViewer } from "@/components/observability/logs-viewer"
import { TracingViewer } from "@/components/observability/tracing-viewer"
import { AlertsPanel } from "@/components/observability/alerts-panel"
import { SystemHealth } from "@/components/observability/system-health"

export default function ObservabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Observability</h1>
        <p className="text-muted-foreground">Real-time monitoring, logging, and performance insights</p>
      </div>

      <SystemHealth />

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Suspense fallback={<div>Loading metrics...</div>}>
            <MetricsDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Suspense fallback={<div>Loading logs...</div>}>
            <LogsViewer />
          </Suspense>
        </TabsContent>

        <TabsContent value="traces" className="space-y-4">
          <Suspense fallback={<div>Loading traces...</div>}>
            <TracingViewer />
          </Suspense>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Suspense fallback={<div>Loading alerts...</div>}>
            <AlertsPanel />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
