import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("[v0] Supabase environment variables not configured")
    return null
  }

  return supabaseCreateClient(url, key)
}
