import crypto from "crypto"

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + process.env.ADMIN_SALT)
    .digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function createSessionToken(adminId: string): string {
  const payload = {
    adminId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}
