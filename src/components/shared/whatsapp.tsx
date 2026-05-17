"use client"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+1234567890"

export function WhatsAppWidget() {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-2xl shadow-emerald-500/25 flex items-center justify-center text-white hover:shadow-emerald-500/40 transition-shadow"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  )
}
