"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitPullRequest, BookOpen, Code, Settings, Users, Shield, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

const quickStart = [
  {
    step: "1",
    title: "Connect Your Repository",
    description: "Link your GitHub, GitLab, or Bitbucket repository to get started.",
  },
  {
    step: "2",
    title: "Configure AI Settings",
    description: "Customize AI preferences for your team's coding standards.",
  },
  {
    step: "3",
    title: "Generate Your First PR",
    description: "Let PullPal analyze your commits and create intelligent pull requests.",
  },
]

const docSections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of PullPal and set up your first project.",
    articles: ["Installation & Setup", "Connecting Repositories", "Your First Pull Request", "Team Onboarding"],
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation for integrating PullPal.",
    articles: ["Authentication", "Pull Request API", "Webhooks", "Rate Limits"],
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Customize PullPal to match your team's workflow.",
    articles: ["AI Model Settings", "Review Templates", "Branch Policies", "Notification Settings"],
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Manage users, permissions, and team settings.",
    articles: ["User Roles", "Team Permissions", "SSO Integration", "Audit Logs"],
  },
  {
    icon: Shield,
    title: "Security",
    description: "Security best practices and compliance information.",
    articles: ["Data Privacy", "Security Policies", "Compliance", "Vulnerability Reporting"],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GitPullRequest className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PullPal</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/landing">
                <Button variant="ghost">Back to Home</Button>
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Documentation
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-balance">Everything you need to know about PullPal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comprehensive guides, API references, and resources to help you get the most out of PullPal.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStart.map((item, index) => (
              <Card key={index} className="bg-card/30 border-border/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, index) => (
              <Card
                key={index}
                className="bg-card/30 border-border/50 backdrop-blur-sm hover:bg-card/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground text-sm">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Button variant="ghost" className="w-full justify-between h-auto p-2 text-left">
                          <span className="text-sm">{article}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">Tutorial</Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Setting up AI-powered code reviews</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn how to configure PullPal's AI to provide meaningful code reviews that match your team's
                  standards.
                </p>
                <div className="text-xs text-muted-foreground">5 min read</div>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">Guide</Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Integrating with your CI/CD pipeline</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Step-by-step guide to integrate PullPal with GitHub Actions, GitLab CI, and other popular CI/CD tools.
                </p>
                <div className="text-xs text-muted-foreground">8 min read</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support */}
        <section>
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Need more help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline">Contact Support</Button>
                <Button>Join Community</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
