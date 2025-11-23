"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminPanelHome() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1]

    if (token) {
      setIsAuthenticated(true)
    } else {
      router.push("/adminpanel/login")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white mb-8">Mahi's Boutique</h1>
            <nav className="space-y-2">
              <a href="/adminpanel" className="block px-4 py-2 text-white bg-[#8B2635] rounded-lg">
                Dashboard
              </a>
              <a
                href="/adminpanel/categories"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                Categories
              </a>
              <a
                href="/adminpanel/products"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                Products
              </a>
              <a
                href="/adminpanel/orders"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                Orders
              </a>
              <a
                href="/adminpanel/users"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                Users
              </a>
              <a
                href="/adminpanel/cart"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                Cart
              </a>
              <button
                onClick={() => {
                  document.cookie = "admin_token=; Max-Age=0; path=/"
                  router.push("/adminpanel/login")
                }}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
              >
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Products</div>
              <div className="text-3xl font-bold text-white">124</div>
              <div className="text-green-500 text-sm mt-2">+12% from last month</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Orders</div>
              <div className="text-3xl font-bold text-white">562</div>
              <div className="text-green-500 text-sm mt-2">+8% from last month</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Users</div>
              <div className="text-3xl font-bold text-white">1,234</div>
              <div className="text-green-500 text-sm mt-2">+23% from last month</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Revenue</div>
              <div className="text-3xl font-bold text-white">₹1,24,500</div>
              <div className="text-green-500 text-sm mt-2">+15% from last month</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white">#ORD-001</td>
                    <td className="py-3 px-4 text-gray-300">Priya Sharma</td>
                    <td className="py-3 px-4 text-white">₹2,450</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Completed</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white">#ORD-002</td>
                    <td className="py-3 px-4 text-gray-300">Anjali Reddy</td>
                    <td className="py-3 px-4 text-white">₹3,200</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Pending</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-white">#ORD-003</td>
                    <td className="py-3 px-4 text-gray-300">Sneha Patel</td>
                    <td className="py-3 px-4 text-white">₹1,890</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Processing</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
