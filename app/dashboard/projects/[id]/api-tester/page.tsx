import { APITesterInterface } from "@/components/api-testing/api-tester-interface"
import { TestResultsAnalyzer } from "@/components/api-testing/test-results-analyzer"
import { RealTimeMonitor } from "@/components/api-testing/realtime-monitor"

export default function APITesterPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Tester</h1>
        <p className="text-muted-foreground">Test your APIs with AI-powered insights and real-time analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <APITesterInterface projectId={params.id} />
        </div>
        <div className="space-y-6">
          <RealTimeMonitor projectId={params.id} />
          <TestResultsAnalyzer projectId={params.id} />
        </div>
      </div>
    </div>
  )
}
