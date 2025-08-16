"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Brain, AlertCircle, X } from "lucide-react"

interface DiscoveryStep {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "failed"
  duration?: string
  details?: string[]
}

const discoverySteps: DiscoveryStep[] = [
  {
    id: "discovery",
    title: "API Discovery",
    description: "Crawling base URL and discovering endpoints",
    status: "pending",
    details: ["Scanning /api routes", "Checking common endpoints", "Following API links"],
  },
  {
    id: "schema",
    title: "Schema Inference",
    description: "Analyzing request/response patterns and inferring schemas",
    status: "pending",
    details: ["Analyzing response structures", "Inferring data types", "Detecting relationships"],
  },
  {
    id: "mocks",
    title: "Mock Generation",
    description: "Creating realistic mock data and scenarios",
    status: "pending",
    details: ["Generating sample data", "Creating scenarios", "Setting up mock server"],
  },
  {
    id: "tests",
    title: "Test Planning",
    description: "Generating comprehensive test suites",
    status: "pending",
    details: ["Creating test cases", "Setting up assertions", "Planning test scenarios"],
  },
  {
    id: "insights",
    title: "AI Insights",
    description: "Analyzing patterns and generating recommendations",
    status: "pending",
    details: ["Analyzing API patterns", "Identifying potential issues", "Generating recommendations"],
  },
]

export function DiscoveryProgress({ projectId }: { projectId: string }) {
  const [steps, setSteps] = useState<DiscoveryStep[]>(discoverySteps)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [canCancel, setCanCancel] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps]

        if (currentStep < newSteps.length) {
          // Mark current step as in-progress
          if (newSteps[currentStep].status === "pending") {
            newSteps[currentStep].status = "in-progress"
            return newSteps
          }

          // Complete current step and move to next
          if (newSteps[currentStep].status === "in-progress") {
            newSteps[currentStep].status = "completed"
            newSteps[currentStep].duration = `${Math.floor(Math.random() * 30) + 10}s`
            setCurrentStep((prev) => prev + 1)

            if (currentStep === newSteps.length - 1) {
              setIsComplete(true)
              setCanCancel(false)
            }
          }
        }

        return newSteps
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [currentStep])

  const completedSteps = steps.filter((step) => step.status === "completed").length
  const progress = (completedSteps / steps.length) * 100

  const handleCancel = () => {
    // In real app, this would cancel the discovery process
    window.location.href = "/dashboard"
  }

  if (isComplete) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-500">Discovery Complete!</CardTitle>
          <CardDescription>Your API has been successfully analyzed and mocks are ready to use.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">Endpoints Found</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">8</div>
              <p className="text-xs text-muted-foreground">Schemas Inferred</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-5">45</div>
              <p className="text-xs text-muted-foreground">Test Cases</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">3</div>
              <p className="text-xs text-muted-foreground">Scenarios</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.reload()}>
            View Project Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary animate-pulse-glow" />
                <span>AI Discovery in Progress</span>
              </CardTitle>
              <CardDescription>
                Our AI is analyzing your API and generating mocks. This usually takes 2-3 minutes.
              </CardDescription>
            </div>
            {canCancel && (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="flex-shrink-0 mt-1">
                  {step.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : step.status === "in-progress" ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : step.status === "failed" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${step.status === "completed" ? "text-green-500" : step.status === "in-progress" ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {step.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {step.duration}
                        </Badge>
                      )}
                      {step.status === "in-progress" && (
                        <Badge variant="default" className="text-xs bg-primary">
                          Running
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{step.description}</p>

                  {step.status === "in-progress" && step.details && (
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
