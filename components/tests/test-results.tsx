"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  BarChart3,
  Zap,
} from "lucide-react"

const testRuns = [
  {
    id: "1",
    suite: "Contract Tests",
    status: "passed",
    startTime: "2024-01-15 14:30:00",
    duration: "45s",
    tests: 23,
    passed: 23,
    failed: 0,
    skipped: 0,
    coverage: 98.5,
    trigger: "Manual",
  },
  {
    id: "2",
    suite: "Functional Tests",
    status: "running",
    startTime: "2024-01-15 14:25:00",
    duration: "2m 15s",
    tests: 67,
    passed: 45,
    failed: 2,
    skipped: 1,
    coverage: 87.3,
    trigger: "Scheduled",
  },
  {
    id: "3",
    suite: "Performance Tests",
    status: "failed",
    startTime: "2024-01-15 13:45:00",
    duration: "5m 32s",
    tests: 12,
    passed: 8,
    failed: 4,
    skipped: 0,
    coverage: 75.0,
    trigger: "Push",
  },
]

const failedTests = [
  {
    id: "1",
    name: "POST /api/users - Create user with invalid email",
    suite: "Functional Tests",
    error: "Expected status 400, got 500",
    duration: "1.2s",
    severity: "high",
  },
  {
    id: "2",
    name: "GET /api/users/{id} - Performance threshold",
    suite: "Performance Tests",
    error: "Response time 2.5s exceeded threshold of 1s",
    duration: "2.5s",
    severity: "medium",
  },
  {
    id: "3",
    name: "Authentication - Invalid token handling",
    suite: "Security Tests",
    error: "Expected 401 Unauthorized, got 200 OK",
    duration: "0.8s",
    severity: "critical",
  },
]

export function TestResults({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("runs")

  const filteredRuns = testRuns.filter((run) => run.suite.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Test Results</h3>
          <p className="text-sm text-muted-foreground">View detailed results from your test runs</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="runs">Test Runs</TabsTrigger>
          <TabsTrigger value="failures">Failed Tests</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Report</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search test runs..."
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
                <DropdownMenuItem>All Runs</DropdownMenuItem>
                <DropdownMenuItem>Passed Only</DropdownMenuItem>
                <DropdownMenuItem>Failed Only</DropdownMenuItem>
                <DropdownMenuItem>Running</DropdownMenuItem>
                <DropdownMenuItem>Last 24 Hours</DropdownMenuItem>
                <DropdownMenuItem>Last Week</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Test Runs List */}
          <div className="space-y-4">
            {filteredRuns.map((run) => (
              <Card key={run.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        {run.status === "passed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {run.status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
                        {run.status === "running" && <Clock className="h-5 w-5 text-blue-500 animate-spin" />}
                        <CardTitle className="text-lg">{run.suite}</CardTitle>
                        <Badge
                          variant={
                            run.status === "passed" ? "default" : run.status === "failed" ? "destructive" : "secondary"
                          }
                          className="text-xs"
                        >
                          {run.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Started: {new Date(run.startTime).toLocaleString()}</span>
                        <span>Duration: {run.duration}</span>
                        <span>Trigger: {run.trigger}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-lg font-semibold">{run.tests}</div>
                      <p className="text-xs text-muted-foreground">Total Tests</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-green-500">{run.passed}</div>
                      <p className="text-xs text-muted-foreground">Passed</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-red-500">{run.failed}</div>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-yellow-500">{run.skipped}</div>
                      <p className="text-xs text-muted-foreground">Skipped</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-accent">{run.coverage}%</div>
                      <p className="text-xs text-muted-foreground">Coverage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="failures" className="space-y-6">
          <div className="space-y-4">
            {failedTests.map((test) => (
              <Card key={test.id} className="border-red-500/20 bg-red-500/5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <CardTitle className="text-base">{test.name}</CardTitle>
                        <Badge
                          variant={
                            test.severity === "critical"
                              ? "destructive"
                              : test.severity === "high"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {test.severity}
                        </Badge>
                      </div>
                      <CardDescription>
                        Suite: {test.suite} • Duration: {test.duration}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Zap className="mr-2 h-4 w-4" />
                      AI Fix
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-background rounded-lg border">
                    <p className="text-sm font-mono text-red-500">{test.error}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Code Coverage Report</span>
              </CardTitle>
              <CardDescription>Detailed coverage analysis across your API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">87.3%</div>
                    <p className="text-sm text-muted-foreground">Overall Coverage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">45/52</div>
                    <p className="text-sm text-muted-foreground">Endpoints Covered</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">234</div>
                    <p className="text-sm text-muted-foreground">Test Cases</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Coverage by Endpoint</h4>
                  {[
                    { endpoint: "GET /api/users", coverage: 95, tests: 12 },
                    { endpoint: "POST /api/users", coverage: 88, tests: 8 },
                    { endpoint: "PUT /api/users/{id}", coverage: 76, tests: 6 },
                    { endpoint: "DELETE /api/users/{id}", coverage: 45, tests: 3 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono">{item.endpoint}</span>
                        <span>
                          {item.coverage}% ({item.tests} tests)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.coverage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
