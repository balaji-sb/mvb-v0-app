import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashPassword } from "@/lib/admin/v1/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured. Please set up Supabase first." }, { status: 503 })
    }

    // Check if admin already exists
    const { data: existingAdmin } = await supabase.from("admin_v1_users").select("id").eq("email", email).maybeSingle()

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin user with this email already exists" }, { status: 400 })
    }

    // Hash password
    const salt = process.env.ADMIN_SALT || "default-salt-change-in-production"
    const passwordHash = hashPassword(password, salt)

    // Create admin user
    const { error } = await supabase.from("admin_v1_users").insert({
      name,
      email,
      password_hash: passwordHash,
    })

    if (error) {
      console.error("Setup error:", error)
      return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Admin user created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
