import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ÆTHERIS — Luxury Redefined",
  description: "Discover ÆTHERIS — a curated collection of premium products redefining modern elegance.",
  openGraph: { title: "ÆTHERIS — Luxury Redefined", description: "Discover ÆTHERIS — a curated collection of premium products redefining modern elegance.", siteName: "ÆTHERIS", type: "website" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  )
}
