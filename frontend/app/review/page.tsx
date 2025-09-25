"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GitPullRequest,
  MessageSquare,
  Shield,
  GraduationCap,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { useState } from "react"

const mockPRs = [
  {
    id: "1",
    title: "Add user authentication system",
    repo: "frontend-app",
    author: "john-doe",
    number: 42,
    status: "open",
  },
  {
    id: "2",
    title: "Fix responsive layout issues",
    repo: "ui-components",
    author: "jane-smith",
    number: 38,
    status: "open",
  },
  {
    id: "3",
    title: "Update API endpoints for v2",
    repo: "backend-api",
    author: "mike-wilson",
    number: 51,
    status: "open",
  },
]

const mockDiff = `@@ -1,10 +1,15 @@
 import { NextRequest, NextResponse } from 'next/server'
+import jwt from 'jsonwebtoken'
+import { cookies } from 'next/headers'
 
 export async function middleware(request: NextRequest) {
+  const token = cookies().get('auth-token')?.value
+  
+  if (!token) {
+    return NextResponse.redirect(new URL('/login', request.url))
+  }
+
   // Protected routes
   if (request.nextUrl.pathname.startsWith('/dashboard')) {
-    // TODO: Add authentication check
-    return NextResponse.next()
+    return NextResponse.next()
   }
 }`

const reviewStyles = [
  {
    id: "senior",
    name: "Strict Senior Dev",
    icon: Zap,
    description: "Thorough, detail-oriented feedback focusing on best practices",
  },
  {
    id: "mentor",
    name: "Supportive Mentor",
    icon: GraduationCap,
    description: "Encouraging feedback with learning opportunities",
  },
  {
    id: "security",
    name: "Security Expert",
    icon: Shield,
    description: "Security-focused review highlighting potential vulnerabilities",
  },
]

const mockFeedback = {
  senior: [
    {
      type: "error",
      line: 6,
      message: "Missing error handling for JWT verification. What happens if the token is malformed?",
      suggestion: "Add try-catch block around JWT operations and handle invalid tokens gracefully.",
    },
    {
      type: "warning",
      line: 8,
      message: "Hard-coded redirect URL. Consider using environment variables for better flexibility.",
      suggestion: "Use process.env.LOGIN_URL or a configuration file for the login redirect.",
    },
    {
      type: "info",
      line: 12,
      message: "Good use of early return pattern. This improves code readability.",
      suggestion: null,
    },
  ],
  mentor: [
    {
      type: "info",
      line: 2,
      message: "Great job adding JWT authentication! This is a solid approach for stateless auth.",
      suggestion: "Consider exploring refresh tokens for enhanced security in production.",
    },
    {
      type: "warning",
      line: 6,
      message: "Remember to handle edge cases - what if the JWT is expired or invalid?",
      suggestion: "Add error handling to gracefully manage authentication failures.",
    },
    {
      type: "info",
      line: 14,
      message: "Nice clean implementation! The middleware pattern is perfect for this use case.",
      suggestion: null,
    },
  ],
  security: [
    {
      type: "error",
      line: 6,
      message: "CRITICAL: No JWT signature verification. This is a major security vulnerability!",
      suggestion: "Always verify JWT signatures using jwt.verify() with your secret key.",
    },
    {
      type: "error",
      line: 8,
      message: "Potential open redirect vulnerability. Validate the redirect URL.",
      suggestion: "Whitelist allowed redirect URLs or use relative paths only.",
    },
    {
      type: "warning",
      line: 2,
      message: "Ensure JWT secret is stored securely and rotated regularly.",
      suggestion: "Use environment variables and consider implementing key rotation.",
    },
  ],
}

export default function ReviewPR() {
  const [selectedPR, setSelectedPR] = useState("")
  const [reviewStyle, setReviewStyle] = useState("senior")

  const currentFeedback = mockFeedback[reviewStyle as keyof typeof mockFeedback] || []

  const getIconForType = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }
  }

  const selectedStyle = reviewStyles.find((s) => s.id === reviewStyle)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Review Pull Request</h1>
            <p className="text-muted-foreground text-pretty">
              Get AI-powered code reviews with different expertise levels.
            </p>
          </div>

          {/* PR Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  Select Pull Request
                </CardTitle>
                <CardDescription>Choose an open pull request to review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedPR} onValueChange={setSelectedPR}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pull request" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPRs.map((pr) => (
                      <SelectItem key={pr.id} value={pr.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            #{pr.number} {pr.title}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {pr.repo}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Review Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Review Style
                </CardTitle>
                <CardDescription>Choose the type of feedback you want</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {reviewStyles.map((style) => (
                    <div
                      key={style.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        reviewStyle === style.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                      }`}
                      onClick={() => setReviewStyle(style.id)}
                    >
                      <div className="flex items-center gap-3">
                        {style.icon && <style.icon className="h-5 w-5" />}
                        <div>
                          <h4 className="font-medium">{style.name}</h4>
                          <p className="text-sm text-muted-foreground">{style.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Diff and Feedback */}
          {selectedPR && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code Diff Viewer */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Code Changes</CardTitle>
                  <CardDescription>middleware.ts • +8 -2 lines</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <pre className="text-sm font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      <code>
                        {mockDiff.split("\n").map((line, index) => {
                          let lineClass = ""
                          const lineNumber = index + 1

                          if (line.startsWith("+")) {
                            lineClass = "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          } else if (line.startsWith("-")) {
                            lineClass = "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          } else if (line.startsWith("@@")) {
                            lineClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-semibold"
                          }

                          return (
                            <div key={index} className={`flex ${lineClass}`}>
                              <span className="w-8 text-muted-foreground text-right mr-4 select-none">
                                {!line.startsWith("@@") ? lineNumber : ""}
                              </span>
                              <span className="flex-1">{line || " "}</span>
                            </div>
                          )
                        })}
                      </code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* AI Feedback Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedStyle?.icon && <selectedStyle.icon className="h-5 w-5" />}
                    AI Feedback
                  </CardTitle>
                  <CardDescription>{selectedStyle?.name} review</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {currentFeedback.map((feedback, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start gap-3">
                            {getIconForType(feedback.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getBadgeColor(feedback.type)}>Line {feedback.line}</Badge>
                                <Badge variant="outline" className="text-xs">
                                  {feedback.type}
                                </Badge>
                              </div>
                              <p className="text-sm mb-2">{feedback.message}</p>
                              {feedback.suggestion && (
                                <div className="bg-muted/50 p-3 rounded text-sm">
                                  <strong>Suggestion:</strong> {feedback.suggestion}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
