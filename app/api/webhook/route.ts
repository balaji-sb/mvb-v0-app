import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("x-razorpay-signature") || ""

  // Verify Razorpay signature
  const hash = crypto.createHmac("sha256", razorpayKeySecret).update(body).digest("hex")

  if (hash !== signature) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = await createClient()

  if (event.event === "payment.authorized" || event.event === "payment.captured") {
    const payment = event.payload.payment.entity
    const orderId = payment.notes?.order_id

    if (!orderId) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    // Get the order
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*), cart_items(*)")
      .eq("stripe_payment_id", payment.order_id)
      .maybeSingle()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get cart items for this order's user
    const { data: cartItems } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", order.user_id)

    // Create order items from cart
    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.products.price,
        })
      }

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", order.user_id)
    }

    // Update order status
    await supabase.from("orders").update({ status: "completed" }).eq("id", order.id)
  } else if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity
    const orderId = payment.notes?.order_id

    if (orderId) {
      await supabase.from("orders").update({ status: "failed" }).eq("stripe_payment_id", payment.order_id)
    }
  }

  return NextResponse.json({ received: true })
}
