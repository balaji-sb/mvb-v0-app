"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product_name?: string
  product_price?: number
  user_email?: string
}

export default function CartPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1]

    if (token) {
      setIsAuthenticated(true)
      fetchCartItems()
    } else {
      router.push("/adminpanel/login")
    }
    setLoading(false)
  }, [router])

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/adminpanel/cart")
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error("Error fetching cart items:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this cart item?")) {
      try {
        const response = await fetch(`/api/adminpanel/cart?id=${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchCartItems()
        }
      } catch (error) {
        console.error("Error deleting cart item:", error)
      }
    }
  }

  const groupedCarts = cartItems.reduce(
    (acc, item) => {
      if (!acc[item.user_id]) {
        acc[item.user_id] = []
      }
      acc[item.user_id].push(item)
      return acc
    },
    {} as Record<string, CartItem[]>,
  )

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
              <a href="/adminpanel/cart" className="block px-4 py-2 text-white bg-[#8B2635] rounded-lg">
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
          <h2 className="text-3xl font-bold text-white mb-8">Active Carts</h2>

          {/* Cart Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Active Carts</div>
              <div className="text-3xl font-bold text-white">{Object.keys(groupedCarts).length}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Items</div>
              <div className="text-3xl font-bold text-blue-400">{cartItems.length}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Potential Revenue</div>
              <div className="text-3xl font-bold text-green-400">
                ₹{cartItems.reduce((sum, item) => sum + (item.product_price || 0) * item.quantity, 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Carts by User */}
          <div className="space-y-6">
            {Object.entries(groupedCarts).map(([userId, items]) => (
              <div key={userId} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white">{items[0]?.user_email || "Unknown User"}</h3>
                      <p className="text-gray-400 text-sm">{items.length} items in cart</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-xl">
                        ₹{items.reduce((sum, item) => sum + (item.product_price || 0) * item.quantity, 0).toFixed(2)}
                      </div>
                      <div className="text-gray-400 text-sm">Total Value</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="text-left py-3 px-6 text-gray-400 font-medium">Product</th>
                        <th className="text-left py-3 px-6 text-gray-400 font-medium">Price</th>
                        <th className="text-left py-3 px-6 text-gray-400 font-medium">Quantity</th>
                        <th className="text-left py-3 px-6 text-gray-400 font-medium">Subtotal</th>
                        <th className="text-left py-3 px-6 text-gray-400 font-medium">Added</th>
                        <th className="text-left py-3 px-6 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-6 text-white">{item.product_name || "Unknown Product"}</td>
                          <td className="py-3 px-6 text-gray-300">₹{(item.product_price || 0).toFixed(2)}</td>
                          <td className="py-3 px-6 text-white">{item.quantity}</td>
                          <td className="py-3 px-6 text-white">
                            ₹{((item.product_price || 0) * item.quantity).toFixed(2)}
                          </td>
                          <td className="py-3 px-6 text-gray-300">{new Date(item.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-6">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(groupedCarts).length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <div className="text-gray-400 text-lg">No active carts at the moment</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
