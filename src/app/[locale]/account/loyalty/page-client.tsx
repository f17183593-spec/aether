"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Gift, Medal, Coins, TicketCheck, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDictionary } from "@/lib/i18n"
import { formatDate } from "@/lib/utils"
import type { Locale } from "@/types"

const tierColors: Record<string, string> = {
  BRONZE: "text-amber-600",
  SILVER: "text-gray-300",
  GOLD: "text-yellow-400",
  PLATINUM: "text-aether-400",
}

const tierGradients: Record<string, string> = {
  BRONZE: "from-amber-700 to-amber-500",
  SILVER: "from-gray-500 to-gray-300",
  GOLD: "from-yellow-600 to-yellow-400",
  PLATINUM: "from-aether-600 to-aether-400",
}

export function LoyaltyClient({
  points,
  tier,
  transactions,
  locale,
}: {
  points: number
  tier: string
  transactions: { id: string; points: number; type: string; description: string | null; createdAt: Date }[]
  locale: string
}) {
  const dict = getDictionary(locale as Locale)
  const [redeemAmount, setRedeemAmount] = useState(100)
  const [redeeming, setRedeeming] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleRedeem = async () => {
    setRedeeming(true)
    setResult(null)
    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: redeemAmount }),
      })
      const data = await res.json()
      if (data.success) {
        setResult({
          success: true,
          message: dict.wallet.couponCreated.replace("{code}", data.coupon.code).replace("{value}", `$${data.coupon.discountValue}`),
        })
      } else {
        setResult({ success: false, message: data.error || "Redemption failed" })
      }
    } catch {
      setResult({ success: false, message: "Network error" })
    }
    setRedeeming(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{dict.wallet.title}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aether-500 to-purple-500 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold">{points}</p>
            <p className="text-xs text-gray-500">{dict.wallet.points}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierGradients[tier] || tierGradients.BRONZE} flex items-center justify-center`}>
            <Medal className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className={`text-xl font-bold ${tierColors[tier] || "text-gray-300"}`}>{tier}</p>
            <p className="text-xs text-gray-500">{dict.wallet.tier}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">{dict.wallet.conversionRate}</p>
            <p className="text-xs text-gray-500">{dict.wallet.pointsToCoupon}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <TicketCheck className="w-4 h-4 text-aether-400" /> {dict.wallet.redeemTitle}
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={100}
              max={points}
              step={100}
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(Math.max(100, Math.min(points, Number(e.target.value) || 0)))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-aether-500 transition-all text-sm"
            />
            <span className="text-xs text-gray-500 shrink-0">= ${Math.floor(redeemAmount / 100)} off</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRedeem}
            disabled={redeeming || redeemAmount < 100 || redeemAmount > points}
            className="w-full"
          >
            {redeeming ? "..." : dict.wallet.redeemButton}
          </Button>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm p-3 rounded-xl ${result.success ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
            >
              {result.message}
            </motion.div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <History className="w-4 h-4 text-aether-400" /> {dict.wallet.pointsHistory}
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">{dict.wallet.noTransactions}</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm truncate">{tx.description || tx.type}</p>
                    <p className="text-[10px] text-gray-600">{formatDate(tx.createdAt)}</p>
                  </div>
                  <Badge variant={tx.points > 0 ? "success" : "warning"}>
                    {tx.points > 0 ? "+" : ""}{tx.points}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
