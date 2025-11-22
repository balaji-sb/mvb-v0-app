import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifySessionToken } from "@/lib/admin/v1/auth"
import { createClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin/v1/dashboard"

export default async function AdminV1DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_v1_session")?.value

  if (!token) {
    redirect("/admin/v1/login")
  }

  const session = verifySessionToken(token)
  if (!session) {
    redirect("/admin/v1/login")
  }

  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Database Not Configured</h1>
          <p className="text-gray-600">Please set up Supabase integration first.</p>
        </div>
      </div>
    )
  }

  // Fetch dashboard stats
  const [categoriesCount, productsCount, ordersCount, usersCount] = await Promise.all([
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ])

  const stats = {
    categories: categoriesCount.count || 0,
    products: productsCount.count || 0,
    orders: ordersCount.count || 0,
    users: usersCount.count || 0,
  }

  return <AdminDashboard stats={stats} />
}
