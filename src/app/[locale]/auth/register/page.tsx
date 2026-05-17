"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toaster"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { Locale } from "@/types"

export default function RegisterPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        toast("Account created! Please sign in.", "success")
        router.push(`/${locale}/auth/login`)
      } else {
        const data = await res.json()
        toast(data.error || "Registration failed", "error")
      }
    } catch {
      toast("Something went wrong", "error")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <Sparkles className="w-8 h-8 text-aether-400 mx-auto" />
            <h1 className="text-2xl font-bold">{dict.auth.register}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={dict.auth.name} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label={dict.auth.email} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label={dict.auth.password} id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              {dict.auth.register}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            {dict.auth.hasAccount}{" "}
            <Link href={`/${locale}/auth/login`} className="text-aether-400 hover:text-aether-300 transition-colors">
              {dict.auth.login}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
