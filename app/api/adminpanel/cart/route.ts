import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET all cart items with product and user details
export async function GET() {
  try {
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*")
      .order("created_at", { ascending: false })

    if (cartError) throw cartError

    // Fetch product and user details for each cart item
    const cartWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const { data: product } = await supabase
          .from("products")
          .select("name, price")
          .eq("id", item.product_id)
          .maybeSingle()

        const { data: profile } = await supabase.from("profiles").select("email").eq("id", item.user_id).maybeSingle()

        return {
          ...item,
          product_name: product?.name || "Unknown Product",
          product_price: product?.price || 0,
          user_email: profile?.email || "Unknown User",
        }
      }),
    )

    return NextResponse.json(cartWithDetails)
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
  }
}

// DELETE cart item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const { error } = await supabase.from("cart_items").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
  }
}
