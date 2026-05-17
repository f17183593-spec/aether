import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getDictionary, isRTL } from "@/lib/i18n"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Check } from "lucide-react"
import { VendorOrdersClient } from "./orders-client"
import type { Locale } from "@/types"

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  DELIVERED: "success",
  SHIPPED: "info",
  PROCESSING: "warning",
  PENDING: "default",
  CANCELLED: "danger",
}

export default async function VendorOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  const dict = getDictionary(locale as Locale)

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{dict.vendor.orders}</h1>
        <VendorOrdersClient orders={orders.map((o) => ({
          orderNumber: o.orderNumber,
          customerName: o.user?.name || "N/A",
          customerEmail: o.user?.email || "",
          total: o.total,
          status: o.status,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt.toISOString(),
        }))} />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">{dict.vendor.orders}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{dict.auth.name}</th>
                <th className="text-left p-4 text-gray-400 font-medium">Items</th>
                <th className="text-left p-4 text-gray-400 font-medium">Total</th>
                <th className="text-left p-4 text-gray-400 font-medium">Payment</th>
                <th className="text-left p-4 text-gray-400 font-medium">Fulfillment</th>
                <th className="text-right p-4 text-gray-400 font-medium">{dict.vendor.fulfillOrder}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">#{order.orderNumber}</td>
                  <td className="p-4">
                    <p>{order.user?.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      {order.items.slice(0, 3).map((item) => (
                        <span key={item.id} className="text-xs text-gray-400">
                          {item.product?.name || "Product"} x{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-gray-600">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <Button variant="ghost" size="sm">
                        <Package className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {order.status === "DELIVERED" && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 justify-end">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
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
