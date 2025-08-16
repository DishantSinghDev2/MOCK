"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Plus, Trash2, Repeat, Zap, CheckCircle } from "lucide-react"

interface ScheduledTask {
  id: string
  name: string
  description: string
  type: "test" | "mock-refresh" | "discovery" | "backup"
  schedule: {
    type: "once" | "daily" | "weekly" | "monthly" | "cron"
    value: string
    timezone: string
  }
  isActive: boolean
  lastRun?: Date
  nextRun: Date
  status: "pending" | "running" | "completed" | "failed"
  projectId: string
}

const taskTypes = {
  test: { icon: CheckCircle, color: "bg-blue-500", label: "Run Tests" },
  "mock-refresh": { icon: Repeat, color: "bg-green-500", label: "Refresh Mocks" },
  discovery: { icon: Zap, color: "bg-purple-500", label: "API Discovery" },
  backup: { icon: Calendar, color: "bg-orange-500", label: "Backup Data" },
}

export function TaskScheduler({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<ScheduledTask[]>([
    {
      id: "1",
      name: "Daily API Tests",
      description: "Run comprehensive API tests every day at 9 AM",
      type: "test",
      schedule: { type: "daily", value: "09:00", timezone: "UTC" },
      isActive: true,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "completed",
      projectId,
    },
    {
      id: "2",
      name: "Weekly Mock Refresh",
      description: "Refresh all mock endpoints with latest data",
      type: "mock-refresh",
      schedule: { type: "weekly", value: "monday-06:00", timezone: "UTC" },
      isActive: true,
      nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "pending",
      projectId,
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newTask, setNewTask] = useState<Partial<ScheduledTask>>({
    name: "",
    description: "",
    type: "test",
    schedule: { type: "daily", value: "09:00", timezone: "UTC" },
    isActive: true,
  })

  const createTask = () => {
    const task: ScheduledTask = {
      id: `task-${Date.now()}`,
      name: newTask.name || "New Task",
      description: newTask.description || "",
      type: newTask.type || "test",
      schedule: newTask.schedule || { type: "daily", value: "09:00", timezone: "UTC" },
      isActive: true,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "pending",
      projectId,
    }

    setTasks([...tasks, task])
    setNewTask({
      name: "",
      description: "",
      type: "test",
      schedule: { type: "daily", value: "09:00", timezone: "UTC" },
      isActive: true,
    })
    setIsCreating(false)
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isActive: !task.isActive } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "running":
        return "bg-blue-500 animate-pulse"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Scheduler</h2>
          <p className="text-muted-foreground">Automate your API testing and maintenance tasks</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Task</DialogTitle>
              <DialogDescription>Create an automated task for your project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Task Name</Label>
                <Input
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Daily API Tests"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="What does this task do?"
                  rows={3}
                />
              </div>
              <div>
                <Label>Task Type</Label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Run Tests</SelectItem>
                    <SelectItem value="mock-refresh">Refresh Mocks</SelectItem>
                    <SelectItem value="discovery">API Discovery</SelectItem>
                    <SelectItem value="backup">Backup Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Schedule Type</Label>
                  <Select
                    value={newTask.schedule?.type}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        schedule: { ...newTask.schedule!, type: value as any },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newTask.schedule?.value}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        schedule: { ...newTask.schedule!, value: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <Button onClick={createTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const TaskIcon = taskTypes[task.type].icon
          return (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${taskTypes[task.type].color} text-white`}>
                      <TaskIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{task.name}</h4>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                        <Badge variant={task.isActive ? "default" : "secondary"}>
                          {task.isActive ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Next: {task.nextRun.toLocaleString()}</span>
                        </div>
                        {task.lastRun && <span>Last: {task.lastRun.toLocaleString()}</span>}
                        <Badge variant="outline" className="text-xs">
                          {task.schedule.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={task.isActive} onCheckedChange={() => toggleTask(task.id)} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
