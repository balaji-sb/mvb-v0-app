"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminLayout from "./admin-layout"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const response = await fetch("/api/admin/v1/categories")
    const data = await response.json()
    setCategories(data.categories || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const method = editingId ? "PUT" : "POST"
    const body = editingId ? { ...formData, id: editingId } : formData

    const response = await fetch("/api/admin/v1/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      loadCategories()
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: "", slug: "", description: "" })
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    const response = await fetch(`/api/admin/v1/categories?id=${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      loadCategories()
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: "", slug: "", description: "" })
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Category" : "New Category"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 text-gray-500">{category.description || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEdit(category)} className="text-purple-600 hover:text-purple-900 mr-4">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                      Delete
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

export default CategoriesManager
