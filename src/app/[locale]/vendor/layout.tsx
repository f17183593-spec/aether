import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Locale } from "@/types"

export default async function VendorLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  if (session?.user?.role !== "VENDOR" && session?.user?.role !== "ADMIN") {
    redirect(`/${locale}/auth/login`)
  }
  return <>{children}</>
}
