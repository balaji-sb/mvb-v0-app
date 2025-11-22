import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import ProductDetails from "@/components/product-details"

export const metadata = {
  title: "Product Details",
  description: "View product details",
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single()

  if (!product) {
    notFound()
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductDetails product={product} relatedProducts={relatedProducts || []} isLoggedIn={!!user} />
      </main>
    </div>
  )
}
