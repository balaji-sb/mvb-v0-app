"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock_quantity: number
  category_id: string
  image_url: string
  created_at: string
}

interface Category {
  id: string
  name: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    image_url: "",
  })

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1]

    if (token) {
      setIsAuthenticated(true)
      fetchProducts()
      fetchCategories()
    } else {
      router.push("/adminpanel/login")
    }
    setLoading(false)
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/adminpanel/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/adminpanel/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProduct ? `/api/adminpanel/products?id=${editingProduct.id}` : "/api/adminpanel/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          stock_quantity: Number.parseInt(formData.stock_quantity),
        }),
      })

      if (response.ok) {
        fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: "",
          stock_quantity: "",
          category_id: "",
          image_url: "",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id,
      image_url: product.image_url,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/adminpanel/products?id=${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
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
              <a href="/adminpanel/products" className="block px-4 py-2 text-white bg-[#8B2635] rounded-lg">
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
            <h2 className="text-3xl font-bold text-white">Products</h2>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingProduct(null)
                setFormData({
                  name: "",
                  slug: "",
                  description: "",
                  price: "",
                  stock_quantity: "",
                  category_id: "",
                  image_url: "",
                })
              }}
              className="px-6 py-3 bg-[#8B2635] text-white rounded-lg hover:bg-[#6d1d29] transition"
            >
              Add Product
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8B2635]"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8B2635] text-white rounded-lg hover:bg-[#6d1d29] transition"
                  >
                    {editingProduct ? "Update" : "Create"} Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingProduct(null)
                    }}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Product</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Category</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Price</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Stock</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="text-white font-medium">{product.name}</div>
                            <div className="text-gray-500 text-sm">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {categories.find((c) => c.id === product.category_id)?.name || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-white">₹{product.price.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            product.stock_quantity > 10
                              ? "bg-green-500/20 text-green-400"
                              : product.stock_quantity > 0
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
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
