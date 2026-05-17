"use client"
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Locale } from "@/types"
import { isRTL } from "@/lib/i18n"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  if (!mounted) return null

  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
}
