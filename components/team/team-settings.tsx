"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, Shield, Bell, Key, AlertTriangle } from "lucide-react"

export function TeamSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Settings
          </CardTitle>
          <CardDescription>Manage your organization's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" defaultValue="DIT Technologies" />
            </div>
            <div>
              <Label htmlFor="org-domain">Domain</Label>
              <Input id="org-domain" defaultValue="dit.tech" />
            </div>
            <div>
              <Label htmlFor="org-website">Website</Label>
              <Input id="org-website" defaultValue="https://dit.tech" />
            </div>
            <div>
              <Label htmlFor="org-industry">Industry</Label>
              <Select defaultValue="technology">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security policies for your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-2fa">Require Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">All team members must enable 2FA</p>
            </div>
            <Switch id="require-2fa" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sso-enabled">Single Sign-On (SSO)</Label>
              <p className="text-sm text-muted-foreground">Enable SAML/OIDC authentication</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Enterprise</Badge>
              <Switch id="sso-enabled" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ip-whitelist">IP Address Restrictions</Label>
              <p className="text-sm text-muted-foreground">Limit access to specific IP ranges</p>
            </div>
            <Switch id="ip-whitelist" />
          </div>
          <div>
            <Label htmlFor="session-timeout">Session Timeout</Label>
            <Select defaultValue="8h">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="8h">8 hours</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure team-wide notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="slack-integration">Slack Integration</Label>
              <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
            </div>
            <Switch id="slack-integration" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="webhook-notifications">Webhook Notifications</Label>
              <p className="text-sm text-muted-foreground">Send events to custom webhooks</p>
            </div>
            <Switch id="webhook-notifications" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys & Integrations
          </CardTitle>
          <CardDescription>Manage organization-level API keys and integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Organization API Key</h4>
              <p className="text-sm text-muted-foreground">mk_live_••••••••••••••••••••••••••••••••••••</p>
            </div>
            <Button variant="outline" size="sm">
              Regenerate
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">GitHub Integration</h4>
              <p className="text-sm text-muted-foreground">Connected to DIT-Technologies organization</p>
            </div>
            <Badge variant="default">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Slack Integration</h4>
              <p className="text-sm text-muted-foreground">Not connected</p>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that affect your entire organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-semibold text-red-900">Delete Organization</h4>
              <p className="text-sm text-red-700">Permanently delete this organization and all associated data</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Organization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
