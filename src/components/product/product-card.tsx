"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useCartStore } from "@/store/cart-store"
import { useCurrencyStore } from "@/hooks/use-currency"
import { convertPrice, formatCurrency } from "@/lib/currency"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import type { Locale } from "@/types"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  stock: number
  category?: string
  index?: number
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  images,
  rating,
  reviewCount,
  inStock,
  stock,
  category,
  index = 0,
}: ProductCardProps) {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const { addItem } = useCartStore()
  const { currency } = useCurrencyStore()

  const discount = compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        <Link href={`/${locale}/products/${slug}`}>
          <div className="relative aspect-square bg-gradient-to-br from-aether-900/20 to-pink-900/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent z-10" />
            {discount > 0 && (
              <div className="absolute top-3 left-3 z-20">
                <Badge variant="danger">-{discount}%</Badge>
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/60 backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-400">{dict.product.outOfStock}</span>
              </div>
            )}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">✦</div>
            </div>
          </div>
        </Link>

        <div className="p-4 space-y-2">
          {category && <p className="text-[10px] uppercase tracking-widest text-gray-500">{category}</p>}
          <Link href={`/${locale}/products/${slug}`}>
            <h3 className="font-medium text-sm leading-tight group-hover:text-aether-300 transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(rating) ? "fill-aether-400 text-aether-400" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold gradient-text">
                {formatCurrency(convertPrice(price, "USD", currency), currency)}
              </span>
              {compareAtPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(convertPrice(compareAtPrice, "USD", currency), currency)}
                </span>
              )}
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="secondary"
                size="sm"
                disabled={!inStock}
                onClick={() =>
                  addItem({
                    id,
                    productId: id,
                    name,
                    slug,
                    price,
                    image: images[0] || "",
                    quantity: 1,
                    stock,
                  })
                }
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
