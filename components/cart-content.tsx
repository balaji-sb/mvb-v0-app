"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/razorpay"

interface CartItem {
  id: string
  quantity: number
  products: {
    id: string
    name: string
    price: number
    slug: string
    image_url: string
  }
}

export default function CartContent({
  initialItems,
}: {
  initialItems: CartItem[]
}) {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      const supabase = createClient()
      await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", cartItemId)

      setItems(items.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (cartItemId: string) => {
    setIsUpdating(true)
    try {
      const supabase = createClient()
      await supabase.from("cart_items").delete().eq("id", cartItemId)
      setItems(items.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const total = items.reduce((sum, item) => sum + item.products.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-6">Your cart is empty</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={item.products.image_url || "/placeholder.svg"}
                  alt={item.products.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <Link href={`/products/${item.products.slug}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary">{item.products.name}</h3>
                  </Link>
                  <p className="text-primary font-bold mt-2">{formatPrice(item.products.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button onClick={() => removeItem(item.id)} variant="ghost" size="sm" disabled={isUpdating}>
                    Remove
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                    >
                      −
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
            <Link href="/" className="mt-2 block">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
