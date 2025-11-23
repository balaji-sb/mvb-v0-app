import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

function getAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getAdminClient()
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
  console.log("[v0] POST /api/adminpanel/categories - Starting category creation")

  const admin = verifyAdmin(request)
  if (!admin) {
    console.log("[v0] Admin verification failed")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("[v0] Admin verified:", admin)

  const supabase = getAdminClient()
  if (!supabase) {
    console.log("[v0] Supabase client is null - checking environment variables")
    console.log("[v0] SUPABASE_URL:", process.env.SUPABASE_URL ? "present" : "missing")
    console.log("[v0] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "missing")
    console.log("[v0] SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing")
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const body = await request.json()
  console.log("[v0] Request body:", body)

  const { name, description } = body
  const slug = name.toLowerCase().replace(/\s+/g, "-")

  console.log("[v0] Inserting category:", { name, slug, description })

  const { data, error } = await supabase.from("categories").insert({ name, slug, description }).select().single()

  if (error) {
    console.log("[v0] Supabase error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log("[v0] Category created successfully:", data)
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getAdminClient()
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

  const supabase = getAdminClient()
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
