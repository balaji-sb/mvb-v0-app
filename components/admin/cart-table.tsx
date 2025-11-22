"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatPrice } from "@/lib/utils/razorpay"

interface CartItem {
  id: string
  quantity: number
  product: {
    name: string
    price: number
    image_url: string
  }
  profile: {
    full_name: string
    email: string
  }
  created_at: string
}

interface CartTableProps {
  cartItems: CartItem[]
  onDelete: (id: string) => void
}

export function CartTable({ cartItems, onDelete }: CartTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cart item?")) return

    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.image_url || "/placeholder.svg"}
                    alt={item.product?.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <span className="font-medium">{item.product?.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{item.profile?.full_name}</div>
                  <div className="text-xs text-muted-foreground">{item.profile?.email}</div>
                </div>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatPrice(item.product?.price)}</TableCell>
              <TableCell className="font-semibold">{formatPrice(item.product?.price * item.quantity)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CartTable
