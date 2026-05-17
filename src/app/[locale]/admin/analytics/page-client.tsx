"use client"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area } from "recharts"
import { formatPrice } from "@/lib/utils"

export function AnalyticsClient({ stats }: { stats: any }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.revenueByDay}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" fill="url(#revGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ordersByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="status" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold gradient-text">{stats.totalOrders}</p>
          <p className="text-xs text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold gradient-text">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold gradient-text">{stats.totalUsers}</p>
          <p className="text-xs text-gray-500 mt-1">Total Users</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold gradient-text">{stats.totalProducts}</p>
          <p className="text-xs text-gray-500 mt-1">Products</p>
        </div>
      </div>
    </div>
  )
}
