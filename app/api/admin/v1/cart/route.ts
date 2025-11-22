import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin/v1/middleware"

export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin(request)
  if (authCheck instanceof NextResponse) return authCheck

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products(name, price, image_url),
      profiles(name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cartItems: data })
}

export async function DELETE(request: NextRequest) {
  const authCheck = await requireAdmin(request)
  if (authCheck instanceof NextResponse) return authCheck

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Cart item ID required" }, { status: 400 })
  }

  const { error } = await supabase.from("cart_items").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
