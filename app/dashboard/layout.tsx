import type React from "react"
import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
