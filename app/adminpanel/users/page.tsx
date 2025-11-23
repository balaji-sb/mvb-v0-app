"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  city: string
  created_at: string
}

export default function UsersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1]

    if (token) {
      setIsAuthenticated(true)
      fetchUsers()
    } else {
      router.push("/adminpanel/login")
    }
    setLoading(false)
  }, [router])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/adminpanel/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <a href="/adminpanel/users" className="block px-4 py-2 text-white bg-[#8B2635] rounded-lg">
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
            <h2 className="text-3xl font-bold text-white">Users</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635] w-80"
              />
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Users</div>
              <div className="text-3xl font-bold text-white">{users.length}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">New This Month</div>
              <div className="text-3xl font-bold text-green-400">
                {
                  users.filter(
                    (u) =>
                      new Date(u.created_at).getMonth() === new Date().getMonth() &&
                      new Date(u.created_at).getFullYear() === new Date().getFullYear(),
                  ).length
                }
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">With Phone</div>
              <div className="text-3xl font-bold text-blue-400">{users.filter((u) => u.phone).length}</div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Phone</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Location</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{user.email}</td>
                      <td className="py-4 px-6 text-gray-300">{user.phone || "N/A"}</td>
                      <td className="py-4 px-6 text-gray-300">{user.city || "N/A"}</td>
                      <td className="py-4 px-6 text-gray-300">{new Date(user.created_at).toLocaleDateString()}</td>
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
