import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import AccountProfile from "@/components/account-profile"
import OrderHistory from "@/components/order-history"

export const metadata = {
  title: "My Account",
  description: "Manage your account and view orders",
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
    })
    // Fetch the newly created profile
    const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
    profile = newProfile
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <AccountProfile user={user} profile={profile} />
        </div>

        <OrderHistory orders={orders || []} />
      </main>
    </div>
  )
}
