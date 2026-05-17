import { Providers } from "@/components/layout/providers"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartSlideover } from "@/components/cart/cart-slideover"
import { WhatsAppWidget } from "@/components/shared/whatsapp"
import { isRTL } from "@/lib/i18n"
import type { Locale } from "@/types"

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const rtl = isRTL(locale as Locale)

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <body className="min-h-screen flex flex-col antialiased bg-surface text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16 lg:pt-20">{children}</main>
          <Footer />
          <CartSlideover />
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  )
}
