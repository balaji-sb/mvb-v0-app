import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import CheckoutForm from "@/components/checkout-form"

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase",
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id)

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>
        <CheckoutForm cartItems={cartItems} total={total} profile={profile} user={user} />
      </main>
    </div>
  )
}
