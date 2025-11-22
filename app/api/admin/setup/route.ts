import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashPassword } from "@/lib/admin/auth"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured. Please set up Supabase integration first." },
        { status: 500 },
      )
    }

    // Check if admin table exists and if any admin already exists
    const { data: existingAdmin } = await supabase.from("admin_users").select("id").limit(1).maybeSingle()

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin account already exists. Please use the login page." }, { status: 400 })
    }

    // Create the admin user
    const passwordHash = hashPassword(password)
    const { data: newAdmin, error: insertError } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Admin creation error:", insertError)
      return NextResponse.json(
        { error: "Failed to create admin account. Please ensure the admin_users table exists." },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: { id: newAdmin.id, email: newAdmin.email },
    })
  } catch (error) {
    console.error("[v0] Admin setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
