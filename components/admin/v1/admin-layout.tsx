"use client"

import type React from "react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/admin/v1/logout", { method: "POST" })
    router.push("/admin/v1/login")
  }

  const navItems = [
    { href: "/admin/v1", label: "Dashboard" },
    { href: "/admin/v1/categories", label: "Categories" },
    { href: "/admin/v1/products", label: "Products" },
    { href: "/admin/v1/orders", label: "Orders" },
    { href: "/admin/v1/users", label: "Users" },
    { href: "/admin/v1/cart", label: "Cart" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/v1" className="text-xl font-bold text-purple-600">
                Admin Panel
              </Link>
              <div className="hidden md:flex gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}
