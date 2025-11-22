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
    .from("orders")
    .select(`
      *,
      profiles(name, email),
      order_items(*, products(name, price))
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}

export async function PUT(request: NextRequest) {
  const authCheck = await requireAdmin(request)
  if (authCheck instanceof NextResponse) return authCheck

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  const { id, status } = await request.json()

  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ order: data })
}
