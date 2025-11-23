"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminSetup() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/adminpanel/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/adminpanel/login?success=Account created successfully")
      } else {
        setError(data.error || "Failed to create account")
      }
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md p-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-gray-400 mb-6">Create your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#8B2635] transition"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#8B2635] transition"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#8B2635] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B2635] hover:bg-[#6d1e29] text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <a href="/adminpanel/login" className="text-[#8B2635] hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
