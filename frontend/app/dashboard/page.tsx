import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitPullRequest, FileSearch, BarChart3, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const recentPRs = [
  {
    id: 1,
    title: "Add user authentication system",
    repo: "frontend-app",
    status: "merged",
    author: "john-doe",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Fix responsive layout issues",
    repo: "ui-components",
    status: "pending",
    author: "jane-smith",
    createdAt: "4 hours ago",
  },
  {
    id: 3,
    title: "Update API endpoints for v2",
    repo: "backend-api",
    status: "issues",
    author: "mike-wilson",
    createdAt: "1 day ago",
  },
]

const statusIcons = {
  merged: <CheckCircle className="h-4 w-4 text-green-500" />,
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  issues: <AlertTriangle className="h-4 w-4 text-red-500" />,
}

const statusColors = {
  merged: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  issues: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome back, Birat</h1>
            <p className="text-muted-foreground text-pretty">Here's what's happening with your pull requests today.</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4" />
              Generate PR
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <FileSearch className="h-4 w-4" />
              Review PR
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <BarChart3 className="h-4 w-4" />
              Summarize Changes
            </Button>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PRs Generated This Week</CardTitle>
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+20% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Review Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">Per pull request</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Prevented bugs</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent PRs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Pull Requests</CardTitle>
              <CardDescription>Your latest pull request activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPRs.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      {statusIcons[pr.status as keyof typeof statusIcons]}
                      <div>
                        <h4 className="font-medium">{pr.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {pr.repo} • by {pr.author} • {pr.createdAt}
                        </p>
                      </div>
                    </div>
                    <Badge className={statusColors[pr.status as keyof typeof statusColors]}>{pr.status}</Badge>
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
