"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  console.log("[v0] Admin v1 login page rendering")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] Login attempt for:", email)

    try {
      const response = await fetch("/api/admin/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] Login response:", data)

      if (!response.ok) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      router.push("/admin/v1")
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred during login")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin V1 Login</h1>
            <p className="text-gray-600">Mahi's Vriksham Boutique</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin/v1/setup" className="text-sm text-purple-600 hover:text-purple-800">
              First time? Create admin account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
