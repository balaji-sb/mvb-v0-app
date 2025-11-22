"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./admin-layout"
import { formatPrice } from "@/lib/utils/razorpay"

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_id: string | null
  created_at: string
  profiles?: { name: string; email: string }
  order_items?: Array<{
    quantity: number
    price: number
    products: { name: string; price: number }
  }>
}

function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const response = await fetch("/api/admin/v1/orders")
    const data = await response.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch("/api/admin/v1/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })

    if (response.ok) {
      loadOrders()
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.profiles?.name || "-"}</div>
                    <div className="text-sm text-gray-500">{order.profiles?.email || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-purple-600 hover:text-purple-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}

export default OrdersManager
