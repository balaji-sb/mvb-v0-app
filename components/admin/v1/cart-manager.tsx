"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./admin-layout"
import { formatPrice } from "@/lib/utils/razorpay"

interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products: {
    name: string
    price: number
    image_url: string | null
  }
  profiles: {
    name: string | null
    email: string | null
  }
}

function CartManager() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    const response = await fetch("/api/admin/v1/cart")
    const data = await response.json()
    setCartItems(data.cartItems || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this item from cart?")) return

    const response = await fetch(`/api/admin/v1/cart?id=${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      loadCartItems()
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart Items</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.profiles?.name || "-"}</div>
                    <div className="text-sm text-gray-500">{item.profiles?.email || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.products?.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {formatPrice((item.products?.price || 0) * item.quantity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                      Remove
                    </button>
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

export default CartManager
