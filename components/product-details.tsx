"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/razorpay"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock_quantity: number
  image_url: string
  categories: {
    name: string
    slug: string
  }
}

export default function ProductDetails({
  product,
  relatedProducts,
  isLoggedIn,
}: {
  product: Product
  relatedProducts: Product[]
  isLoggedIn: boolean
}) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      if (!response.ok) throw new Error("Failed to add to cart")
      router.push("/cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div>
          <Link href={`/?category=${product.categories.id}`} className="text-primary text-sm">
            {product.categories.name}
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mt-4">{formatPrice(product.price)}</p>

          <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">
              {product.stock_quantity > 0 ? (
                <span className="text-green-600 font-semibold">In Stock ({product.stock_quantity} available)</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                variant="outline"
                disabled={product.stock_quantity === 0}
              >
                −
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                variant="outline"
                disabled={product.stock_quantity === 0 || quantity >= product.stock_quantity}
              >
                +
              </Button>
            </div>
            <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0 || isAdding} className="flex-1">
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <Link key={relProduct.id} href={`/products/${relProduct.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-0 overflow-hidden">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={relProduct.image_url || "/placeholder.svg"}
                        alt={relProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground truncate">{relProduct.name}</h3>
                      <p className="text-lg font-bold text-primary mt-2">{formatPrice(relProduct.price)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
