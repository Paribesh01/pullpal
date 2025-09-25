import type { Metadata } from "next"
import "./globals.css"
import { AppShell } from "@/components/app-shell"


export const metadata: Metadata = {
  title: "PullPal - AI-Powered Pull Request Assistant",
  description: "Generate, review, and optimize pull requests with AI assistance",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
