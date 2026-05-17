"use client"
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]

export function VendorDashboardClient({
  revenueByDay,
  ordersByStatus,
}: {
  revenueByDay: { date: string; revenue: number }[]
  ordersByStatus: { status: string; count: number }[]
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueByDay}>
            <defs>
              <linearGradient id="vendorRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#vendorRevGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-4">Orders by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="status" label>
              {ordersByStatus.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
