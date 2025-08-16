"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, Settings, Zap, Clock, AlertTriangle, CheckCircle } from "lucide-react"

const scenarios = [
  {
    id: "1",
    name: "Happy Path",
    description: "Normal successful responses with realistic data",
    active: true,
    weight: 80,
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: "2",
    name: "Slow Response",
    description: "Simulate high latency and slow network conditions",
    active: true,
    weight: 15,
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "3",
    name: "Server Errors",
    description: "Return 5xx errors to test error handling",
    active: false,
    weight: 5,
    icon: AlertTriangle,
    color: "text-red-500",
  },
]

export function MockScenarios({ projectId }: { projectId: string }) {
  const [scenarioList, setScenarioList] = useState(scenarios)

  const toggleScenario = (id: string) => {
    setScenarioList((prev) =>
      prev.map((scenario) => (scenario.id === id ? { ...scenario, active: !scenario.active } : scenario)),
    )
  }

  const updateWeight = (id: string, weight: number) => {
    setScenarioList((prev) =>
      prev.map((scenario) => (scenario.id === id ? { ...scenario, weight: weight[0] } : scenario)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Mock Scenarios</h3>
          <p className="text-sm text-muted-foreground">
            Configure different response scenarios to simulate real-world conditions
          </p>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarioList.map((scenario) => (
          <Card key={scenario.id} className={`${scenario.active ? "border-primary/20 bg-primary/5" : ""}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-background border flex items-center justify-center`}>
                    <scenario.icon className={`h-5 w-5 ${scenario.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{scenario.name}</CardTitle>
                    <CardDescription className="text-sm">{scenario.description}</CardDescription>
                  </div>
                </div>
                <Switch checked={scenario.active} onCheckedChange={() => toggleScenario(scenario.id)} />
              </div>
            </CardHeader>

            {scenario.active && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Response Weight</Label>
                    <Badge variant="secondary" className="text-xs">
                      {scenario.weight}%
                    </Badge>
                  </div>
                  <Slider
                    value={[scenario.weight]}
                    onValueChange={(value) => updateWeight(scenario.id, value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Percentage of requests that will use this scenario</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Zap className="mr-2 h-4 w-4" />
                    Test
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Global Mock Settings</CardTitle>
          <CardDescription>Settings that apply to all mock endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Base Latency (ms)</Label>
              <Slider defaultValue={[50]} max={2000} step={10} className="w-full" />
              <p className="text-xs text-muted-foreground">Minimum response time for all endpoints</p>
            </div>
            <div className="space-y-2">
              <Label>Chaos Level</Label>
              <Slider defaultValue={[5]} max={50} step={1} className="w-full" />
              <p className="text-xs text-muted-foreground">Percentage of requests that will have random errors</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">CORS Enabled</Label>
              <p className="text-xs text-muted-foreground">Allow cross-origin requests</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Request Logging</Label>
              <p className="text-xs text-muted-foreground">Log all incoming requests for debugging</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
