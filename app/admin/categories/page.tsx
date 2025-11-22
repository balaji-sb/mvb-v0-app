import CategoriesTable from "@/components/admin/categories-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>Add Category</Button>
        </Link>
      </div>
      <CategoriesTable />
    </div>
  )
}
