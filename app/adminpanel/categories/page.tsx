"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/adminpanel/login")
      return
    }

    fetchCategories()
  }, [router])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/adminpanel/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Submitting category form")
    console.log("[v0] Form data:", formData)
    console.log("[v0] Editing:", editing)

    const method = editing ? "PUT" : "POST"
    const url = editing ? `/api/adminpanel/categories?id=${editing}` : "/api/adminpanel/categories"

    console.log("[v0] Request:", { method, url })

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      console.log("[v0] Response status:", response.status)

      const responseData = await response.json()
      console.log("[v0] Response data:", responseData)

      if (response.ok) {
        console.log("[v0] Category saved successfully")
        fetchCategories()
        setShowForm(false)
        setEditing(null)
        setFormData({ name: "", description: "" })
      } else {
        console.error("[v0] Failed to save category:", responseData)
        alert(`Error: ${responseData.error || "Failed to save category"}`)
      }
    } catch (error) {
      console.error("[v0] Failed to save category:", error)
      alert("Network error: Failed to save category")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/adminpanel/categories?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
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
              <a href="/adminpanel/categories" className="block px-4 py-2 text-white bg-[#8B2635] rounded-lg">
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Categories</h2>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditing(null)
                setFormData({ name: "", description: "" })
              }}
              className="px-6 py-3 bg-[#8B2635] hover:bg-[#6d1e29] text-white font-medium rounded-lg transition"
            >
              {showForm ? "Cancel" : "Add Category"}
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">{editing ? "Edit Category" : "New Category"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#8B2635] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#8B2635] transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8B2635] hover:bg-[#6d1e29] text-white font-medium rounded-lg transition"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </form>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No categories found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Slug</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-white">{category.name}</td>
                        <td className="py-3 px-4 text-gray-300">{category.slug}</td>
                        <td className="py-3 px-4 text-gray-300">{category.description}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditing(category.id)
                              setFormData({
                                name: category.name,
                                description: category.description,
                              })
                              setShowForm(true)
                            }}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
