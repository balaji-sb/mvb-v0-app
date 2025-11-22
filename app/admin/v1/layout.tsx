import type React from "react"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/admin/v1/auth"

export default async function AdminV1Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_v1_session")?.value

  // Allow access to login and setup pages
  if (!token) {
    return <>{children}</>
  }

  // Verify token
  const session = verifySessionToken(token)
  if (!session) {
    return <>{children}</>
  }

  return <>{children}</>
}
