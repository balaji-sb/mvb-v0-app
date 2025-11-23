import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const salt = process.env.ADMIN_SALT || "default-salt"
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    const { data: admin, error } = await supabase
      .from("admin_v1_users")
      .select("*")
      .eq("email", email)
      .eq("password_hash", hashedPassword)
      .maybeSingle()

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session token
    const token = Buffer.from(
      JSON.stringify({
        id: admin.id,
        email: admin.email,
        expires: Date.now() + 86400000, // 24 hours
      }),
    ).toString("base64")

    return NextResponse.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
