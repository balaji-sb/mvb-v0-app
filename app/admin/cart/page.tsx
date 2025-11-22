import CartTable from "@/components/admin/cart-table"

export default function CartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shopping Carts</h1>
        <p className="text-muted-foreground mt-1">Monitor active shopping carts</p>
      </div>
      <CartTable />
    </div>
  )
}
