"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
}

export default function CategoryFilter({
  categories,
}: {
  categories: Category[]
}) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")

  return (
    <div className="lg:col-span-1">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Categories</h3>
        <div className="space-y-2">
          <Link href="/">
            <Button variant={!selectedCategory ? "default" : "ghost"} className="w-full justify-start">
              All Products
            </Button>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/?category=${category.id}`}>
              <Button variant={selectedCategory === category.id ? "default" : "ghost"} className="w-full justify-start">
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
