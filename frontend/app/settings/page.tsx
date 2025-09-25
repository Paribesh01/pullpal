"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Github, Gitlab as GitLab, Slack, Mail, MessageCircle, Moon, Sun, Bell, Shield, Zap } from "lucide-react"
import { useState } from "react"

const integrations = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    description: "Connect your GitHub repositories",
    connected: true,
    status: "Connected to 12 repositories",
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: GitLab,
    description: "Connect your GitLab projects",
    connected: false,
    status: "Not connected",
  },
]

const notificationChannels = [
  {
    id: "email",
    name: "Email",
    icon: Mail,
    description: "Get notifications via email",
    enabled: true,
  },
  {
    id: "slack",
    name: "Slack",
    icon: Slack,
    description: "Send notifications to Slack",
    enabled: true,
  },
  {
    id: "discord",
    name: "Discord",
    icon: MessageCircle,
    description: "Send notifications to Discord",
    enabled: false,
  },
]

export default function Settings() {
  const [prStyle, setPrStyle] = useState("formal")
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    prGenerated: true,
    reviewCompleted: true,
    issuesFound: true,
    weeklyDigest: false,
  })

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Settings</h1>
            <p className="text-muted-foreground text-pretty">
              Manage your integrations, preferences, and notifications.
            </p>
          </div>

          {/* Git Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Git Integrations
              </CardTitle>
              <CardDescription>Connect your Git repositories to enable PR generation and review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <integration.icon className="h-8 w-8" />
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{integration.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.connected ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Connected</Badge>
                    )}
                    <Button variant={integration.connected ? "outline" : "default"}>
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* PR Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Pull Request Preferences
              </CardTitle>
              <CardDescription>Customize how PullPal generates your pull requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pr-style">Default PR Style</Label>
                <Select value={prStyle} onValueChange={setPrStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal - Professional and detailed</SelectItem>
                    <SelectItem value="casual">Casual - Friendly and conversational</SelectItem>
                    <SelectItem value="concise">Concise - Brief and to the point</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose the default writing style for AI-generated PR descriptions
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Auto-generation Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-title">Auto-generate PR titles</Label>
                      <p className="text-sm text-muted-foreground">Automatically create titles based on commits</p>
                    </div>
                    <Switch id="auto-title" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="include-tests">Include testing notes</Label>
                      <p className="text-sm text-muted-foreground">Add testing instructions to PR descriptions</p>
                    </div>
                    <Switch id="include-tests" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="breaking-changes">Highlight breaking changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically detect and highlight breaking changes
                      </p>
                    </div>
                    <Switch id="breaking-changes" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  {notificationChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <channel.icon className="h-5 w-5" />
                        <div>
                          <Label>{channel.name}</Label>
                          <p className="text-sm text-muted-foreground">{channel.description}</p>
                        </div>
                      </div>
                      <Switch checked={channel.enabled} />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>PR Generated</Label>
                      <p className="text-sm text-muted-foreground">When a new PR is generated</p>
                    </div>
                    <Switch
                      checked={notifications.prGenerated}
                      onCheckedChange={() => toggleNotification("prGenerated")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Review Completed</Label>
                      <p className="text-sm text-muted-foreground">When AI review is finished</p>
                    </div>
                    <Switch
                      checked={notifications.reviewCompleted}
                      onCheckedChange={() => toggleNotification("reviewCompleted")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Issues Found</Label>
                      <p className="text-sm text-muted-foreground">When potential issues are detected</p>
                    </div>
                    <Switch
                      checked={notifications.issuesFound}
                      onCheckedChange={() => toggleNotification("issuesFound")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of activity</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={() => toggleNotification("weeklyDigest")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of PullPal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Account & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account & Security
              </CardTitle>
              <CardDescription>Manage your account settings and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Enable 2FA</Button>
                <Button variant="destructive" className="ml-auto">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
