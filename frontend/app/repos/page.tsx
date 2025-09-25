"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Eye,
  RefreshCw,
  Unlink,
  Github,
  GitBranch,
  Clock,
  Shield,
  TrendingUp,
  Bug,
  GitPullRequest,
} from "lucide-react"

// Mock data for repositories
const mockRepos = [
  {
    id: 1,
    name: "frontend-app",
    owner: "acme-corp",
    provider: "GitHub",
    visibility: "Private",
    lastSynced: "2 hours ago",
    branches: ["main", "develop", "feature/auth", "hotfix/security"],
    stats: {
      prsGenerated: 45,
      timeSaved: "12.5 hours",
      bugsDetected: 8,
    },
  },
  {
    id: 2,
    name: "api-service",
    owner: "acme-corp",
    provider: "GitHub",
    visibility: "Private",
    lastSynced: "1 day ago",
    branches: ["main", "staging", "feature/payments"],
    stats: {
      prsGenerated: 32,
      timeSaved: "8.2 hours",
      bugsDetected: 5,
    },
  },
  {
    id: 3,
    name: "mobile-app",
    owner: "acme-corp",
    provider: "GitLab",
    visibility: "Private",
    lastSynced: "3 hours ago",
    branches: ["main", "develop", "feature/notifications", "release/v2.1"],
    stats: {
      prsGenerated: 28,
      timeSaved: "6.8 hours",
      bugsDetected: 3,
    },
  },
  {
    id: 4,
    name: "docs-site",
    owner: "acme-corp",
    provider: "GitHub",
    visibility: "Public",
    lastSynced: "5 days ago",
    branches: ["main", "feature/new-docs"],
    stats: {
      prsGenerated: 12,
      timeSaved: "2.1 hours",
      bugsDetected: 1,
    },
  },
]

export default function ReposPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<typeof mockRepos[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState("")

  const filteredRepos = mockRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (repo: typeof mockRepos[0]) => {
    setSelectedRepo(repo)
    setSelectedBranch(repo.branches[0])
    setIsDetailsOpen(true)
  }

  const handleSync = (repoId: number) => {
    console.log("[v0] Syncing repo:", repoId)
  }

  const handleDisconnect = (repoId: number) => {
    console.log("[v0] Disconnecting repo:", repoId)
  }

  const handleGeneratePR = () => {
    if (selectedRepo) {
      router.push(`/generate?repo=${selectedRepo.owner}/${selectedRepo.name}&branch=${selectedBranch}`)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">Manage your connected repositories and their configurations</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Connect New Repo
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Repositories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Repositories ({filteredRepos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepos.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {repo.provider === "GitHub" ? <Github className="h-5 w-5" /> : <div className="h-5 w-5 rounded bg-orange-500" />}
                      </div>
                      <div>
                        <div className="font-medium">{repo.name}</div>
                        <div className="text-sm text-muted-foreground">{repo.owner}/{repo.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{repo.provider}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={repo.visibility === "Private" ? "secondary" : "default"}>
                      <Shield className="mr-1 h-3 w-3" />
                      {repo.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {repo.lastSynced}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(repo)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleSync(repo.id)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDisconnect(repo.id)}>
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Repository Details Modal */}
      {selectedRepo && (
        <RepoDetailsModal
          repo={selectedRepo}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          onGeneratePR={handleGeneratePR}
        />
      )}
    </div>
  )
}

// Modal extracted for cleaner code
interface RepoDetailsModalProps {
  repo: typeof mockRepos[0]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  onGeneratePR: () => void
}

function RepoDetailsModal({ repo, isOpen, onOpenChange, selectedBranch, setSelectedBranch, onGeneratePR }: RepoDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {repo.provider === "GitHub" ? <Github className="h-5 w-5" /> : <div className="h-5 w-5 rounded bg-orange-500" />}
            </div>
            {repo.owner}/{repo.name}
          </DialogTitle>
          <DialogDescription>Repository details and configuration options</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Repo Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Provider</label>
              <div className="mt-1">
                <Badge variant="outline">{repo.provider}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <div className="mt-1">
                <Badge variant={repo.visibility === "Private" ? "secondary" : "default"}>
                  <Shield className="mr-1 h-3 w-3" />
                  {repo.visibility}
                </Badge>
              </div>
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="text-sm font-medium">Select Branch for PR Generation</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {repo.branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      {branch}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-sm font-medium mb-3">Repository Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4 text-blue-500" />
                    <div className="text-sm font-medium">PRs Generated</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">{repo.stats.prsGenerated}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div className="text-sm font-medium">Time Saved</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">{repo.stats.timeSaved}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4 text-red-500" />
                    <div className="text-sm font-medium">Bugs Detected</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">{repo.stats.bugsDetected}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={onGeneratePR} className="gap-2">
              <GitPullRequest className="h-4 w-4" />
              Generate PR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}