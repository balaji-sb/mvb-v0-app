"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminLayout from "./admin-layout"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category_id: string
  stock_quantity: number
  image_url: string | null
  categories?: { name: string }
}

interface Category {
  id: string
  name: string
}

function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "",
    image_url: "",
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    const response = await fetch("/api/admin/v1/products")
    const data = await response.json()
    setProducts(data.products || [])
    setLoading(false)
  }

  const loadCategories = async () => {
    const response = await fetch("/api/admin/v1/categories")
    const data = await response.json()
    setCategories(data.categories || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const method = editingId ? "PUT" : "POST"
    const body = editingId
      ? {
          ...formData,
          id: editingId,
          price: Number.parseFloat(formData.price),
          stock_quantity: Number.parseInt(formData.stock_quantity),
        }
      : {
          ...formData,
          price: Number.parseFloat(formData.price),
          stock_quantity: Number.parseInt(formData.stock_quantity),
        }

    const response = await fetch("/api/admin/v1/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      loadProducts()
      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        category_id: "",
        stock_quantity: "",
        image_url: "",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price.toString(),
      category_id: product.category_id,
      stock_quantity: product.stock_quantity.toString(),
      image_url: product.image_url || "",
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    const response = await fetch(`/api/admin/v1/products?id=${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      loadProducts()
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({
              name: "",
              slug: "",
              description: "",
              price: "",
              category_id: "",
              stock_quantity: "",
              image_url: "",
            })
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Product" : "New Product"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.categories?.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEdit(product)} className="text-purple-600 hover:text-purple-900 mr-4">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
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

export default ProductsManager
