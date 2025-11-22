import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import CategoryFilter from "@/components/category-filter"
import ProductGrid from "@/components/product-grid"
import HeroCarousel from "@/components/hero-carousel"
import FeaturedSection from "@/components/featured-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

export const metadata = {
  title: "Mahi's Vriksham Boutique - Aari & Sewing Materials",
  description:
    "Premium aari embroidery threads, sewing supplies, fine fabrics, and boutique materials. Shop authentic embroidery materials.",
}

async function getCategories() {
  const supabase = await createClient()
  if (!supabase) return []

  const { data } = await supabase.from("categories").select("*").order("name")
  return data || []
}

async function getProducts(categoryId?: string) {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase.from("products").select("*")

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data } = await query.order("created_at", { ascending: false })
  return data || []
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categories = await getCategories()
  const products = await getProducts(params.category)

  const supabase = await createClient()
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-foreground">Supabase Setup Required</h1>
            <p className="text-lg text-muted-foreground">
              To use this e-commerce platform, you need to connect Supabase and run the database setup scripts.
            </p>
            <div className="bg-muted p-6 rounded-lg text-left space-y-4">
              <h2 className="font-semibold text-lg">Setup Steps:</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Click "Connect" in the sidebar and add the Supabase integration</li>
                <li>Set up your Supabase environment variables in the "Vars" section</li>
                <li>
                  Run the database scripts from the scripts folder:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>001_create_tables.sql</li>
                    <li>002_seed_data.sql</li>
                    <li>003_admin_setup.sql</li>
                  </ul>
                </li>
                <li>Set up Razorpay credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) in "Vars"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <HeroCarousel />

          <FeaturedSection />

          {/* Shop Section */}
          <section className="py-12 md:py-16">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Explore Our Collection</h2>
                <Link href="/?category=">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground">Discover premium aari, sewing supplies, and fine fabrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <Suspense fallback={<div>Loading categories...</div>}>
                <CategoryFilter categories={categories} />
              </Suspense>

              <div className="lg:col-span-3">
                <Suspense fallback={<div>Loading products...</div>}>
                  <ProductGrid products={products} />
                </Suspense>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
