import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value
  if (!token) return null

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
    if (decoded.expires < Date.now()) return null
    return decoded
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const { name, description } = await request.json()
  const slug = name.toLowerCase().replace(/\s+/g, "-")

  const { data, error } = await supabase.from("categories").insert({ name, slug, description }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const { name, description } = await request.json()
  const slug = name.toLowerCase().replace(/\s+/g, "-")

  const { data, error } = await supabase
    .from("categories")
    .update({ name, slug, description })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
