import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET all orders with user email
export async function GET() {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (ordersError) throw ordersError

    // Fetch user emails for each order
    const ordersWithEmails = await Promise.all(
      orders.map(async (order) => {
        const { data: profile } = await supabase.from("profiles").select("email").eq("id", order.user_id).maybeSingle()

        return {
          ...order,
          user_email: profile?.email || "N/A",
        }
      }),
    )

    return NextResponse.json(ordersWithEmails)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// PUT update order status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()

    const { data, error } = await supabase
      .from("orders")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
