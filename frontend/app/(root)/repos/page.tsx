"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { fetchUserRepos } from "@/lib/api";

export default function ReposPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    // No need to get token from localStorage; backend reads from cookie
    fetchUserRepos()
      .then((data) => {
        console.log("data::::::", data);
        setRepos(
          data.repos.map((repo: any) => ({
            ...repo,
            owner:
              typeof repo.owner === "string"
                ? { login: repo.owner }
                : repo.owner,
            branches: [repo.default_branch],
            stats: { prsGenerated: 0, timeSaved: "0h", bugsDetected: 0 },
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch repositories");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner?.login?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (repo: any) => {
    setSelectedRepo(repo);
    setSelectedBranch(repo.branches[0]);
    setIsDetailsOpen(true);
  };

  const handleSync = (repoId: number) => {
    console.log("[v0] Syncing repo:", repoId);
  };

  const handleDisconnect = (repoId: number) => {
    console.log("[v0] Disconnecting repo:", repoId);
  };

  const handleGeneratePR = () => {
    if (selectedRepo) {
      router.push(
        `/generate?repo=${selectedRepo.owner.login}/${selectedRepo.name}&branch=${selectedBranch}`
      );
    }
  };

  const handleConnectRepo = async (repo: any, repoId: string) => {
    setLoading(true);
    setError(null);
    try {
      // No need to get token from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch("http://localhost:3001/auth/connect-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoId,
          userId: user.id,
          githubRepoId: repo.id,
          name: repo.name,
          owner: repo.owner.login,
          webhookSecret: "some-random-secret",
        }),
      });
      if (!res.ok) throw new Error("Failed to connect repo");
      await fetchRepos();
    } catch (e) {
      setError("Could not connect repo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage your connected repositories and their configurations
          </p>
        </div>
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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>

                  <TableHead className="text-right">Connect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepos.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Github className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{repo.name}</div>
                          <span className="text-sm text-muted-foreground">
                            {repo.owner.login}/{repo.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant={repo.connected ? "destructive" : "default"}
                        size="sm"
                        disabled={loading}
                        onClick={() => handleConnectRepo(repo, repo.id)}
                      >
                        {repo.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
  );
}

// Modal extracted for cleaner code
interface RepoDetailsModalProps {
  repo: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  onGeneratePR: () => void;
}

function RepoDetailsModal({
  repo,
  isOpen,
  onOpenChange,
  selectedBranch,
  setSelectedBranch,
  onGeneratePR,
}: RepoDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Github className="h-5 w-5" />
            </div>
            {repo.owner?.login}/{repo.name}
          </DialogTitle>
          <DialogDescription>
            Repository details and configuration options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Repo Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Provider</label>
              <div className="mt-1">
                <Badge variant="outline">GitHub</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <div className="mt-1">
                <Badge variant="secondary">
                  <Shield className="mr-1 h-3 w-3" />
                  Private
                </Badge>
              </div>
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="text-sm font-medium">
              Select Branch for PR Generation
            </label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {repo.branches.map((branch: string) => (
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
                  <div className="text-2xl font-bold mt-1">
                    {repo.stats.prsGenerated}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div className="text-sm font-medium">Time Saved</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {repo.stats.timeSaved}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4 text-red-500" />
                    <div className="text-sm font-medium">Bugs Detected</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {repo.stats.bugsDetected}
                  </div>
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
  );
}
