"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"
import type { Locale } from "@/types"

export function NewsletterSection() {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const [email, setEmail] = useState("")

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-aether-600/10 via-transparent to-pink-600/10" />
        <div className="relative">
          <Sparkles className="w-10 h-10 text-aether-400 mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            {dict.home.newsletter}
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Be the first to know about exclusive drops, early access, and members-only offers.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setEmail("")
            }}
            className="flex items-center gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-aether-500 transition-all"
            />
            <Button type="submit">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
