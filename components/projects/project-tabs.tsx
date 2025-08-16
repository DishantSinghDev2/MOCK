"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MocksOverview } from "@/components/mocks/mocks-overview"
import { TestsOverview } from "@/components/tests/tests-overview"
import { ProjectInsights } from "@/components/projects/project-insights"
import { ProjectLogs } from "@/components/projects/project-logs"
import { AIChatAssistant } from "@/components/ai/ai-chat-assistant"
import { APITesterInterface } from "@/components/api-testing/api-tester-interface"
import { Zap, TestTube, BarChart3, ScrollText, Brain, Play } from "lucide-react" // Added Play icon

interface ProjectTabsProps {
  project: {
    id: string
    name: string
    status: string
    mocks: number
    tests: number
  }
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="mocks" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="mocks" className="flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <span>Mocks</span>
        </TabsTrigger>
        <TabsTrigger value="tests" className="flex items-center space-x-2">
          <TestTube className="h-4 w-4" />
          <span>Tests</span>
        </TabsTrigger>
        <TabsTrigger value="api-tester" className="flex items-center space-x-2">
          <Play className="h-4 w-4" />
          <span>API Tester</span>
        </TabsTrigger>
        <TabsTrigger value="ai-assistant" className="flex items-center space-x-2">
          <Brain className="h-4 w-4" />
          <span>AI Assistant</span>
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Insights</span>
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex items-center space-x-2">
          <ScrollText className="h-4 w-4" />
          <span>Logs</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mocks">
        <MocksOverview projectId={project.id} />
      </TabsContent>

      <TabsContent value="tests">
        <TestsOverview projectId={project.id} />
      </TabsContent>

      <TabsContent value="api-tester">
        <APITesterInterface projectId={project.id} />
      </TabsContent>

      <TabsContent value="ai-assistant">
        <AIChatAssistant projectId={project.id} />
      </TabsContent>

      <TabsContent value="insights">
        <ProjectInsights projectId={project.id} />
      </TabsContent>

      <TabsContent value="logs">
        <ProjectLogs projectId={project.id} />
      </TabsContent>
    </Tabs>
  )
}
