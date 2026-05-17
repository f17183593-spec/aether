"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/store/cart-store"
import { useCurrencyStore } from "@/hooks/use-currency"
import { convertPrice, formatCurrency } from "@/lib/currency"
import { getDictionary } from "@/lib/i18n"
import { calculateTax, getTaxLabel } from "@/lib/tax"
import { getShippingRates } from "@/lib/shipping"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toaster"
import { ChevronLeft, ChevronRight, CreditCard, Truck, Check, Lock } from "lucide-react"
import type { Locale, Currency } from "@/types"

const steps = ["shipping", "payment", "review"]

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const { items, getSubtotal, clearCart } = useCartStore()
  const { currency } = useCurrencyStore()
  const [step, setStep] = useState(0)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [shippingMethod, setShippingMethod] = useState("Standard")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<{
    email: string
    line1: string
    city: string
    postalCode: string
    country: string
  }>({
    email: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "US",
  })

  const subtotal = convertPrice(getSubtotal(), "USD", currency)
  const shipping = convertPrice(getShippingRates(formData.country).find(r => r.name === shippingMethod)?.cost || 0, "USD", currency)
  const tax = calculateTax(subtotal, formData.country)
  const total = subtotal + shipping + tax - discount

  const placeOrder = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            line1: formData.line1,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          paymentMethod: "stripe",
          couponCode: couponCode || undefined,
          shippingMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")
      clearCart()
      toast("Order placed successfully!", "success")
      router.push(`/${locale}/account`)
    } catch (err) {
      toast(err instanceof Error ? err.message : "Checkout failed", "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Your cart is empty</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push(`/${locale}/products`)}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl lg:text-3xl font-bold mb-8">{dict.checkout.title}</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
              i <= step ? "bg-aether-500/20 text-aether-300 border border-aether-500/30" : "bg-white/5 text-gray-500"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-white" : "text-gray-500"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-aether-500/50" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-aether-400" /> {dict.checkout.shipping}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Email" id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Address" id="line1" value={formData.line1} onChange={(e) => setFormData({ ...formData, line1: e.target.value })} />
                  </div>
                  <Input label="City" id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  <Input label="Postal Code" id="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">Country</label>
                    <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-aether-500">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="EG">Egypt</option>
                      <option value="AE">UAE</option>
                      <option value="SA">Saudi Arabia</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Shipping Method</p>
                  {getShippingRates(formData.country).map((rate) => (
                    <label key={rate.name} className="flex items-center justify-between p-3 glass rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={shippingMethod === rate.name} onChange={() => setShippingMethod(rate.name)} className="accent-aether-500" />
                        <div>
                          <p className="text-sm font-medium">{rate.name}</p>
                          <p className="text-xs text-gray-500">{rate.estimatedDays} business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(convertPrice(rate.cost, "USD", currency), currency)}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={() => setStep(1)}>
                    Next: Payment <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-aether-400" /> {dict.checkout.payment}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "stripe", label: "Stripe", icon: "💳" },
                    { id: "paypal", label: "PayPal", icon: "🅿️" },
                    { id: "fawry", label: "Fawry", icon: "🇪🇬" },
                  ].map((pm) => (
                    <label key={pm.id} className="flex flex-col items-center gap-2 p-4 glass rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <input type="radio" name="payment" value={pm.id} className="accent-aether-500" />
                      <span className="text-sm font-medium">{pm.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> All transactions are secure and encrypted.
                </p>
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={() => setStep(2)}>
                    Next: Review <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-aether-400" /> {dict.checkout.review}
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm">{formatCurrency(convertPrice(item.price * item.quantity, "USD", currency), currency)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={dict.checkout.coupon} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aether-500" />
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={placeOrder} isLoading={submitting}>
                    {dict.checkout.placeOrder}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 space-y-4 sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{dict.cart.subtotal}</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>{formatCurrency(shipping, currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{getTaxLabel(formData.country)}</span>
                <span>{formatCurrency(tax, currency)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount, currency)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="gradient-text">{formatCurrency(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
