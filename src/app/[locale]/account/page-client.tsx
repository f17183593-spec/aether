"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatPrice } from "@/lib/utils"
import { Package, Gift, Medal, Wallet } from "lucide-react"
import type { Locale } from "@/types"

const tierColors: Record<string, string> = {
  BRONZE: "text-amber-600",
  SILVER: "text-gray-300",
  GOLD: "text-yellow-400",
  PLATINUM: "text-aether-400",
}

export function AccountClient({
  orders,
  loyaltyPoints,
  tier,
  userName,
}: {
  orders: any[]
  loyaltyPoints: number
  tier: string
  userName: string
}) {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aether-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
          {userName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{userName}</h1>
          <p className="text-sm text-gray-500">Welcome back</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <Gift className="w-8 h-8 text-aether-400" />
          <div>
            <p className="text-2xl font-bold">{loyaltyPoints}</p>
            <p className="text-xs text-gray-500">Loyalty Points</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <Medal className="w-8 h-8 text-aether-400" />
          <div>
            <p className={`text-lg font-bold ${tierColors[tier] || "text-gray-300"}`}>{tier}</p>
            <p className="text-xs text-gray-500">Membership Tier</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <Package className="w-8 h-8 text-aether-400" />
          <div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href={`/${locale}/account/loyalty`} className="glass-card rounded-2xl p-5 flex-1 flex items-center gap-3 hover:border-aether-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aether-500 to-purple-500 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Loyalty Wallet</p>
            <p className="text-xs text-gray-500">{loyaltyPoints} points</p>
          </div>
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-aether-400" /> Recent Orders
        </h2>
        {orders.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-gray-500">No orders yet</p>
            <Link href={`/${locale}/products`} className="text-aether-400 text-sm hover:text-aether-300 mt-2 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge
                    variant={
                      order.status === "DELIVERED" ? "success" :
                      order.status === "CANCELLED" ? "danger" :
                      order.status === "SHIPPED" ? "info" : "warning"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{order.items?.length || 0} items</span>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
