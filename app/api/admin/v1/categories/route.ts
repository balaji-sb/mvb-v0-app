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

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ categories: data })
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin(request)
  if (authCheck instanceof NextResponse) return authCheck

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  const { name, slug, description } = await request.json()

  const { data, error } = await supabase.from("categories").insert({ name, slug, description }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ category: data }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const authCheck = await requireAdmin(request)
  if (authCheck instanceof NextResponse) return authCheck

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  const { id, name, slug, description } = await request.json()

  const { data, error } = await supabase
    .from("categories")
    .update({ name, slug, description })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ category: data })
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
    return NextResponse.json({ error: "Category ID required" }, { status: 400 })
  }

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
