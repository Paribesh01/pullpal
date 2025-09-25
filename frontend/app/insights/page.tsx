"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { GitPullRequest, Clock, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

const mockRepos = [
  { id: "all", name: "All Repositories" },
  { id: "1", name: "frontend-app" },
  { id: "2", name: "backend-api" },
  { id: "3", name: "ui-components" },
]

const prSizeData = [
  { size: "XS (1-10)", count: 15, color: "#22c55e" },
  { size: "S (11-50)", count: 28, color: "#3b82f6" },
  { size: "M (51-100)", count: 22, color: "#f59e0b" },
  { size: "L (101-500)", count: 12, color: "#ef4444" },
  { size: "XL (500+)", count: 3, color: "#8b5cf6" },
]

const weeklyData = [
  { week: "Week 1", prs: 12, reviews: 8 },
  { week: "Week 2", prs: 15, reviews: 12 },
  { week: "Week 3", prs: 18, reviews: 15 },
  { week: "Week 4", prs: 22, reviews: 18 },
  { week: "Week 5", prs: 19, reviews: 16 },
  { week: "Week 6", prs: 25, reviews: 20 },
]

const contributorData = [
  { name: "John Doe", prs: 45, reviews: 32 },
  { name: "Jane Smith", prs: 38, reviews: 28 },
  { name: "Mike Wilson", prs: 29, reviews: 35 },
  { name: "Sarah Johnson", prs: 22, reviews: 18 },
  { name: "Alex Chen", prs: 18, reviews: 24 },
]

export default function RepoInsights() {
  const [selectedRepo, setSelectedRepo] = useState("all")
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">Repository Insights</h1>
              <p className="text-muted-foreground text-pretty">Analytics and metrics for your pull request workflow.</p>
            </div>
            <div className="flex gap-4">
              <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockRepos.map((repo) => (
                    <SelectItem key={repo.id} value={repo.id}>
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total PRs Generated</CardTitle>
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">284h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> efficiency gain
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">43</div>
                <p className="text-xs text-muted-foreground">Prevented bugs and vulnerabilities</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Contributors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2</span> new this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PR Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  PR Size Distribution
                </CardTitle>
                <CardDescription>Distribution of pull request sizes by lines changed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prSizeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="size" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>PRs created and reviews completed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="prs"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="PRs Created"
                    />
                    <Line
                      type="monotone"
                      dataKey="reviews"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Reviews Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Contributors
              </CardTitle>
              <CardDescription>Most active contributors by PRs and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributorData.map((contributor, index) => (
                  <div
                    key={contributor.name}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{contributor.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contributor.prs} PRs • {contributor.reviews} reviews
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">{contributor.prs}</div>
                        <div className="text-xs text-muted-foreground">PRs</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{contributor.reviews}</div>
                        <div className="text-xs text-muted-foreground">Reviews</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
