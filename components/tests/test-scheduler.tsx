"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Webhook, Plus, Edit, Trash2, Play } from "lucide-react"

const schedules = [
  {
    id: "1",
    name: "Nightly Full Suite",
    description: "Run all test suites every night",
    trigger: "schedule",
    schedule: "0 2 * * *",
    enabled: true,
    suites: ["Contract Tests", "Functional Tests", "Performance Tests"],
    lastRun: "2024-01-15 02:00:00",
    nextRun: "2024-01-16 02:00:00",
  },
  {
    id: "2",
    name: "On Push - Quick Tests",
    description: "Run contract and functional tests on every push",
    trigger: "webhook",
    webhook: "https://api.github.com/repos/user/repo/hooks",
    enabled: true,
    suites: ["Contract Tests", "Functional Tests"],
    lastRun: "2024-01-15 14:30:00",
    nextRun: "On next push",
  },
  {
    id: "3",
    name: "Weekly Performance",
    description: "Comprehensive performance testing every Sunday",
    trigger: "schedule",
    schedule: "0 0 * * 0",
    enabled: false,
    suites: ["Performance Tests"],
    lastRun: "2024-01-14 00:00:00",
    nextRun: "2024-01-21 00:00:00",
  },
]

export function TestScheduler({ projectId }: { projectId: string }) {
  const [scheduleList, setScheduleList] = useState(schedules)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const toggleSchedule = (id: string) => {
    setScheduleList((prev) =>
      prev.map((schedule) => (schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Test Scheduling</h3>
          <p className="text-sm text-muted-foreground">Automate your test runs with schedules and triggers</p>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      <Tabs defaultValue="schedules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          {scheduleList.map((schedule) => (
            <Card key={schedule.id} className={`${schedule.enabled ? "border-primary/20 bg-primary/5" : ""}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{schedule.name}</CardTitle>
                      <Badge variant={schedule.enabled ? "default" : "secondary"} className="text-xs">
                        {schedule.enabled ? "Active" : "Disabled"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {schedule.trigger === "schedule" ? "Scheduled" : "Webhook"}
                      </Badge>
                    </div>
                    <CardDescription>{schedule.description}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Last: {new Date(schedule.lastRun).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Next: {schedule.nextRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={schedule.enabled} onCheckedChange={() => toggleSchedule(schedule.id)} />
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Test Suites</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {schedule.suites.map((suite, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {suite}
                      </Badge>
                    ))}
                  </div>
                </div>

                {schedule.trigger === "schedule" && (
                  <div>
                    <Label className="text-sm font-medium">Cron Schedule</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{schedule.schedule}</p>
                  </div>
                )}

                {schedule.trigger === "webhook" && (
                  <div>
                    <Label className="text-sm font-medium">Webhook URL</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1 truncate">{schedule.webhook}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Play className="mr-2 h-4 w-4" />
                    Run Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="h-5 w-5" />
                <span>Webhook Configuration</span>
              </CardTitle>
              <CardDescription>Set up webhooks to trigger tests from external systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Webhook URL</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={`https://api.mock.dishis.tech/webhooks/test-trigger/${projectId}`}
                      readOnly
                      className="bg-muted/50"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Use this URL in your CI/CD pipeline or Git hooks</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Secret Key</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value="whk_1234567890abcdef" readOnly className="bg-muted/50" />
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Include this in the X-Webhook-Secret header</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Supported Events</Label>
                  <div className="space-y-2">
                    {[
                      { event: "push", description: "Triggered on Git push events" },
                      { event: "pull_request", description: "Triggered on pull request events" },
                      { event: "deployment", description: "Triggered on deployment events" },
                      { event: "manual", description: "Manual trigger via API call" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{item.event}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked={item.event !== "deployment"} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Schedule</CardTitle>
              <CardDescription>Set up automated test execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleName">Schedule Name</Label>
                    <Input id="scheduleName" placeholder="My Test Schedule" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduleDescription">Description</Label>
                    <Input id="scheduleDescription" placeholder="Brief description..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select defaultValue="schedule">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="schedule">Time-based Schedule</SelectItem>
                        <SelectItem value="webhook">Webhook Trigger</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cronSchedule">Cron Expression</Label>
                    <Input id="cronSchedule" placeholder="0 2 * * *" />
                    <p className="text-xs text-muted-foreground">Daily at 2 AM</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test Suites to Run</Label>
                    <div className="space-y-2">
                      {["Contract Tests", "Functional Tests", "Performance Tests", "Security Tests"].map(
                        (suite, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input type="checkbox" id={`suite-${index}`} className="rounded" />
                            <Label htmlFor={`suite-${index}`} className="text-sm">
                              {suite}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Enable Schedule</Label>
                      <p className="text-xs text-muted-foreground">Start running tests immediately</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Create Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
