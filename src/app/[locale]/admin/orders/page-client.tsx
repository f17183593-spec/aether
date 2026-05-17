"use client"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  DELIVERED: "success",
  SHIPPED: "info",
  PROCESSING: "warning",
  PENDING: "default",
  CANCELLED: "danger",
}

export function AdminOrdersClient({ orders }: { orders: any[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Order</th>
                <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Total</th>
                <th className="text-left p-4 text-gray-400 font-medium">Payment</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
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
                  <td className="p-4 text-gray-400">{formatDate(order.createdAt)}</td>
                  <td className="p-4">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusColors[order.status] || "default"}>{order.status}</Badge>
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
