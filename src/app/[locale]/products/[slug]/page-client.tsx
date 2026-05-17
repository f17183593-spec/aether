"use client"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useCartStore } from "@/store/cart-store"
import { useCurrencyStore } from "@/hooks/use-currency"
import { convertPrice, formatCurrency } from "@/lib/currency"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product/product-card"
import { Star, ShoppingCart, Check, Shield, Truck, RotateCcw } from "lucide-react"
import type { Locale } from "@/types"

interface ProductPageData {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  images: string[]
  attributes: Record<string, string>
  rating: number
  reviewCount: number
  inStock: boolean
  stock: number
  category: { name: string; slug: string }
  reviews: {
    id: string
    rating: number
    title: string | null
    comment: string | null
    createdAt: Date
    user: { name: string | null; image: string | null }
  }[]
  related: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    images: string[]
    rating: number
    reviewCount: number
    inStock: boolean
    stock: number
    category: string
  }[]
}

export function ProductDetailClient({ product }: { product: ProductPageData }) {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const { addItem } = useCartStore()
  const { currency } = useCurrencyStore()
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-aether-900/20 via-transparent to-pink-900/10" />
          <div className="text-8xl opacity-10">✦</div>
          {discount > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="danger">-{discount}%</Badge>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{product.category.name}</p>
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-aether-400 text-aether-400" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount} {dict.product.reviews})</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold gradient-text">
              {formatCurrency(convertPrice(product.price, "USD", currency), currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(convertPrice(product.compareAtPrice, "USD", currency), currency)}
              </span>
            )}
          </div>

          <p className="text-gray-400 leading-relaxed">{product.description}</p>

          {Object.keys(product.attributes).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300">{dict.product.attributes}</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">{key}:</span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {product.inStock ? (
              <Badge variant="success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="danger">{dict.product.outOfStock}</Badge>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              size="lg"
              disabled={!product.inStock}
              onClick={() =>
                addItem({
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image: product.images[0] || "",
                  quantity: 1,
                  stock: product.stock,
                })
              }
            >
              <ShoppingCart className="w-5 h-5" />
              {dict.product.addToCart}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $200" },
              { icon: Shield, label: "Secure", desc: "256-bit SSL" },
              { icon: RotateCcw, label: "Returns", desc: "30-day policy" },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 glass rounded-xl">
                <item.icon className="w-5 h-5 text-aether-400 mx-auto mb-1" />
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">{dict.product.reviews}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="glass-card rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aether-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                    {review.user.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user.name || "Anonymous"}</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-aether-400 text-aether-400" : "text-gray-600"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {review.title && <p className="text-sm font-semibold">{review.title}</p>}
                {review.comment && <p className="text-sm text-gray-400">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {product.related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">{dict.product.relatedProducts}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.related.map((p, i) => (
              <ProductCard key={p.id} {...p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
