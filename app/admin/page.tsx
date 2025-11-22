"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your boutique inventory and operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a href="/admin/categories" className="p-4 border rounded-lg hover:bg-secondary/10 transition">
              <div className="font-medium">Categories</div>
              <div className="text-sm text-muted-foreground">Manage product categories</div>
            </a>
            <a href="/admin/products" className="p-4 border rounded-lg hover:bg-secondary/10 transition">
              <div className="font-medium">Products</div>
              <div className="text-sm text-muted-foreground">Add & edit products</div>
            </a>
            <a href="/admin/orders" className="p-4 border rounded-lg hover:bg-secondary/10 transition">
              <div className="font-medium">Orders</div>
              <div className="text-sm text-muted-foreground">View all orders</div>
            </a>
            <a href="/admin/users" className="p-4 border rounded-lg hover:bg-secondary/10 transition">
              <div className="font-medium">Users</div>
              <div className="text-sm text-muted-foreground">Manage customers</div>
            </a>
            <a href="/admin/cart" className="p-4 border rounded-lg hover:bg-secondary/10 transition">
              <div className="font-medium">Cart Items</div>
              <div className="text-sm text-muted-foreground">Monitor active carts</div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
