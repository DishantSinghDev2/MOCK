"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TestSuiteCard } from "@/components/tests/test-suite-card"
import { TestResults } from "@/components/tests/test-results"
import { TestScheduler } from "@/components/tests/test-scheduler"
import { AITestInsights } from "@/components/tests/ai-test-insights"
import { Search, Filter, Plus, Play, Calendar, Brain, TestTube, CheckCircle, XCircle, TrendingUp } from "lucide-react"

const testSuites = [
  {
    id: "1",
    name: "Contract Tests",
    description: "Validate API contracts and schema compliance",
    type: "contract",
    status: "passed",
    lastRun: "2 hours ago",
    duration: "45s",
    tests: 23,
    passed: 23,
    failed: 0,
    coverage: 98.5,
    schedule: "On every push",
  },
  {
    id: "2",
    name: "Functional Tests",
    description: "End-to-end functionality testing",
    type: "functional",
    status: "running",
    lastRun: "Running now",
    duration: "2m 15s",
    tests: 67,
    passed: 45,
    failed: 2,
    coverage: 87.3,
    schedule: "Daily at 2 AM",
  },
  {
    id: "3",
    name: "Performance Tests",
    description: "Load testing and performance validation",
    type: "performance",
    status: "failed",
    lastRun: "1 hour ago",
    duration: "5m 32s",
    tests: 12,
    passed: 8,
    failed: 4,
    coverage: 75.0,
    schedule: "Weekly",
  },
  {
    id: "4",
    name: "Security Tests",
    description: "Authentication and authorization testing",
    type: "security",
    status: "passed",
    lastRun: "4 hours ago",
    duration: "1m 23s",
    tests: 18,
    passed: 18,
    failed: 0,
    coverage: 94.2,
    schedule: "Manual",
  },
]

export function TestsOverview({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("suites")

  const filteredSuites = testSuites.filter(
    (suite) =>
      suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suite.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests, 0)
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0)
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failed, 0)
  const avgCoverage = testSuites.reduce((sum, suite) => sum + suite.coverage, 0) / testSuites.length

  return (
    <div className="space-y-6">
      {/* Test Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-4 w-4 text-primary" />
              <div className="text-2xl font-bold">{totalTests}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{totalPassed}</div>
            </div>
            <p className="text-xs text-muted-foreground">Passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div className="text-2xl font-bold text-red-500">{totalFailed}</div>
            </div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <div className="text-2xl font-bold">{avgCoverage.toFixed(1)}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Avg Coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="suites" className="flex items-center space-x-2">
              <TestTube className="h-4 w-4" />
              <span>Test Suites</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Insights</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Run All Tests
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Suite
            </Button>
          </div>
        </div>

        <TabsContent value="suites" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search test suites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Suites</DropdownMenuItem>
                <DropdownMenuItem>Passed Only</DropdownMenuItem>
                <DropdownMenuItem>Failed Only</DropdownMenuItem>
                <DropdownMenuItem>Running</DropdownMenuItem>
                <DropdownMenuItem>Contract Tests</DropdownMenuItem>
                <DropdownMenuItem>Performance Tests</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Test Suites Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuites.map((suite) => (
              <TestSuiteCard key={suite.id} suite={suite} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <TestResults projectId={projectId} />
        </TabsContent>

        <TabsContent value="schedule">
          <TestScheduler projectId={projectId} />
        </TabsContent>

        <TabsContent value="insights">
          <AITestInsights projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
