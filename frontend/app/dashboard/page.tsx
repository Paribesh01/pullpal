import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome back, John</h1>
            <p className="text-muted-foreground text-pretty">Here's what's happening with your pull requests today.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
