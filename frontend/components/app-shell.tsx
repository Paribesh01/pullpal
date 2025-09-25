"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = !pathname.startsWith("/landing")

  if (!showSidebar) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}


