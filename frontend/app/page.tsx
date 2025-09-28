"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitPullRequest,
  Shield,
  BarChart3,
  ArrowRight,
  Play,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth-modal";
import { PricingSection } from "@/components/pricing-section";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const stats = [
  {
    value: "2.4h",
    label: "Average time saved",
    description: "per pull request",
  },
  {
    value: "98%",
    label: "faster reviews",
    description: "with AI assistance",
  },
  {
    value: "300%",
    label: "increase in quality",
    description: "code reviews",
  },
  {
    value: "6x",
    label: "faster to deploy",
    description: "with automated checks",
  },
];

const features = [
  {
    icon: GitPullRequest,
    title: "AI-Powered PR Generation",
    description:
      "Generate comprehensive pull requests with intelligent commit analysis and automated descriptions.",
  },
  {
    icon: Shield,
    title: "Smart Code Review",
    description:
      "Get expert-level code reviews with security, performance, and best practice recommendations.",
  },
  {
    icon: BarChart3,
    title: "Team Analytics",
    description:
      "Track your team's productivity and code quality metrics with detailed insights and reporting.",
  },
];

const companies = ["GitHub", "GitLab", "Bitbucket", "Azure DevOps", "Jira"];

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3001/auth/validate-token", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) setIsAuthenticated(true);
      });
  }, []);

  const handleOpenAuth = (mode: "login" | "signup" = "login") => {
    console.log(`[v0] Opening ${mode} modal`);
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  const BACKEND_URL = ""; // Adjust if needed

  const handleSignInWithGitHub = () => {
    console.log(`[v0] Redirecting to http://localhost:3001/auth/github`);
    window.location.href = "http://localhost:3001/auth/github";
  };

  const handleCloseAuth = (open: boolean) => {
    console.log("[v0] Auth modal state changed to:", open);
    setShowAuthModal(open);
  };

  const handleModeChange = (mode: "login" | "signup") => {
    console.log(`[v0] Auth mode changed to: ${mode}`);
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GitPullRequest className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">PullPal</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Docs
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleSignInWithGitHub}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleSignInWithGitHub}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push("/repos")}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <Badge
            variant="outline"
            className="text-primary border-primary/20 bg-primary/5"
          >
            PullPal for Enterprise
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            AI for teams building <span className="text-primary">the web</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Empower your entire development team to create pull requests at the
            speed of thought, while ensuring code quality remains at the
            forefront.
          </p>

          <div className="flex items-center justify-center gap-4">
            {!isAuthenticated ? (
              <Button
                size="lg"
                onClick={handleSignInWithGitHub}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Get Started
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => router.push("/repos")}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Go to Dashboard
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-border"
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Code Preview */}
        <div className="mt-20">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <Badge variant="outline">pull-request.tsx</Badge>
              </div>
              <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
                <code>{`// AI-generated pull request with comprehensive analysis
export async function generatePR(commits: Commit[]) {
  const analysis = await analyzeCodeChanges(commits)
  
  return {
    title: analysis.suggestedTitle,
    description: analysis.detailedDescription,
    reviewers: analysis.recommendedReviewers,
    labels: analysis.suggestedLabels
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-card/30 border-border/50 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">
            Trusted by development teams at
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {companies.map((company, index) => (
              <div
                key={index}
                className="text-lg font-medium text-muted-foreground/60"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-balance">
              The complete platform to build better PRs.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Your team's toolkit to stop configuring and start innovating.
              Securely build, review, and deploy the best code with PullPal.
            </p>
            <div className="flex gap-4">
              {!isAuthenticated ? (
                <Button onClick={handleSignInWithGitHub}>Get Started</Button>
              ) : (
                <Button onClick={() => router.push("/repos")}>
                  Go to Dashboard
                </Button>
              )}
              <Button variant="outline" className="bg-transparent">
                Explore Features
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card/30 border-border/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        onGetStarted={
          !isAuthenticated
            ? handleSignInWithGitHub
            : () => router.push("/repos")
        }
      />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-balance">
              Make teamwork seamless.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Tools for your team and stakeholders to share feedback and iterate
              faster.
            </p>
            <Button
              size="lg"
              onClick={
                !isAuthenticated
                  ? handleSignInWithGitHub
                  : () => router.push("/repos")
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {!isAuthenticated ? (
                <>
                  Start Building Today
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <GitPullRequest className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">PullPal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PullPal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        open={showAuthModal}
        onOpenChange={handleCloseAuth}
        mode={authMode}
        onModeChange={handleModeChange}
      />
    </div>
  );
}
