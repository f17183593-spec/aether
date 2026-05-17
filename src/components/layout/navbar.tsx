"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/store/cart-store"
import { useCurrencyStore } from "@/hooks/use-currency"
import { getDictionary, isRTL } from "@/lib/i18n"
import { getAvailableCurrencies, getCurrencyInfo } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X, Search, Globe, ChevronDown } from "lucide-react"
import { NotificationBell } from "./NotificationBell"
import type { Locale, Currency } from "@/types"

export function Navbar() {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)
  const rtl = isRTL(locale)
  const { data: session } = useSession()
  const { items, openCart, getItemCount } = useCartStore()
  const { currency, setCurrency } = useCurrencyStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/products`, label: dict.nav.products },
  ]

  const otherLocales: Locale[] = ["en", "ar"]
  const currencies = getAvailableCurrencies()
  const itemCount = getItemCount()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-2xl border-b border-white/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-8">
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <span className="text-xl font-bold gradient-text tracking-tight">ÆTHERIS</span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 text-sm rounded-xl transition-all duration-300",
                      pathname === link.href
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
                >
                  {getCurrencyInfo(currency).symbol}
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-40 glass rounded-2xl p-1.5 border border-white/10 shadow-2xl"
                    >
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCurrency(c.code as Currency); setCurrencyOpen(false) }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-xl transition-all",
                            currency === c.code
                              ? "bg-aether-500/20 text-aether-300"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {c.symbol} {c.code} - {c.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {otherLocales.filter((l) => l !== locale).map((l) => (
                <Link
                  key={l}
                  href={pathname.replace(`/${locale}`, `/${l}`)}
                  className="p-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase"
                >
                  {l}
                </Link>
              ))}

              <NotificationBell />

              <button
                onClick={openCart}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-aether-500 to-pink-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {session?.user ? (
                <div className="hidden md:flex items-center gap-3">
                  {session.user.role === "VENDOR" && (
                    <Link href={`/${locale}/vendor`}>
                      <Button variant="ghost" size="sm">{dict.nav.vendor}</Button>
                    </Link>
                  )}
                  <Link href={session.user.role === "ADMIN" ? `/${locale}/admin` : session.user.role === "VENDOR" ? `/${locale}/vendor` : `/${locale}/account`}>
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4" />
                      {session.user.role === "ADMIN" ? dict.nav.admin : session.user.role === "VENDOR" ? dict.nav.vendor : dict.nav.account}
                    </Button>
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {dict.nav.logout}
                  </button>
                </div>
              ) : (
                <Link href={`/${locale}/auth/login`} className="hidden md:block">
                  <Button variant="primary" size="sm">{dict.nav.login}</Button>
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white rounded-xl"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-white/5 bg-surface/95 backdrop-blur-xl"
            >
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dict.nav.search}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-aether-500 transition-all"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-16 bg-surface/95 backdrop-blur-2xl md:hidden"
          >
            <div className="p-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm transition-all",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/5 my-4" />
              {session?.user ? (
                <>
                  <Link href={session.user.role === "ADMIN" ? `/${locale}/admin` : `/${locale}/account`} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
                    {session.user.role === "ADMIN" ? dict.nav.admin : dict.nav.account}
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="block w-full text-left px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
                    {dict.nav.logout}
                  </button>
                </>
              ) : (
                <Link href={`/${locale}/auth/login`} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-aether-400 hover:text-aether-300">
                  {dict.nav.login}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
