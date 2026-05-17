"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

let addToastFn: ((t: Omit<Toast, "id">) => void) | null = null

export function toast(message: string, type: Toast["type"] = "info") {
  addToastFn?.({ message, type })
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastFn = ({ message, type }) => {
      const id = Math.random().toString(36).substring(2)
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    }
    return () => { addToastFn = null }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2" dir="ltr">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            onClick={() => removeToast(t.id)}
            className={`px-4 py-3 rounded-xl shadow-2xl cursor-pointer text-sm font-medium backdrop-blur-xl border ${
              t.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : t.type === "error"
                ? "bg-red-500/20 border-red-500/30 text-red-300"
                : "bg-aether-500/20 border-aether-500/30 text-aether-300"
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
