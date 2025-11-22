import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import CartContent from "@/components/cart-content"

export const metadata = {
  title: "Shopping Cart",
  description: "Review your shopping cart",
}

export default async function CartPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>
        <CartContent initialItems={cartItems || []} />
      </main>
    </div>
  )
}
