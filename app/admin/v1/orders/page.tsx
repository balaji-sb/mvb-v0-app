import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifySessionToken } from "@/lib/admin/v1/auth"
import OrdersManager from "@/components/admin/v1/orders-manager"

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_v1_session")?.value

  if (!token) {
    redirect("/admin/v1/login")
  }

  const session = verifySessionToken(token)
  if (!session) {
    redirect("/admin/v1/login")
  }

  return <OrdersManager />
}
