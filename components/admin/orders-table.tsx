"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils/razorpay"

interface Order {
  id: string
  total_amount: number
  status: string
  payment_id: string | null
  profile: {
    full_name: string
    email: string
  }
  created_at: string
  order_items: Array<{
    quantity: number
    price: number
    product: {
      name: string
    }
  }>
}

interface OrdersTableProps {
  orders: Order[]
  onStatusChange: (id: string, status: string) => void
}

export function OrdersTable({ orders, onStatusChange }: OrdersTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.profile?.full_name}</div>
                  <div className="text-xs text-muted-foreground">{order.profile?.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {order.order_items?.map((item, i) => (
                    <div key={i}>
                      {item.quantity}x {item.product?.name}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-semibold">{formatPrice(order.total_amount)}</TableCell>
              <TableCell>
                <Select value={order.status} onValueChange={(value) => onStatusChange(order.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="font-mono text-xs">{order.payment_id || "N/A"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrdersTable
