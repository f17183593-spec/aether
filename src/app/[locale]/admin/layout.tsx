import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)
  return <>{children}</>
}
