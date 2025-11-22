"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardProps {
  stats: {
    categories: number
    products: number
    orders: number
    users: number
  }
}

export default function AdminDashboard({ stats }: DashboardProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/v1/logout", { method: "POST" })
    router.push("/admin/v1/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your boutique</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Categories</div>
            <div className="text-3xl font-bold text-purple-600">{stats.categories}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Products</div>
            <div className="text-3xl font-bold text-purple-600">{stats.products}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Orders</div>
            <div className="text-3xl font-bold text-purple-600">{stats.orders}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Users</div>
            <div className="text-3xl font-bold text-purple-600">{stats.users}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/v1/categories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Categories</h3>
            <p className="text-gray-600">Manage product categories</p>
          </Link>

          <Link href="/admin/v1/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Products</h3>
            <p className="text-gray-600">Add and edit products</p>
          </Link>

          <Link href="/admin/v1/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders</h3>
            <p className="text-gray-600">View and manage orders</p>
          </Link>

          <Link href="/admin/v1/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Users</h3>
            <p className="text-gray-600">View registered users</p>
          </Link>

          <Link href="/admin/v1/cart" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cart Items</h3>
            <p className="text-gray-600">Monitor active carts</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
