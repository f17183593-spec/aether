import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/lib/analytics"
import { AdminDashboardClient } from "@/components/admin/dashboard-client"

export default async function AdminPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)

  const stats = await getDashboardStats()

  return <AdminDashboardClient stats={stats} />
}
