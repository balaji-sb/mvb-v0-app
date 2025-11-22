import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const razorpayKeyId = process.env.RAZORPAY_KEY_ID!
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET!

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cartItems, total, userInfo } = await request.json()

  try {
    // Create order in database
    const { data: order } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: total,
        status: "pending",
      })
      .select()
      .single()

    if (!order) throw new Error("Failed to create order")

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(order.id, total, user.email)

    // Update order with Razorpay order ID
    await supabase.from("orders").update({ stripe_payment_id: razorpayOrder.id }).eq("id", order.id)

    return NextResponse.json({
      orderId: razorpayOrder.id,
      razorpayKeyId,
      userEmail: user.email,
      userName: userInfo.firstName + " " + userInfo.lastName,
      amount: total * 100, // Convert to paise
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}

async function createRazorpayOrder(orderId: string, amount: number, email: string) {
  const notes = {
    order_id: orderId,
    email: email,
  }

  const body = {
    amount: Math.round(amount * 100), // Convert to paise (smallest unit)
    currency: "INR",
    receipt: orderId,
    notes,
  }

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error(
      "Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.",
    )
  }

  // Validate credential format (should start with rzp_test_ or rzp_live_)
  if (!razorpayKeyId.startsWith("rzp_")) {
    throw new Error(
      `Invalid Razorpay KEY_ID format. Expected format: rzp_test_xxxxx or rzp_live_xxxxx, but got: ${razorpayKeyId.substring(0, 10)}...`,
    )
  }

  const credentials = `${razorpayKeyId}:${razorpayKeySecret}`
  const auth = Buffer.from(credentials).toString("base64")

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(`Failed to create Razorpay order: ${JSON.stringify(responseData)}`)
  }

  return responseData
}
