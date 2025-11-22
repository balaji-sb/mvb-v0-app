"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./admin-layout"

interface User {
  id: string
  name: string | null
  email: string | null
  created_at: string
}

function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const response = await fetch("/api/admin/v1/users")
    const data = await response.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
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

export default UsersManager
