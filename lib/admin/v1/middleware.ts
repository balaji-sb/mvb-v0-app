import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "./auth"

export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_v1_session")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = verifySessionToken(token)
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
  }

  return session
}
