import type React from "react"
import { verifyAdminSession } from "@/lib/admin/middleware"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifyAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
