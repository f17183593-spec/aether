import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDictionary, isRTL } from "@/lib/i18n"
import { formatPrice } from "@/lib/utils"
import { DollarSign, Package, ShoppingCart, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { VendorDashboardClient } from "./dashboard-client"
import type { Locale } from "@/types"

export default async function VendorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  const dict = getDictionary(locale as Locale)
  const rtl = isRTL(locale as Locale)

  const [totalProducts, totalOrders, revenue, pendingCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } }, items: { take: 3, include: { product: { select: { name: true } } } } },
  })

  const lowStockProducts = await prisma.product.findMany({
    where: { inStock: true, stock: { lte: 5 } },
    select: { id: true, name: true, stock: true },
    orderBy: { stock: "asc" },
    take: 10,
  })

  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  })

  const revenueByDay = paidOrders.reverse().map((o) => ({
    date: o.createdAt.toISOString().split("T")[0],
    revenue: o.total,
  }))

  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  })

  const cards = [
    { label: dict.vendor.totalSales, value: totalOrders, icon: ShoppingCart, color: "from-blue-500 to-indigo-500" },
    { label: dict.vendor.activeListings, value: totalProducts, icon: Package, color: "from-aether-500 to-purple-500" },
    { label: dict.vendor.revenue, value: formatPrice(revenue._sum.total ?? 0), icon: DollarSign, color: "from-emerald-500 to-teal-500" },
    { label: dict.vendor.pendingOrders, value: pendingCount, icon: TrendingUp, color: "from-amber-500 to-orange-500" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">{dict.vendor.dashboard}</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card rounded-2xl p-5 space-y-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <VendorDashboardClient revenueByDay={revenueByDay} ordersByStatus={ordersByStatus.map((r) => ({ status: r.status, count: r._count }))} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{dict.vendor.orders}</h2>
            <Link href={`/${locale}/vendor/orders`} className="text-xs text-aether-400 hover:text-aether-300 transition-colors">
              {dict.common.viewAll} &rarr;
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">{dict.common.noResults}</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.user?.name || "N/A"}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatPrice(order.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" /> {dict.admin.lowStock}
          </h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500">{dict.common.noResults}</p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm">{p.name}</span>
                  <span className="text-xs text-amber-400 font-medium">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { href: `/${locale}/vendor/products`, label: dict.vendor.products, icon: Package },
          { href: `/${locale}/vendor/orders`, label: dict.vendor.orders, icon: ShoppingCart },
          { href: `/${locale}/products/new`, label: dict.vendor.addProduct, icon: TrendingUp },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="glass-card rounded-2xl p-5 text-center hover:border-aether-500/30 transition-all">
            <link.icon className="w-6 h-6 text-aether-400 mx-auto mb-2" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
