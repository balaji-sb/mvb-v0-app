"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  stripe_payment_id: string
  created_at: string
  user_email?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1]

    if (token) {
      setIsAuthenticated(true)
      fetchOrders()
    } else {
      router.push("/adminpanel/login")
    }
    setLoading(false)
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/adminpanel/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/adminpanel/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

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
              <a href="/adminpanel" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
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
              <a href="/adminpanel/orders" className="block px-4 py-2 text-white bg-[#8B2635] rounded-lg">
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Orders</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "all" ? "bg-[#8B2635] text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "pending" ? "bg-[#8B2635] text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("processing")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "processing" ? "bg-[#8B2635] text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "completed" ? "bg-[#8B2635] text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Orders Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Orders</div>
              <div className="text-3xl font-bold text-white">{orders.length}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Pending</div>
              <div className="text-3xl font-bold text-yellow-400">
                {orders.filter((o) => o.status === "pending").length}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Processing</div>
              <div className="text-3xl font-bold text-blue-400">
                {orders.filter((o) => o.status === "processing").length}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Completed</div>
              <div className="text-3xl font-bold text-green-400">
                {orders.filter((o) => o.status === "completed").length}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Order ID</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Customer</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 px-6 text-white font-mono text-sm">{order.id.substring(0, 8)}...</td>
                      <td className="py-4 px-6 text-gray-300">{order.user_email || "N/A"}</td>
                      <td className="py-4 px-6 text-white">₹{order.total_amount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#8B2635]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
