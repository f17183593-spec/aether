"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Package, AlertTriangle, Truck, Sparkles, BellRing } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { AppNotification } from "@/lib/notifications"

const iconMap: Record<string, typeof Package> = {
  new_order: Package,
  low_stock: AlertTriangle,
  order_shipped: Truck,
  welcome: Sparkles,
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((data) => setNotifications(data.notifications || []))
        .catch(() => {})
    }
  }, [session])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
      >
        {notifications.length > 0 ? <BellRing className="w-5 h-5 text-amber-400" /> : <Bell className="w-5 h-5" />}
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 mt-2 w-80 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-semibold">Notifications</span>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No notifications</div>
              ) : (
                notifications.map((n) => {
                  const Icon = iconMap[n.type] || Bell
                  return (
                    <Link
                      key={n.id}
                      href={n.link || "#"}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-aether-500/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-aether-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-gray-500 truncate">{n.message}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{formatDate(n.createdAt)}</p>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
