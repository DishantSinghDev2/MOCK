"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, Plus, Trash2, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed: string | null
  usage: {
    calls: number
    cost: number
  }
  createdAt: string
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const response = await fetch("/api/user/api-keys")
      const data = await response.json()
      setApiKeys(data.apiKeys || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      })
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (response.ok) {
        const data = await response.json()
        setApiKeys([...apiKeys, data.apiKey])
        setNewKeyName("")
        toast({
          title: "API Key Created",
          description: "Your new API key has been generated",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== keyId))
        toast({
          title: "API Key Deleted",
          description: "The API key has been permanently deleted",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys for programmatic access to MOCK by DIT</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>Generate a new API key to access MOCK by DIT programmatically</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="API key name (e.g., Production App)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={createApiKey} disabled={isCreating || !newKeyName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create Key"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{apiKey.name}</h3>
                    <Badge variant="outline">
                      <Activity className="w-3 h-3 mr-1" />
                      {apiKey.usage.calls} calls
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {showKeys[apiKey.id] ? apiKey.key : `${apiKey.key.slice(0, 8)}${"•".repeat(32)}`}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(apiKey.createdAt).toLocaleDateString()} • Last used{" "}
                    {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {apiKeys.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No API keys created yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
