import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET!

export async function POST(request: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

  console.log("[v0] Payment verification started:", {
    razorpay_order_id,
    razorpay_payment_id,
    orderId,
  })

  // Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const hash = crypto.createHmac("sha256", razorpayKeySecret).update(body).digest("hex")

  console.log("[v0] Signature verification:", {
    calculated: hash,
    received: razorpay_signature,
    match: hash === razorpay_signature,
  })

  if (hash !== razorpay_signature) {
    console.log("[v0] Signature verification failed")
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("[v0] User not authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle()

    console.log("[v0] Order lookup result:", { orderId, found: !!order, error: orderError })

    if (!order) {
      console.log("[v0] Order not found for user")
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get cart items
    const { data: cartItems } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id)

    console.log("[v0] Cart items found:", cartItems?.length || 0)

    // Create order items
    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.products.price,
        })

        if (itemError) {
          console.log("[v0] Error inserting order item:", itemError)
        }
      }

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", user.id)
      console.log("[v0] Cart cleared")
    }

    // Update order status and payment details
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "completed",
        razorpay_payment_id: razorpay_payment_id,
      })
      .eq("id", orderId)

    if (updateError) {
      console.log("[v0] Error updating order:", updateError)
      throw updateError
    }

    console.log("[v0] Payment verification successful")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed", details: String(error) }, { status: 500 })
  }
}
