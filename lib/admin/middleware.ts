import { cookies } from "next/headers"

export async function verifyAdminSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value

  if (!sessionToken) {
    return null
  }

  try {
    // In production, validate token against database
    const decodedToken = JSON.parse(Buffer.from(sessionToken, "base64").toString())
    if (decodedToken.exp && decodedToken.exp < Date.now()) {
      return null
    }
    return decodedToken
  } catch {
    return null
  }
}

export function createSessionToken(adminId: string) {
  const payload = {
    adminId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}
