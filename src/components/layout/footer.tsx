"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getDictionary } from "@/lib/i18n"
import type { Locale } from "@/types"

export function Footer() {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"

  return (
    <footer className="relative border-t border-white/5 mt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aether-950/20 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="text-xl font-bold gradient-text">ÆTHERIS</Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Redefining luxury e-commerce through cutting-edge design and unparalleled quality.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Shop</h4>
            <div className="space-y-2.5">
              {["All Products", "New Arrivals", "Featured", "Categories"].map((item) => (
                <Link key={item} href={`/${locale}/products`} className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Support</h4>
            <div className="space-y-2.5">
              {["Contact Us", "Shipping Info", "Returns", "FAQ"].map((item) => (
                <Link key={item} href={`/${locale}`} className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Connect</h4>
            <div className="space-y-2.5">
              {["Instagram", "Twitter / X", "TikTok", "YouTube"].map((item) => (
                <Link key={item} href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} ÆTHERIS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link key={item} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
