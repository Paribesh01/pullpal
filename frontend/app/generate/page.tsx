"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, GitCommit, RefreshCw, Copy, Send, Sparkles } from "lucide-react"
import { useState } from "react"

const mockRepos = [
  { id: "1", name: "frontend-app", owner: "acme-corp" },
  { id: "2", name: "backend-api", owner: "acme-corp" },
  { id: "3", name: "ui-components", owner: "acme-corp" },
]

const mockBranches = [
  { name: "feature/user-auth", ahead: 5, behind: 0 },
  { name: "feature/responsive-layout", ahead: 3, behind: 1 },
  { name: "bugfix/api-endpoints", ahead: 2, behind: 0 },
]

const mockCommits = [
  {
    id: "abc123",
    message: "Add user authentication middleware",
    author: "John Doe",
    timestamp: "2 hours ago",
    changes: { additions: 45, deletions: 12 },
  },
  {
    id: "def456",
    message: "Update login form validation",
    author: "John Doe",
    timestamp: "3 hours ago",
    changes: { additions: 23, deletions: 8 },
  },
  {
    id: "ghi789",
    message: "Fix password reset flow",
    author: "John Doe",
    timestamp: "4 hours ago",
    changes: { additions: 15, deletions: 5 },
  },
]

export default function GeneratePR() {
  const [selectedRepo, setSelectedRepo] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [prTitle, setPrTitle] = useState("Add user authentication system")
  const [prDescription, setPrDescription] = useState(`## Summary
This PR implements a comprehensive user authentication system with the following features:

- JWT-based authentication middleware
- Secure login and registration forms
- Password reset functionality
- Session management
- Input validation and sanitization

## Changes Made
- Added authentication middleware to protect routes
- Implemented login/register forms with proper validation
- Created password reset flow with email verification
- Updated user model with security enhancements
- Added comprehensive error handling

## Testing
- All authentication flows tested manually
- Unit tests added for middleware functions
- Integration tests for login/register endpoints

## Breaking Changes
None - this is a new feature addition.`)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    // Simulate regeneration with slight variations
    setTimeout(() => {
      setPrTitle("Implement comprehensive user authentication")
      setPrDescription(`## Overview
This pull request introduces a robust user authentication system designed for security and scalability.

## Key Features
- JWT token-based authentication
- Secure user registration and login
- Password reset with email verification
- Protected route middleware
- Comprehensive input validation

## Implementation Details
- Authentication middleware protects sensitive routes
- Forms include client and server-side validation
- Password reset uses secure token generation
- Session management with automatic cleanup
- Error handling with user-friendly messages

## Quality Assurance
- Manual testing of all user flows
- Unit test coverage for core functions
- Integration tests for API endpoints
- Security review completed

## Compatibility
Fully backward compatible - no breaking changes.`)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    const content = `${prTitle}\n\n${prDescription}`
    navigator.clipboard.writeText(content)
  }

  return (
    <>
      <Header />
      <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Generate Pull Request</h1>
            <p className="text-muted-foreground text-pretty">
              Let AI help you create comprehensive pull request descriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Repository Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Repository & Branch
                </CardTitle>
                <CardDescription>Select the repository and branch for your pull request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repository">Repository</Label>
                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRepos.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id}>
                          {repo.owner}/{repo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBranches.map((branch) => (
                        <SelectItem key={branch.name} value={branch.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{branch.name}</span>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                +{branch.ahead}
                              </Badge>
                              {branch.behind > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  -{branch.behind}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!selectedRepo || !selectedBranch || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate PR Description
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Commit History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Recent Commits
                </CardTitle>
                <CardDescription>Commits that will be included in this pull request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCommits.map((commit) => (
                    <div key={commit.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{commit.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {commit.author} • {commit.timestamp}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            +{commit.changes.additions}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            -{commit.changes.deletions}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Generated PR Draft */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Generated Pull Request
              </CardTitle>
              <CardDescription>Review and customize your AI-generated pull request description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pr-title">Title</Label>
                <Input
                  id="pr-title"
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                  placeholder="Enter PR title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pr-description">Description</Label>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-4">
                    <Textarea
                      id="pr-description"
                      value={prDescription}
                      onChange={(e) => setPrDescription(e.target.value)}
                      placeholder="Enter PR description"
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="mt-4">
                    <div className="min-h-[300px] p-4 border border-border rounded-md bg-muted/50">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {prDescription.split("\n").map((line, index) => {
                          if (line.startsWith("## ")) {
                            return (
                              <h2 key={index} className="text-lg font-semibold mt-4 mb-2">
                                {line.replace("## ", "")}
                              </h2>
                            )
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <li key={index} className="ml-4">
                                {line.replace("- ", "")}
                              </li>
                            )
                          }
                          return line ? (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          ) : (
                            <br key={index} />
                          )
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleRegenerate} variant="outline" disabled={isGenerating}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button className="ml-auto">
                  <Send className="h-4 w-4 mr-2" />
                  Submit to GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
      </main>
    </>
  )
}
