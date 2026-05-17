"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/store/cart-store"
import { useCurrencyStore } from "@/hooks/use-currency"
import { convertPrice, formatCurrency } from "@/lib/currency"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import type { Locale } from "@/types"

export function CartSlideover() {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const { currency } = useCurrencyStore()
  const subtotal = convertPrice(getSubtotal(), "USD", currency)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[70] bg-surface border-l border-white/5 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-semibold">{dict.cart.title}</h2>
                <button onClick={closeCart} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400">{dict.cart.empty}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="glass rounded-2xl p-4"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-aether-500/20 to-pink-500/20 flex items-center justify-center text-2xl">
                              <ShoppingBag className="w-8 h-8 text-aether-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/${locale}/products/${item.slug}`} onClick={closeCart} className="text-sm font-medium text-white hover:text-aether-300 transition-colors line-clamp-1">
                              {item.name}
                            </Link>
                            <p className="text-sm text-aether-400 mt-1">
                              {formatCurrency(convertPrice(item.price, "USD", currency), currency)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="ml-auto text-gray-500 hover:text-red-400 text-xs transition-colors"
                              >
                                {dict.common.delete}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{dict.cart.subtotal}</span>
                    <span className="text-lg font-semibold">{formatCurrency(subtotal, currency)}</span>
                  </div>
                  <Link href={`/${locale}/checkout`} onClick={closeCart}>
                    <Button className="w-full" size="lg">
                      <ShoppingBag className="w-4 h-4" />
                      {dict.cart.checkout}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
