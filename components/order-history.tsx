"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils/razorpay"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: Array<{
    id: string
    quantity: number
    price_at_purchase: number
    products: {
      name: string
      slug: string
    }
  }>
}

export default function OrderHistory({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No orders yet. Start shopping!</p>
          <Link href="/" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">Items:</p>
                <div className="space-y-1">
                  {order.order_items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.products.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {item.products.name} x{item.quantity}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <p className="font-bold">{formatPrice(order.total_amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
