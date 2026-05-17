"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { CsvExportButton } from "@/components/shared/CsvExportButton"
import { formatPrice } from "@/lib/utils"
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, PieChart as PieIcon } from "lucide-react"
import type { Locale } from "@/types"

const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]

export function AdminDashboardClient({ stats }: { stats: any }) {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"

  const csvHeaders = ["Metric", "Value"]
  const csvRows = [
    ["Total Revenue", formatPrice(stats.totalRevenue)],
    ["Total Orders", String(stats.totalOrders)],
    ["Total Users", String(stats.totalUsers)],
    ["Total Products", String(stats.totalProducts)],
    ["Conversion Rate", `${stats.conversionRate?.toFixed(2) || "0"}%`],
    ...(stats.ordersByStatus || []).map((o: any) => [`Orders (${o.status})`, String(o.count)]),
  ]

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "from-emerald-500 to-teal-500" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "from-blue-500 to-indigo-500" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-aether-500 to-purple-500" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "from-pink-500 to-rose-500" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
        <CsvExportButton filename="admin-dashboard" headers={csvHeaders} rows={csvRows} />
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

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="text-lg font-bold">{stats.conversionRate?.toFixed(2) || "0"}%</p>
            <p className="text-xs text-gray-500">Conversion Rate</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-lg font-bold">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-3">
          <PieIcon className="w-8 h-8 text-aether-400" />
          <div>
            <p className="text-lg font-bold">{stats.categories?.length || 0}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.revenueByDay}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats.ordersByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="status" label>
                {stats.ordersByStatus.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {(stats.categories?.length || 0) > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Bar dataKey="productCount" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgPrice" fill="#ec4899" radius={[4, 4, 0, 0]} hide />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.lowStockProducts?.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
          </h3>
          <div className="space-y-2">
            {stats.lowStockProducts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm">{p.name}</span>
                <Badge variant="warning">{p.stock} left</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: `/${locale}/admin/products`, label: "Manage Products", icon: Package },
          { href: `/${locale}/admin/orders`, label: "Manage Orders", icon: ShoppingCart },
          { href: `/${locale}/admin/users`, label: "Manage Users", icon: Users },
          { href: `/${locale}/admin/analytics`, label: "Analytics", icon: BarChart },
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
