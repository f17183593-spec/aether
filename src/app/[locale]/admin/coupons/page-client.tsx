"use client"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export function CouponsClient({ coupons }: { coupons: any[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                <th className="text-left p-4 text-gray-400 font-medium">Discount</th>
                <th className="text-left p-4 text-gray-400 font-medium">Min Order</th>
                <th className="text-left p-4 text-gray-400 font-medium">Uses</th>
                <th className="text-left p-4 text-gray-400 font-medium">Expires</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{coupon.code}</td>
                  <td className="p-4">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </td>
                  <td className="p-4 text-gray-400">{coupon.minOrderAmount ? `$${coupon.minOrderAmount}` : "-"}</td>
                  <td className="p-4">{coupon.usedCount}/{coupon.maxUses || "∞"}</td>
                  <td className="p-4 text-gray-400">{coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}</td>
                  <td className="p-4">
                    <Badge variant={coupon.isActive ? "success" : "danger"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
