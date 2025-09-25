import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "PullPal - AI-Powered Pull Request Assistant",
  description:
    "Generate, review, and optimize pull requests with AI assistance",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
