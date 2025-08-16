"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Play,
  Edit,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  BarChart3,
  Calendar,
} from "lucide-react"

interface TestSuite {
  id: string
  name: string
  description: string
  type: string
  status: "passed" | "failed" | "running" | "pending"
  lastRun: string
  duration: string
  tests: number
  passed: number
  failed: number
  coverage: number
  schedule: string
}

const statusConfig = {
  passed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  running: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
}

const typeColors = {
  contract: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  functional: "bg-green-500/10 text-green-500 border-green-500/20",
  performance: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  security: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function TestSuiteCard({ suite }: { suite: TestSuite }) {
  const StatusIcon = statusConfig[suite.status].icon
  const successRate = suite.tests > 0 ? (suite.passed / suite.tests) * 100 : 0

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${statusConfig[suite.status].border}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${typeColors[suite.type as keyof typeof typeColors]}`}>
                {suite.type}
              </Badge>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig[suite.status].bg}`}>
                <StatusIcon
                  className={`h-3 w-3 ${statusConfig[suite.status].color} ${suite.status === "running" ? "animate-spin" : ""}`}
                />
              </div>
            </div>
            <CardTitle className="text-lg">{suite.name}</CardTitle>
            <CardDescription className="text-sm">{suite.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Run Tests
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Suite
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Test Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Test Results</span>
            <span>
              {suite.passed}/{suite.tests} passed
            </span>
          </div>
          <Progress value={successRate} className="w-full" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{successRate.toFixed(1)}% success rate</span>
            <span>{suite.coverage}% coverage</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium text-green-500">{suite.passed}</span>
            </div>
            <p className="text-xs text-muted-foreground">Passed</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-sm font-medium text-red-500">{suite.failed}</span>
            </div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <BarChart3 className="h-3 w-3 text-accent" />
              <span className="text-sm font-medium">{suite.coverage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Coverage</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-2 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last run: {suite.lastRun}</span>
            </div>
            <span>Duration: {suite.duration}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Schedule: {suite.schedule}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <BarChart3 className="mr-2 h-4 w-4" />
            Results
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
