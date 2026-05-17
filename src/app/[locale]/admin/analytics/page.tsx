import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/lib/analytics"
import { AnalyticsClient } from "./page-client"

export default async function AdminAnalyticsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect(`/${locale}/auth/login`)

  const stats = await getDashboardStats()
  return <AnalyticsClient stats={stats} />
}
