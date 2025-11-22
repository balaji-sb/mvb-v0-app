import crypto from "crypto"

export function hashPassword(password: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex")
}

export function verifyPassword(password: string, hashedPassword: string, salt: string): boolean {
  const hash = hashPassword(password, salt)
  return hash === hashedPassword
}

export function createSessionToken(adminId: string): string {
  const sessionData = {
    adminId,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(sessionData)).toString("base64")
}

export function verifySessionToken(token: string): { adminId: string; expiresAt: number } | null {
  try {
    const sessionData = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
    if (sessionData.expiresAt < Date.now()) {
      return null
    }
    return sessionData
  } catch {
    return null
  }
}
