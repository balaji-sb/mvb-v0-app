import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/razorpay"

export const metadata = {
  title: "Order Success",
  description: "Your order has been placed successfully",
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const params = await searchParams
  const orderId = params.orderId

  if (!orderId) {
    redirect("/")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="font-semibold text-foreground mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {order.order_items && order.order_items.length > 0 && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Items Ordered</h3>
                <div className="space-y-3">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.products.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="max-w-2xl mx-auto flex gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          <Link href="/account" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Orders
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
