import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyPassword, createSessionToken } from "@/lib/admin/v1/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured. Please set up Supabase first." }, { status: 503 })
    }

    // Get admin user from database
    const { data: admin, error } = await supabase.from("admin_v1_users").select("*").eq("email", email).maybeSingle()

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const salt = process.env.ADMIN_SALT || "default-salt-change-in-production"
    const isValid = verifyPassword(password, admin.password_hash, salt)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token
    const token = createSessionToken(admin.id)

    // Set cookie
    const response = NextResponse.json({ success: true, message: "Login successful" }, { status: 200 })

    response.cookies.set("admin_v1_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
