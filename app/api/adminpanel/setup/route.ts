import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: existing } = await supabase.from("admin_v1_users").select("id").eq("email", email).maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const salt = process.env.ADMIN_SALT || "default-salt"
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    // Create admin user
    const { data: admin, error } = await supabase
      .from("admin_v1_users")
      .insert({
        name,
        email,
        password_hash: hashedPassword,
      })
      .select()
      .single()

    if (error) {
      console.error("Setup error:", error)
      return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
    }

    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}
