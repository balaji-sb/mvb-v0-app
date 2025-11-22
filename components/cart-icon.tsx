"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const getCartCount = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setCartCount(0)
          return
        }

        const { data } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id)

        const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setCartCount(total)
      } catch (error) {
        console.error("Error fetching cart count:", error)
      }
    }

    getCartCount()
  }, [])

  return (
    <Link href="/cart">
      <Button variant="ghost" className="relative">
        <span>🛒</span>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
